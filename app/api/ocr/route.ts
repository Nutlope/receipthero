import { NextResponse } from 'next/server';
import { togetheraiClient } from '@/lib/client';
import { z } from 'zod';
import { ProcessedReceiptSchema } from '@/lib/types';
import {
  DAILY_RECEIPT_LIMIT,
  checkOcrRateLimit,
  getClientIp,
} from '@/lib/rate-limit';
import {
  MAX_BASE64_LENGTH,
  MAX_REQUEST_BYTES,
  detectImageType,
} from '@/lib/input-limits';

const invalidImageResponse = () =>
  NextResponse.json(
    { error: 'Unsupported image. Please upload a JPEG, PNG or WebP image.' },
    { status: 400 }
  );

const tooLargeResponse = () =>
  NextResponse.json(
    { error: 'Image is too large. Please upload a smaller image.' },
    { status: 413 }
  );

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get('content-length'));
    if (contentLength > MAX_REQUEST_BYTES) {
      return tooLargeResponse();
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BYTES) {
      return tooLargeResponse();
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const base64Image =
      body && typeof body === 'object'
        ? (body as { base64Image?: unknown }).base64Image
        : undefined;

    if (!base64Image || typeof base64Image !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: base64Image' },
        { status: 400 }
      );
    }

    if (base64Image.length > MAX_BASE64_LENGTH) {
      return tooLargeResponse();
    }

    const mimeType = detectImageType(base64Image);
    if (!mimeType) {
      return invalidImageResponse();
    }

    const rateLimit = await checkOcrRateLimit(getClientIp(request.headers));

    if (rateLimit === 'unavailable') {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    if (rateLimit === 'limited') {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: `You've reached the limit of ${DAILY_RECEIPT_LIMIT} receipts per day. Please slow down or try again later. Contact @nutlope on X/Twitter for higher limits.`,
        },
        { status: 429 }
      );
    }

    const receiptSchema = z.object({
      receipts: z.array(ProcessedReceiptSchema),
    });
    const jsonSchema = z.toJSONSchema(receiptSchema);

    const response = await togetheraiClient.chat.completions.create({
      model: 'moonshotai/Kimi-K2.6',
      reasoning: { enabled: false },
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting receipt data. Extract all receipts from the image as a JSON object matching the schema.

CRITICAL FORMATTING REQUIREMENTS:
- Date MUST be in YYYY-MM-DD format (e.g., "2024-01-15", not "01/15/2024" or "Jan 15, 2024")
- Convert any date format to YYYY-MM-DD
- If date is ambiguous, use the most recent logical date

CURRENCY EXTRACTION:
- ALWAYS include a currency field in the response
- Extract the currency code (e.g., "USD", "EUR", "AED", "GBP", "CAD", etc.) from currency symbols or explicit mentions
- Common currency symbols: $ = USD, € = EUR, £ = GBP, AED = AED (or د.إ), etc.
- If no currency symbol is visible on the receipt, use "USD" as the default
- Currency field should be the 3-letter currency code (ISO 4217 format)

CATEGORIZATION RULES:
- Grocery stores (Walmart, Target, Kroger, Safeway, Whole Foods, Trader Joe's, Costco, Sam's Club, Aldi, Publix, Wegmans): "groceries"
- Restaurants/Fast food (McDonald's, Starbucks, Chipotle, Taco Bell, Subway, etc.): "dining"
- Gas stations (Shell, Exxon, Chevron, BP, Speedway, etc.): "gas"
- Pharmacies (CVS, Walgreens, Rite Aid, etc.): "healthcare"
- Department stores (Macy's, Kohl's, JCPenney, etc.): "shopping"
- Electronics (Best Buy, Apple Store, etc.): "electronics"
- Home improvement (Home Depot, Lowe's, etc.): "home"
- Clothing (Gap, Old Navy, H&M, etc.): "clothing"
- Online services (Amazon, eBay, etc.): "shopping"
- Utilities (electric, gas, water, internet): "utilities"
- Entertainment (movies, concerts, etc.): "entertainment"
- Travel (hotels, airlines, etc.): "travel"
- Other: Use your best judgment to categorize appropriately

PAYMENT METHODS: Common values include "cash", "credit", "debit", "check", "gift card", "digital wallet"

Extract all visible receipt data accurately. If information is not visible, use reasonable defaults or omit if not applicable. Respond only with valid JSON.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract receipt data from this image following the formatting and categorization rules.',
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'receipt_extraction',
          schema: jsonSchema,
        },
      },
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'OCR extraction failed' },
        { status: 502 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: 'OCR extraction failed' },
        { status: 502 }
      );
    }

    const validated = receiptSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error(
        'OCR validation failed:',
        validated.error.issues.length,
        'schema issues'
      );
      return NextResponse.json(
        { error: 'Could not read receipt data from this image' },
        { status: 422 }
      );
    }

    return NextResponse.json({ receipts: validated.data.receipts });
  } catch (error) {
    console.error(
      '/api/ocr error',
      error instanceof Error ? error.name : 'unknown error',
      (error as { status?: unknown })?.status ?? ''
    );
    return NextResponse.json(
      { error: 'Internal error while performing OCR' },
      { status: 500 }
    );
  }
}
