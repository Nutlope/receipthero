import { NextResponse } from "next/server";
import { togetheraiClient } from "@/lib/client";
import { z } from "zod";
import { ProcessedReceiptSchema } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();

    if (!base64Image || typeof base64Image !== "string") {
      return NextResponse.json(
        { error: "Missing required field: base64Image" },
        { status: 400 }
      );
    }

    const receiptSchema = z.object({
      receipts: z.array(ProcessedReceiptSchema),
    });
    const jsonSchema = z.toJSONSchema(receiptSchema);

    const response = await togetheraiClient.chat.completions.create({
      model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
      messages: [
        {
          role: "system",
          content: `You are an expert at extracting receipt data. Extract all receipts from the image as a JSON object matching the schema.

CRITICAL FORMATTING REQUIREMENTS:
- Date MUST be in YYYY-MM-DD format (e.g., "2024-01-15", not "01/15/2024" or "Jan 15, 2024")
- Convert any date format to YYYY-MM-DD
- If date is ambiguous, use the most recent logical date

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
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract receipt data from this image following the formatting and categorization rules.",
            },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      response_format: { type: "json_object", schema: jsonSchema },
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "OCR extraction failed: empty response" },
        { status: 502 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON from model" },
        { status: 502 }
      );
    }

    const validated = receiptSchema.safeParse(parsedJson);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.message },
        { status: 422 }
      );
    }

    return NextResponse.json({ receipts: validated.data.receipts });
  } catch (error) {
    console.error("/api/ocr error", error);
    return NextResponse.json(
      { error: "Internal error while performing OCR" },
      { status: 500 }
    );
  }
}
