"use client";

import type { ProcessedReceipt, SpendingBreakdown } from "@/lib/types";

interface SidebarReceiptsProps {
  processedReceipts: ProcessedReceipt[];
  spendingBreakdown: SpendingBreakdown;
  onAddMoreReceipts: () => void;
  isProcessing: boolean;
}

function calculateTotals(receipts: ProcessedReceipt[]) {
  const totalSpending = receipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );
  const totalReceipts = receipts.length;
  return { totalSpending, totalReceipts };
}

export default function SidebarReceipts({
  processedReceipts,
  spendingBreakdown,
  onAddMoreReceipts,
  isProcessing,
}: SidebarReceiptsProps) {
  const { totalSpending, totalReceipts } = calculateTotals(processedReceipts);

  return (
    <div className="w-[322px] rounded-2xl bg-white border border-[#d1d5dc] m-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" className="w-6 h-6" alt="Icon" />
          <img
            src="/logo.svg"
            className="text-lg font-semibold text-[#101828]"
            width="107"
            height="20"
            alt="Receipt Hero"
          />
        </div>
        <a
          href="https://github.com/nutlope"
          target="_blank"
          className="flex items-center gap-1.5 px-3.5 py-[7px] rounded bg-white/80 border border-[#d1d5dc]"
          style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            preserveAspectRatio="xMidYMid meet"
          >
            <g clipPath="url(#clip0_125_665)">
              <path
                d="M7 0.35022C7.24335 0.35022 7.46546 0.477176 7.59082 0.680298L7.63867 0.772095L9.23633 4.51135L9.24805 4.5387L9.27734 4.54163L13.3184 4.90881C13.5957 4.93381 13.8304 5.1211 13.916 5.38538C14.002 5.65035 13.9215 5.94028 13.7119 6.12366L10.6582 8.80139L10.6357 8.8219L10.6426 8.85022L11.543 12.818C11.6044 13.0896 11.4983 13.3711 11.2725 13.5348C11.0472 13.6979 10.7474 13.7109 10.5098 13.568L7.02539 11.485L7 11.4694L6.97461 11.485L3.48926 13.568C3.37918 13.6339 3.25609 13.6666 3.13281 13.6666C3.02566 13.6666 2.91908 13.6419 2.82129 13.5924L2.72656 13.5348C2.50085 13.3716 2.39553 13.0903 2.45703 12.818L3.35742 8.85022L3.36426 8.8219L3.3418 8.80139L0.287109 6.12366V6.12268C0.077799 5.9399 -0.00200471 5.64982 0.0839844 5.38538C0.170086 5.12104 0.404724 4.93441 0.681641 4.90881L0.680664 4.90784L4.72266 4.54163L4.75195 4.5387L4.76367 4.51135L6.36133 0.772095C6.47129 0.515683 6.722 0.350248 7 0.35022Z"
                fill="#D5A512"
                stroke="#364153"
                strokeWidth="0.1"
              />
            </g>
            <defs>
              <clipPath id="clip0_125_665">
                <rect width={14} height={14} fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-sm text-[#1e2939]">GitHub</p>
        </a>
      </div>
      {/* Total Spending */}
      <div className="">
        <div className="px-8 py-6">
          <p className="text-sm text-[#1d293d] mb-2">Total Spending</p>
          <p className="text-4xl font-semibold text-[#020618] mb-4">
            ${totalSpending.toFixed(2)}
          </p>
          <p className="text-sm text-[#4a5565]">
            {totalReceipts} receipts processed
          </p>
        </div>
        {/* Spending Breakdown */}
        <div className="bg-white border border-gray-200 px-8 py-5 mb-6">
          <div className="space-y-4">
            {spendingBreakdown.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize">
                    {category.name}
                  </span>
                  <span className="text-sm">${category.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="w-full bg-gray-100 rounded-full h-2 mr-2">
                    <div
                      className="bg-[#1e2939] h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6a7282]">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Upload Section */}
        <div
          className="rounded-xl bg-gray-50 border border-[#d1d5dc] border-dashed p-4 cursor-pointer m-6"
          onClick={onAddMoreReceipts}
          style={isProcessing ? { opacity: 0.5, pointerEvents: "none" } : {}}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              width={34}
              height={35}
              viewBox="0 0 34 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              preserveAspectRatio="none"
            >
              <rect
                x="0.65"
                y="1.15"
                width="32.7"
                height="32.7"
                rx="4.35"
                fill="#F9FAFB"
              />
              <rect
                x="0.65"
                y="1.15"
                width="32.7"
                height="32.7"
                rx="4.35"
                stroke="#E5E7EB"
                strokeWidth="0.7"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.6467 11.1467C16.7404 11.0531 16.8675 11.0005 17 11.0005C17.1325 11.0005 17.2596 11.0531 17.3533 11.1467L20.3533 14.1467C20.4417 14.2415 20.4897 14.3669 20.4874 14.4964C20.4852 14.6259 20.4327 14.7495 20.3411 14.8411C20.2495 14.9327 20.1259 14.9852 19.9963 14.9875C19.8668 14.9898 19.7415 14.9417 19.6467 14.8534L17.5 12.7067V20.5C17.5 20.6327 17.4473 20.7598 17.3536 20.8536C17.2598 20.9474 17.1326 21 17 21C16.8674 21 16.7402 20.9474 16.6464 20.8536C16.5527 20.7598 16.5 20.6327 16.5 20.5V12.7067L14.3533 14.8534C14.2585 14.9417 14.1332 14.9898 14.0037 14.9875C13.8741 14.9852 13.7505 14.9327 13.6589 14.8411C13.5673 14.7495 13.5148 14.6259 13.5126 14.4964C13.5103 14.3669 13.5583 14.2415 13.6467 14.1467L16.6467 11.1467ZM11 20C11.1326 20 11.2598 20.0527 11.3536 20.1465C11.4473 20.2403 11.5 20.3674 11.5 20.5V22C11.5 22.2653 11.6054 22.5196 11.7929 22.7072C11.9804 22.8947 12.2348 23 12.5 23H21.5C21.7652 23 22.0196 22.8947 22.2071 22.7072C22.3946 22.5196 22.5 22.2653 22.5 22V20.5C22.5 20.3674 22.5527 20.2403 22.6464 20.1465C22.7402 20.0527 22.8674 20 23 20C23.1326 20 23.2598 20.0527 23.3536 20.1465C23.4473 20.2403 23.5 20.3674 23.5 20.5V22C23.5 22.5305 23.2893 23.0392 22.9142 23.4143C22.5391 23.7893 22.0304 24 21.5 24H12.5C11.9696 24 11.4609 23.7893 11.0858 23.4143C10.7107 23.0392 10.5 22.5305 10.5 22V20.5C10.5 20.3674 10.5527 20.2403 10.6464 20.1465C10.7402 20.0527 10.8674 20 11 20Z"
                fill="black"
              />
            </svg>
            <p className="text-base font-medium text-[#1e2939]">
              Upload Receipts
            </p>
            <p className="text-sm text-center text-[#6a7282]">
              Receipts will be added to the table
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
