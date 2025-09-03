"use client";

import type React from "react";
import { useState } from "react";
import { Upload, Star } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  file: File;
}

interface UploadReceiptPageProps {
  onProcessFiles: (files: File[]) => void;
  isProcessing: boolean;
}

export default function UploadReceiptPage({
  onProcessFiles,
  isProcessing,
}: UploadReceiptPageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleGenerateResults = () => {
    const files = uploadedFiles.map((f) => f.file);
    onProcessFiles(files);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 justify-center">
            <img src="/icon.svg" className="w-6 h-6" />
            <img
              src="/logo.svg"
              className="text-lg font-semibold text-[#101828]"
              width="107"
              height="20"
            />
          </div>
        </div>
        <a
          href="https://github.com/nutlope"
          target="_blank"
          className="flex items-center gap-1.5 px-3.5 py-[7px] rounded bg-white/80 border-[0.7px] border-[#d1d5dc] shadow-sm"
        >
          <Star className="h-3.5 w-3.5 text-[#FFC107] fill-[#FFC107]" />
          <span className="text-sm text-right text-[#1e2939]">
            Star on GitHub
          </span>
        </a>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="mb-6 relative">
            <svg
              width={79}
              height={73}
              viewBox="0 0 79 73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[77.58px] h-[71.29px] mx-auto"
            >
              <g opacity="0.7">
                <rect
                  x="40.6783"
                  y="8.72017"
                  width="38.5"
                  height="51.5"
                  rx="2.25"
                  transform="rotate(7.32403 40.6783 8.72017)"
                  fill="white"
                />
                <rect
                  x="40.6783"
                  y="8.72017"
                  width="38.5"
                  height="51.5"
                  rx="2.25"
                  transform="rotate(7.32403 40.6783 8.72017)"
                  stroke="#E5E7EB"
                  strokeWidth="0.5"
                />
                <rect
                  x="45.9531"
                  y="16.7078"
                  width={17}
                  height={3}
                  rx="1.5"
                  transform="rotate(7.32403 45.9531 16.7078)"
                  fill="#E5E7EB"
                />
                <rect
                  x="50.0199"
                  y="24.2881"
                  width={21}
                  height={2}
                  rx={1}
                  transform="rotate(7.32403 50.0199 24.2881)"
                  fill="#D1D5DC"
                />
                <rect
                  x="48.7451"
                  y="34.2065"
                  width={21}
                  height={2}
                  rx={1}
                  transform="rotate(7.32403 48.7451 34.2065)"
                  fill="#D1D5DC"
                />
                <rect
                  x="47.4703"
                  y="44.1249"
                  width={21}
                  height={2}
                  rx={1}
                  transform="rotate(7.32403 47.4703 44.1249)"
                  fill="#D1D5DC"
                />
              </g>
              <rect
                x="0.589775"
                y="21.9504"
                width="38.7"
                height="51.7"
                rx="2.35"
                transform="rotate(-10.9737 0.589775 21.9504)"
                stroke="#D1D5DC"
                strokeWidth="0.7"
              />
              <rect
                x="21.9929"
                y="0.6"
                width="38.8"
                height="51.8"
                rx="2.4"
                fill="white"
              />
              <rect
                x="21.9929"
                y="0.6"
                width="38.8"
                height="51.8"
                rx="2.4"
                stroke="#D1D5DC"
                strokeWidth="0.8"
              />
              <rect
                x="28.3929"
                y={8}
                width={17}
                height={3}
                rx="1.5"
                fill="#D1D5DC"
              />
              <rect
                x="33.3929"
                y={15}
                width={21}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
              <rect
                x="33.3929"
                y={25}
                width={21}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
              <rect
                x="33.3929"
                y={35}
                width={21}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
              <rect
                x="28.3929"
                y={15}
                width={4}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
              <rect
                x="28.3929"
                y={25}
                width={4}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
              <rect
                x="28.3929"
                y={35}
                width={4}
                height={2}
                rx={1}
                fill="#99A1AF"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-medium mb-4 text-[#030712]">
            Organize Your Receipts
          </h1>
          <p className="text-base text-[#4a5565] max-w-[271px] mx-auto">
            Instantly convert invoices into clear, categorized summaries.
          </p>
        </div>

        <div className="w-[361px] h-[438px] mx-auto mb-8 bg-white border border-[#d1d5dc] rounded-2xl shadow-sm">
          <div className="w-[329px] h-[406px] m-4 bg-gray-50 border border-[#d1d5dc] border-dashed rounded-xl flex flex-col">
            {uploadedFiles.length === 0 && !isProcessing ? (
              <div
                className="h-full flex flex-col items-center justify-center p-8"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="w-[46px] h-[46px] mb-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M23.4921 14.8671C23.6268 14.7325 23.8095 14.6569 24 14.6569C24.1905 14.6569 24.3732 14.7325 24.5079 14.8671L28.8204 19.1796C28.9474 19.3158 29.0165 19.496 29.0132 19.6822C29.0099 19.8684 28.9345 20.0461 28.8028 20.1778C28.6711 20.3095 28.4935 20.3849 28.3073 20.3882C28.121 20.3915 27.9408 20.3224 27.8046 20.1954L24.7188 17.1096V28.3125C24.7188 28.5031 24.643 28.6859 24.5082 28.8207C24.3734 28.9555 24.1906 29.0312 24 29.0312C23.8094 29.0312 23.6266 28.9555 23.4918 28.8207C23.357 28.6859 23.2812 28.5031 23.2812 28.3125V17.1096L20.1954 20.1954C20.0592 20.3224 19.879 20.3915 19.6927 20.3882C19.5065 20.3849 19.3289 20.3095 19.1972 20.1778C19.0655 20.0461 18.9901 19.8684 18.9868 19.6822C18.9835 19.496 19.0526 19.3158 19.1796 19.1796L23.4921 14.8671ZM15.375 27.5937C15.5656 27.5937 15.7484 27.6695 15.8832 27.8042C16.018 27.939 16.0938 28.1219 16.0938 28.3125V30.4687C16.0938 30.85 16.2452 31.2156 16.5148 31.4852C16.7844 31.7548 17.15 31.9062 17.5312 31.9062H30.4688C30.85 31.9062 31.2156 31.7548 31.4852 31.4852C31.7548 31.2156 31.9062 30.85 31.9062 30.4687V28.3125C31.9062 28.1219 31.982 27.939 32.1168 27.8042C32.2516 27.6695 32.4344 27.5937 32.625 27.5937C32.8156 27.5937 32.9984 27.6695 33.1332 27.8042C33.268 27.939 33.3438 28.1219 33.3438 28.3125V30.4687C33.3438 31.2312 33.0408 31.9625 32.5017 32.5017C31.9625 33.0408 31.2312 33.3437 30.4688 33.3437H17.5312C16.7688 33.3437 16.0375 33.0408 15.4983 32.5017C14.9592 31.9625 14.6562 31.2312 14.6562 30.4687V28.3125C14.6562 28.1219 14.732 27.939 14.8668 27.8042C15.0016 27.6695 15.1844 27.5937 15.375 27.5937Z"
                      fill="#1E2939"
                    />
                  </svg>
                </div>
                <p className="text-base text-[#101828] mb-2 text-center">
                  Drag and drop your receipts here
                </p>
                <p className="text-base text-[#6a7282] mb-6 text-center">
                  or click "select files"
                </p>
                <button
                  className="w-[120px] h-10 bg-white border border-[#d1d5dc] rounded-md shadow-sm text-base text-[#364153] hover:bg-gray-50 transition-colors"
                  style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  Select Files
                </button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            ) : uploadedFiles.length > 0 && !isProcessing ? (
              <div className="flex flex-col justify-start items-start w-full p-[18px] gap-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="w-full h-[33px] flex items-center justify-between px-3.5 py-2 rounded-md bg-gray-100 border border-[#d1d5dc]"
                    style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                  >
                    <p className="text-xs text-[#364153] truncate flex-1">
                      {file.name}
                    </p>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0 hover:opacity-70 ml-2"
                    >
                      <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M2.56396 4.0769V7.56408C2.61525 8.23073 2.66653 9.10253 2.71781 9.71793C2.76909 10.4359 3.38448 11 4.10243 11H7.89728C8.61523 11 9.23063 10.4359 9.28193 9.71793C9.33318 9.10253 9.38448 8.23073 9.43578 7.56408C9.48703 6.79483 9.43578 5.20508 9.43578 4.0769H2.56396Z"
                          fill="#8B2323"
                        />
                        <path
                          d="M9.58975 2.53846H8.3077L7.89745 1.76923C7.64105 1.3077 7.1795 1 6.66665 1H5.4359C4.92308 1 4.41026 1.3077 4.20513 1.76923L3.69231 2.53846H2.41025C2.20513 2.53846 2 2.74359 2 2.94872C2 3.15385 2.20513 3.35897 2.41025 3.35897H9.58975C9.79485 3.35897 10 3.20513 10 2.94872C10 2.69231 9.79485 2.53846 9.58975 2.53846ZM4.56411 2.53846L4.82052 2.12821C4.92308 1.92308 5.1282 1.76923 5.3846 1.76923H6.6154C6.8718 1.76923 7.0769 1.8718 7.1795 2.12821L7.4359 2.53846H4.56411Z"
                          fill="#8B2323"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  className="w-full h-[33px] flex items-center justify-start px-4 gap-3 rounded-md bg-white border border-[#d1d5dc] hover:bg-gray-50 transition-colors"
                  style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                  onClick={() =>
                    document.getElementById("file-input-more")?.click()
                  }
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.69083 1.44081C6.77286 1.35889 6.88406 1.31287 7 1.31287C7.11594 1.31287 7.22713 1.35889 7.30917 1.44081L9.93417 4.06581C10.0114 4.14875 10.0535 4.25844 10.0515 4.37179C10.0495 4.48513 10.0036 4.59327 9.92345 4.67343C9.84329 4.75359 9.73515 4.7995 9.6218 4.8015C9.50846 4.8035 9.39877 4.76143 9.31583 4.68415L7.4375 2.80581V9.62498C7.4375 9.74101 7.39141 9.85229 7.30936 9.93434C7.22731 10.0164 7.11603 10.0625 7 10.0625C6.88397 10.0625 6.77269 10.0164 6.69064 9.93434C6.60859 9.85229 6.5625 9.74101 6.5625 9.62498V2.80581L4.68417 4.68415C4.60123 4.76143 4.49154 4.8035 4.37819 4.8015C4.26485 4.7995 4.15671 4.75359 4.07655 4.67343C3.9964 4.59327 3.95048 4.48513 3.94848 4.37179C3.94648 4.25844 3.98855 4.14875 4.06583 4.06581L6.69083 1.44081ZM1.75 9.18748C1.86603 9.18748 1.97731 9.23358 2.05936 9.31562C2.14141 9.39767 2.1875 9.50895 2.1875 9.62498V10.9375C2.1875 11.1695 2.27969 11.3921 2.44378 11.5562C2.60788 11.7203 2.83044 11.8125 3.0625 11.8125H10.9375C11.1696 11.8125 11.3921 11.7203 11.5562 11.5562C11.7203 11.3921 11.8125 11.1695 11.8125 10.9375V9.62498C11.8125 9.50895 11.8586 9.39767 11.9406 9.31562C12.0227 9.23358 12.134 9.18748 12.25 9.18748C12.366 9.18748 12.4773 9.23358 12.5594 9.31562C12.6414 9.39767 12.6875 9.50895 12.6875 9.62498V10.9375C12.6875 11.4016 12.5031 11.8467 12.1749 12.1749C11.8467 12.5031 11.4016 12.6875 10.9375 12.6875H3.0625C2.59837 12.6875 2.15325 12.5031 1.82506 12.1749C1.49687 11.8467 1.3125 11.4016 1.3125 10.9375V9.62498C1.3125 9.50895 1.35859 9.39767 1.44064 9.31562C1.52269 9.23358 1.63397 9.18748 1.75 9.18748Z"
                      fill="#101828"
                    />
                  </svg>
                  <p className="text-xs text-[#101828]">Upload more receipts</p>
                </button>
                <input
                  id="file-input-more"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <p className="text-base text-[#101828] mb-2 text-center">
                  Processing...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            className={`flex justify-center items-center w-full md:w-[357px] mx-auto gap-2 px-[25px] py-2.5 rounded-md border border-[#d1d5dc] disabled:opacity-50 transition-colors ${
              uploadedFiles.length > 0
                ? "bg-gray-900 hover:bg-gray-800 cursor-pointer"
                : "bg-[#99a1af] hover:bg-[#8a92a0] cursor-not-allowed"
            }`}
            style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
            disabled={uploadedFiles.length === 0 || isProcessing}
            onClick={handleGenerateResults}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-[18px] h-[18px] relative"
              preserveAspectRatio="none"
            >
              <path
                d="M7.35975 11.928L6.75 14.0625L6.14025 11.928C5.98265 11.3766 5.68717 10.8745 5.28169 10.4691C4.87621 10.0636 4.37411 9.7681 3.82275 9.6105L1.6875 9L3.822 8.39025C4.37336 8.23265 4.87546 7.93717 5.28094 7.53169C5.68642 7.12621 5.9819 6.62411 6.1395 6.07275L6.75 3.9375L7.35975 6.072C7.51735 6.62335 7.81283 7.12546 8.21831 7.53094C8.62379 7.93642 9.12589 8.2319 9.67725 8.3895L11.8125 9L9.678 9.60975C9.12665 9.76735 8.62454 10.0628 8.21906 10.4683C7.81358 10.8738 7.5181 11.3759 7.3605 11.9272L7.35975 11.928ZM13.6943 6.53625L13.5 7.3125L13.3057 6.53625C13.1946 6.09119 12.9645 5.68472 12.6402 5.36027C12.3159 5.03583 11.9095 4.80562 11.4645 4.69425L10.6875 4.5L11.4645 4.30575C11.9095 4.19438 12.3159 3.96417 12.6402 3.63973C12.9645 3.31528 13.1946 2.90881 13.3057 2.46375L13.5 1.6875L13.6943 2.46375C13.8055 2.9089 14.0357 3.31544 14.3601 3.63989C14.6846 3.96434 15.0911 4.1945 15.5363 4.30575L16.3125 4.5L15.5363 4.69425C15.0911 4.8055 14.6846 5.03566 14.3601 5.36011C14.0357 5.68456 13.8055 6.0911 13.6943 6.53625ZM12.6705 15.4252L12.375 16.3125L12.0795 15.4252C11.9967 15.1767 11.8571 14.9509 11.6718 14.7657C11.4866 14.5804 11.2608 14.4408 11.0122 14.358L10.125 14.0625L11.0122 13.767C11.2608 13.6842 11.4866 13.5446 11.6718 13.3593C11.8571 13.1741 11.9967 12.9483 12.0795 12.6998L12.375 11.8125L12.6705 12.6998C12.7533 12.9483 12.8929 13.1741 13.0782 13.3593C13.2634 13.5446 13.4892 13.6842 13.7377 13.767L14.625 14.0625L13.7377 14.358C13.4892 14.4408 13.2634 14.5804 13.0782 14.7657C12.8929 14.9509 12.7533 15.1767 12.6705 15.4252Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-right text-white">
              Generate Results
            </p>
          </button>
        </div>

        <footer className="text-center mt-16 text-sm text-[#555]">
          Powered by together.ai
        </footer>
      </main>
    </div>
  );
}
