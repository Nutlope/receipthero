import { useState, useEffect, useCallback } from 'react';
import { ProcessedReceipt, SpendingBreakdown } from './types';

interface StoredData {
  receipts: ProcessedReceipt[];
  breakdown: SpendingBreakdown | null;
  base64s: string[];
  mimeTypes: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  file: File;
  isProcessing: boolean;
  isProcessed: boolean;
  error?: string;
  receipt?: ProcessedReceipt;
  base64?: string;
  mimeType?: string;
}

const STORAGE_KEY = 'receipt-hero-data';

const readFileAsBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [mimePart, base64] = result.split(',');
      const mimeType = mimePart.split(':')[1].split(';')[0];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function useReceiptManager() {
  const [receipts, setReceipts] = useState<ProcessedReceipt[]>([]);
  const [breakdown, setBreakdown] = useState<SpendingBreakdown | null>(null);
  const [base64s, setBase64s] = useState<string[]>([]);
  const [mimeTypes, setMimeTypes] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredData = JSON.parse(stored);
        setReceipts(data.receipts || []);
        setBreakdown(data.breakdown || null);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage
  const saveToStorage = useCallback((receipts: ProcessedReceipt[], breakdown: SpendingBreakdown | null) => {
    try {
      const data: StoredData = { receipts, breakdown };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, []);

  // Calculate spending breakdown
  const calculateBreakdown = useCallback((receipts: ProcessedReceipt[]): SpendingBreakdown => {
    const categoryTotals = receipts.reduce((acc, receipt) => {
      acc[receipt.category] = (acc[receipt.category] || 0) + receipt.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpending = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

    const categories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / totalSpending) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      categories,
    };
  }, []);

  // Process files through OCR API (parallel processing)
  const processFiles = useCallback(async (files: File[]): Promise<ProcessedReceipt[]> => {
    const filePromises = files.map(async (file) => {
      try {
        const { base64, mimeType } = await readFileAsBase64(file);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64 }),
        });

        const data = await response.json();

        if (response.ok && data.receipts) {
          return data.receipts.map((receipt: ProcessedReceipt) => ({
            ...receipt,
            id: receipt.id || Math.random().toString(36).substring(2, 11),
            fileName: receipt.fileName || file.name,
            thumbnail: receipt.thumbnail || `data:${mimeType};base64,${base64}`,
            base64,
            mimeType,
          }));
        } else {
          console.error('OCR processing failed:', data.error);
          return [];
        }
      } catch (error) {
        console.error('Error processing file:', error);
        return [];
      }
    });

    const results = await Promise.all(filePromises);
    return results.flat();
  }, []);

  // Add new receipts (used by upload page)
  const addReceipts = useCallback(async (files: File[], existingReceipts: ProcessedReceipt[]) => {
    setIsProcessing(true);

    try {
      const newReceipts = await processFiles(files);
      const updatedReceipts = [...existingReceipts, ...newReceipts];
      const newBreakdown = calculateBreakdown(updatedReceipts);

      setReceipts(updatedReceipts);
      setBreakdown(newBreakdown);
      saveToStorage(updatedReceipts, newBreakdown);

      return { receipts: updatedReceipts, breakdown: newBreakdown };
    } catch (error) {
      console.error('Failed to add receipts:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [processFiles, calculateBreakdown, saveToStorage]);

  // Delete a receipt
  const deleteReceipt = useCallback((receiptId: string) => {
    const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptId);

    if (updatedReceipts.length === 0) {
      setReceipts([]);
      setBreakdown(null);
      saveToStorage([], null);
    } else {
      const newBreakdown = calculateBreakdown(updatedReceipts);
      setReceipts(updatedReceipts);
      setBreakdown(newBreakdown);
      saveToStorage(updatedReceipts, newBreakdown);
    }
  }, [receipts, calculateBreakdown, saveToStorage]);

  // Clear all data
  const clearAll = useCallback(() => {
    setReceipts([]);
    setBreakdown(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get files from file input
  const selectFiles = useCallback((): Promise<File[]> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';

      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        resolve(files ? Array.from(files) : []);
      };

      input.click();
    });
  }, []);

  return {
    // State
    receipts,
    breakdown,
    isProcessing,
    isLoaded,
    hasData: receipts.length > 0 && breakdown !== null,

    // Actions
    addReceipts,
    deleteReceipt,
    clearAll,
    selectFiles,
  };
}