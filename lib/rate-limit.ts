import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const DAILY_RECEIPT_LIMIT = 30;

type Limiters = { daily: Ratelimit; burst: Ratelimit };

let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiters = null;
    return limiters;
  }

  const redis = new Redis({ url, token });
  limiters = {
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_RECEIPT_LIMIT, '1 d'),
      analytics: true,
      timeout: 0,
    }),
    burst: new Ratelimit({
      redis,
      prefix: 'receipthero:burst',
      limiter: Ratelimit.slidingWindow(15, '1 m'),
      timeout: 0,
    }),
  };
  return limiters;
}

export type RateLimitResult = 'ok' | 'limited' | 'unavailable';

export async function checkOcrRateLimit(ip: string): Promise<RateLimitResult> {
  const active = getLimiters();
  if (!active) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Rate limiter is not configured');
      return 'unavailable';
    }
    return 'ok';
  }

  try {
    const burst = await active.burst.limit(ip);
    if (!burst.success) return 'limited';
    const daily = await active.daily.limit(ip);
    if (!daily.success) return 'limited';
    return 'ok';
  } catch (error) {
    console.error(
      'Rate limiter unavailable:',
      error instanceof Error ? error.message : 'unknown error'
    );
    return 'unavailable';
  }
}

export function getClientIp(headers: Pick<Headers, 'get'>): string {
  const vercelIp =
    firstListValue(headers.get('x-real-ip')) ??
    firstListValue(headers.get('x-vercel-forwarded-for'));
  if (vercelIp) return normalizeIp(vercelIp);

  if (process.env.VERCEL !== '1') {
    const forwarded = firstListValue(headers.get('x-forwarded-for'));
    return forwarded ? normalizeIp(forwarded) : 'local';
  }

  return 'unknown';
}

function firstListValue(value: string | null) {
  const first = value?.split(',')[0]?.trim();
  return first || null;
}

function normalizeIp(raw: string): string {
  const ip = raw.trim().toLowerCase().slice(0, 64);
  if (!ip.includes(':')) return ip;

  const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];

  const groups = expandIpv6(ip);
  return groups ? `${groups.slice(0, 4).join(':')}::/64` : ip;
}

function expandIpv6(ip: string): string[] | null {
  const halves = ip.split('%')[0].split('::');
  if (halves.length > 2) return null;

  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;

  const groups = [...head, ...Array<string>(missing).fill('0'), ...tail];
  if (!groups.every((group) => /^[0-9a-f]{1,4}$/.test(group))) return null;
  return groups.map((group) => group.replace(/^0+(?=.)/, ''));
}
