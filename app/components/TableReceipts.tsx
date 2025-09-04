"use client";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Trash2 } from "lucide-react";
import type { ProcessedReceipt } from "@/lib/types";
import { formatDisplayDate, toTitleCase } from "@/lib/utils";

interface TableReceiptsProps {
  processedReceipts: ProcessedReceipt[];
  onDeleteReceipt: (receiptId: string) => void;
}

function calculateTotals(receipts: ProcessedReceipt[]) {
  const totalSpending = receipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );
  return totalSpending;
}

export default function TableReceipts({
  processedReceipts,
  onDeleteReceipt,
}: TableReceiptsProps) {
  const totalSpending = calculateTotals(processedReceipts);

  return (
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
                  <td className="p-4">{formatDisplayDate(receipt.date)}</td>
                  <td className="p-4">{receipt.vendor}</td>
                  <td className="p-4">{toTitleCase(receipt.category)}</td>
                  <td className="p-4">
                    {toTitleCase(receipt.paymentMethod)}
                  </td>
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
                  ${totalSpending.toFixed(2)}
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
  );
}