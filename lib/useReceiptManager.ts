import { useState, useEffect, useCallback } from 'react';
import { ProcessedReceipt, SpendingBreakdown, UploadedFile, FileStatus } from './types';
import { normalizeDate } from './utils';

interface StoredData {
  receipts: ProcessedReceipt[];
  breakdown: SpendingBreakdown | null;
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

// Simple hash function for base64 content
const hashBase64 = (base64: string): string => {
  let hash = 0;
  for (let i = 0; i < base64.length; i++) {
    const char = base64.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

export function useReceiptManager() {
  const [receipts, setReceipts] = useState<ProcessedReceipt[]>([]);
  const [breakdown, setBreakdown] = useState<SpendingBreakdown | null>(null);
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
  const processFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    const filePromises = files.map(async (file) => {
      try {
        const { base64, mimeType } = await readFileAsBase64(file);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64 }),
        });

        const data = await response.json();

        if (response.ok && data.receipts && data.receipts.length > 0) {
          const receipt = data.receipts[0]; // Take first receipt if multiple
          const receiptId = hashBase64(base64);
          const processedReceipt: ProcessedReceipt = {
            ...receipt,
            id: receiptId,
            fileName: receipt.fileName || file.name,
            date: normalizeDate(receipt.date), // Normalize date format
            thumbnail: receipt.thumbnail || `data:${mimeType};base64,${base64}`,
            base64,
            mimeType,
          };

          return {
            id: Math.random().toString(36).substring(2, 11),
            name: file.name,
            file,
            status: 'receipt' as FileStatus,
            receipt: processedReceipt,
            base64,
            mimeType,
          };
        } else {
          // No receipt data found
          return {
            id: Math.random().toString(36).substring(2, 11),
            name: file.name,
            file,
            status: 'not-receipt' as FileStatus,
            base64,
            mimeType,
          };
        }
      } catch (error) {
        console.error('Error processing file:', error);
        return {
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          file,
          status: 'error' as FileStatus,
          error: error instanceof Error ? error.message : 'Processing failed',
          base64: '',
          mimeType: file.type,
        };
      }
    });

    const results = await Promise.all(filePromises);
    return results;
  }, []);

  // Add new receipts (used by upload page)
  const addReceipts = useCallback(async (uploadedFiles: UploadedFile[]) => {
    setIsProcessing(true);

    try {
      // Filter only files that are receipts
      const newReceipts = uploadedFiles
        .filter(file => file.status === 'receipt' && file.receipt)
        .map(file => file.receipt!)
        // Deduplicate based on ID (hash of base64 content)
        .filter(newReceipt => !receipts.some(existing => existing.id === newReceipt.id));

      if (newReceipts.length === 0) {
        // No new receipts to add
        return { receipts, breakdown };
      }

      const updatedReceipts = [...receipts, ...newReceipts];
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
  }, [receipts, breakdown, calculateBreakdown, saveToStorage]);

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

  // Start processing state (for when user initiates file selection)
  const startProcessing = useCallback(() => {
    setIsProcessing(true);
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
    processFiles,
    addReceipts,
    deleteReceipt,
    clearAll,
    selectFiles,
    startProcessing,
  };
}