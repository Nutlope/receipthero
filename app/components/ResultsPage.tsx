"use client";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Upload, Trash2, Star } from "lucide-react";
import type {
  ProcessedReceipt,
  SpendingBreakdown,
} from "@/lib/mock-receipt-processor";

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
      <header className="flex items-center justify-between p-6 bg-white border-b border-[#d1d5dc]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#101828] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="text-lg font-semibold text-[#101828]">
              Receipt Hero
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-[7px] rounded bg-white/80 border-[0.7px] border-[#d1d5dc] shadow-sm">
          <Star className="h-3.5 w-3.5 text-[#FFC107] fill-[#FFC107]" />
          <span className="text-sm text-[#1e2939]">Star on GitHub</span>
        </div>
      </header>

      <div className="flex">
        <aside className="w-80 p-6 border-r bg-card">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Total Spending</h2>
            <div className="text-3xl font-bold">
              ${spendingBreakdown.totalSpending}
            </div>
            <div className="text-sm text-muted-foreground">
              {spendingBreakdown.totalReceipts} receipts processed
            </div>
          </div>

          <div className="space-y-4">
            {spendingBreakdown.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm">${category.amount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="w-full bg-muted rounded-full h-2 mr-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-8 bg-transparent"
            variant="outline"
            onClick={onAddMoreReceipts}
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : "Upload Receipts"}
          </Button>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Receipts will be added to the table
          </div>

          <Button
            className="w-full mt-4 bg-transparent"
            variant="outline"
            onClick={onStartOver}
          >
            Start Over
          </Button>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Your Overview:</h1>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Receipt</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Vendor</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">
                      Payment Method
                    </th>
                    <th className="text-left p-4 font-medium">Tax Amount</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedReceipts.map((receipt) => (
                    <tr key={receipt.id} className="border-b hover:bg-muted/25">
                      <td className="p-4">
                        <img
                          src={receipt.thumbnail || "/placeholder.svg"}
                          alt="Receipt thumbnail"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      </td>
                      <td className="p-4">{receipt.date}</td>
                      <td className="p-4">{receipt.vendor}</td>
                      <td className="p-4">{receipt.category}</td>
                      <td className="p-4">{receipt.paymentMethod}</td>
                      <td className="p-4">${receipt.taxAmount}</td>
                      <td className="p-4 font-semibold">${receipt.amount}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteReceipt(receipt.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary text-primary-foreground">
                  <tr>
                    <td colSpan={7} className="p-4 font-semibold">
                      Total:
                    </td>
                    <td className="p-4 font-bold">
                      ${spendingBreakdown.totalSpending}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          <footer className="text-center mt-8 text-sm text-[#555]">
            Powered by together.ai
          </footer>
        </main>
      </div>
    </div>
  );
}
