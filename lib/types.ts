import { z } from "zod";

// Schema for a processed receipt
export const ProcessedReceiptSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  date: z.string(),
  vendor: z.string(),
  category: z.string(),
  paymentMethod: z.string(),
  taxAmount: z.number(),
  amount: z.number(),
  thumbnail: z.string(),
  base64: z.string(),
  mimeType: z.string(),
});

// Type exports
export type ProcessedReceipt = z.infer<typeof ProcessedReceiptSchema>;

// Status for uploaded files
export type FileStatus = 'processing' | 'receipt' | 'not-receipt' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  file: File;
  status: FileStatus;
  receipt?: ProcessedReceipt;
  error?: string;
  base64?: string;
  mimeType?: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface SpendingBreakdown {
  categories: SpendingCategory[];
}