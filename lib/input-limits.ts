export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
export const MAX_REQUEST_BYTES = MAX_BASE64_LENGTH + 1024;

export function isAllowedImageType(value: unknown): value is AllowedImageType {
  return (
    typeof value === 'string' &&
    (ALLOWED_IMAGE_TYPES as readonly string[]).includes(value)
  );
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

export function detectImageType(base64: string): AllowedImageType | null {
  if (base64.length % 4 !== 0 || !BASE64_PATTERN.test(base64)) return null;

  const head = Buffer.from(base64.slice(0, 24), 'base64');
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    head[0] === 0x89 &&
    head.subarray(1, 4).toString('latin1') === 'PNG'
  ) {
    return 'image/png';
  }
  if (
    head.subarray(0, 4).toString('latin1') === 'RIFF' &&
    head.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}
