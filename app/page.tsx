"use client";

import type React from "react";
import { ProcessedReceipt, UploadedFile } from "@/lib/types";
import { useReceiptManager } from "@/lib/useReceiptManager";
import UploadReceiptPage from "@/app/components/UploadReceiptPage";
import ResultsPage from "@/app/components/ResultsPage";

export default function HomePage() {
  const {
    receipts,
    breakdown,
    isProcessing,
    isLoaded,
    hasData,
    processFiles,
    addReceipts,
    deleteReceipt,
    clearAll,
    selectFiles,
  } = useReceiptManager();

  const handleProcessFiles = async (uploadedFiles: UploadedFile[]) => {
    await addReceipts(uploadedFiles);
  };

  const handleAddMoreReceipts = async () => {
    const files = await selectFiles();
    if (files.length > 0) {
      // Process files first, then add receipts
      const processedFiles = await processFiles(files);
      await addReceipts(processedFiles);
    }
  };

  const handleDeleteReceipt = (receiptId: string) => {
    deleteReceipt(receiptId);
  };

  const handleStartOver = () => {
    clearAll();
  };

  // Show loading state while data is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your receipts...</p>
        </div>
      </div>
    );
  }

  if (hasData && breakdown) {
    return (
      <ResultsPage
        processedReceipts={receipts}
        spendingBreakdown={breakdown}
        onAddMoreReceipts={handleAddMoreReceipts}
        onDeleteReceipt={handleDeleteReceipt}
        onStartOver={handleStartOver}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <UploadReceiptPage
      onProcessFiles={handleProcessFiles}
    />
  );
}