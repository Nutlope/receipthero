"use client";

import SidebarReceipts from "./SidebarReceipts";
import TableReceipts from "./TableReceipts";
import type { ProcessedReceipt, SpendingBreakdown } from "@/lib/types";

interface ResultsPageProps {
  processedReceipts: ProcessedReceipt[];
  spendingBreakdown: SpendingBreakdown;
  onAddMoreReceipts: () => void;
  onDeleteReceipt: (receiptId: string) => void;
  onStartOver: () => void;
  isProcessing: boolean;
}

export default function ResultsPage({
  processedReceipts,
  spendingBreakdown,
  onAddMoreReceipts,
  onDeleteReceipt,
  onStartOver,
  isProcessing,
}: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <SidebarReceipts
          processedReceipts={processedReceipts}
          spendingBreakdown={spendingBreakdown}
          onAddMoreReceipts={onAddMoreReceipts}
          isProcessing={isProcessing}
        />
        <TableReceipts
          processedReceipts={processedReceipts}
          onDeleteReceipt={onDeleteReceipt}
        />
      </div>
    </div>
  );
}
