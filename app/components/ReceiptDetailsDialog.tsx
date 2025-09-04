"use client";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/ui/button";
import { Trash2, X } from "lucide-react";
import type { ProcessedReceipt } from "@/lib/types";
import { formatDisplayDate, toTitleCase } from "@/lib/utils";

interface ReceiptDetailsDialogProps {
  receipt: ProcessedReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (receiptId: string) => void;
}

export default function ReceiptDetailsDialog({
  receipt,
  isOpen,
  onClose,
  onDelete,
}: ReceiptDetailsDialogProps) {
  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[756px] h-[443px] p-0 border-gray-200">
        <div className="w-full h-full relative overflow-hidden rounded-2xl bg-white">
          {/* Receipt Image Placeholder */}
          <div className="w-[335px] h-[403px] absolute left-5 top-5 overflow-hidden rounded-xl bg-gray-200">
            <img
              src={receipt.thumbnail || "/placeholder.svg"}
              alt="Receipt"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Store Name */}
          <p className="absolute left-96 top-6 text-xl font-medium text-left text-[#101828]">
            {receipt.vendor}
          </p>

          {/* Date */}
          <p className="absolute left-96 top-[55px] text-sm text-left text-[#6a7282]">
            {formatDisplayDate(receipt.date)}
          </p>

          {/* Amount */}
          <div className="w-[348px] h-[51px] absolute left-96 top-[89px] border-t-0 border-r-0 border-b border-l-0 border-gray-200">
            <p className="absolute left-0 top-[17px] text-sm text-left text-[#6a7282]">Amount</p>
            <p className="absolute left-[303px] top-3.5 text-base font-medium text-right text-[#1e2939]">
              ${receipt.amount.toFixed(2)}
            </p>
          </div>

          {/* Category */}
          <div className="w-[348px] h-[51px] absolute left-96 top-[140px] border-t-0 border-r-0 border-b border-l-0 border-gray-200">
            <p className="absolute left-0 top-[17px] text-sm text-left text-[#6a7282]">Category</p>
            <p className="absolute left-[275px] top-3.5 text-base font-medium text-right text-[#1e2939]">
              {toTitleCase(receipt.category)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="w-[348px] h-[51px] absolute left-96 top-[191px] border-t-0 border-r-0 border-b border-l-0 border-gray-200">
            <p className="absolute left-0 top-[17px] text-sm text-left text-[#6a7282]">Payment Method</p>
            <p className="absolute left-[259px] top-3.5 text-base font-medium text-right text-[#1e2939]">
              {toTitleCase(receipt.paymentMethod)}
            </p>
          </div>

          {/* Tax Amount */}
          <div className="w-[348px] h-[51px] absolute left-96 top-[242px] border-t-0 border-r-0 border-b border-l-0 border-gray-200">
            <p className="absolute left-0 top-[17px] text-sm text-left text-[#6a7282]">Tax Amount</p>
            <p className="absolute left-[310px] top-3.5 text-base font-medium text-right text-[#1e2939]">
              ${receipt.taxAmount.toFixed(2)}
            </p>
          </div>

          {/* Close Icon */}
          <DialogClose className="absolute left-[716px] top-[29px] w-4 h-4 text-[#6a7282] hover:text-gray-800">
            <X className="w-4 h-4" />
          </DialogClose>

          {/* Delete Button */}
          <div className="flex justify-end items-center absolute left-[630px] top-[390px] gap-3">
            <Button
              onClick={() => {
                onDelete(receipt.id);
                onClose();
              }}
              className="flex justify-end items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 px-[18px] py-2 rounded-md bg-[#8b2323] hover:bg-[#7a1f1f] text-white"
              style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <p className="text-sm font-medium">Delete</p>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}