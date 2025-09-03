"use client";

import type React from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Header from "./Header";
import Footer from "./Footer";

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

  const onDrop = (acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
  });

  const handleFileUpload = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2, 11),
      name: file.name,
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleGenerateResults = () => {
    const files = uploadedFiles.map((f) => f.file);
    onProcessFiles(files);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-8 flex flex-col gap-4">
          <img
            src="/receipt-hero.svg"
            className="w-[77.58px] h-[71.29px] mx-auto"
            alt="Receipt illustration"
          />
          <h1 className="text-2xl font-medium text-[#030712]">
            Organize Your Receipts
          </h1>
          <p className="text-base text-[#4a5565] max-w-full md:max-w-[271px] mx-auto">
            Instantly convert invoices into clear, categorized summaries.
          </p>
        </div>

        <div className="w-full md:w-[361px] h-[438px] mx-auto mb-8 bg-white border border-[#d1d5dc] rounded-2xl shadow-sm">
          <div className="w-full md:w-[329px] h-[406px] m-4 bg-gray-50 border border-[#d1d5dc] border-dashed rounded-xl flex flex-col">
            {uploadedFiles.length === 0 && !isProcessing ? (
              <div
                className="h-full flex flex-col items-center justify-center p-8 cursor-pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="w-[46px] h-[46px] mb-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <img src="/upload.svg" className="size-[24px]" alt="" />
                </div>
                <p className="text-base text-[#101828] mb-2 text-center">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag and drop your receipts here"}
                </p>
                <p className="text-base text-[#6a7282] mb-6 text-center">
                  or click to select files
                </p>
                <div
                  className="w-[120px] h-10 relative overflow-hidden rounded-md flex items-center justify-center bg-white border border-[#d1d5dc]"
                  style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
                >
                  <p className="text-base text-center text-[#364153]">
                    Select Files
                  </p>
                </div>
              </div>
            ) : uploadedFiles.length > 0 && !isProcessing ? (
              <div
                className="flex flex-col justify-start items-start w-full p-[18px] gap-3 cursor-pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
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
                <div
                  className="self-stretch flex-grow-0 flex-shrink-0 h-[33px] relative overflow-hidden rounded-md bg-white border border-[#d1d5dc] cursor-pointer flex flex-row gap-1 items-center px-4 py-2.5"
                  style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                >
                  <img src="/upload.svg" className="size-[14px]" alt="" />
                  <p className="text-xs text-left text-[#101828]">
                    Upload more receipts
                  </p>
                </div>
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
            className={`flex justify-center items-center w-full md:w-[205px] mx-auto gap-2 px-[25px] py-2.5 rounded-md border border-[#d1d5dc] disabled:opacity-50 transition-colors ${
              uploadedFiles.length > 0
                ? "bg-gray-900 hover:bg-gray-800 cursor-pointer"
                : "bg-[#99a1af] hover:bg-[#8a92a0] cursor-not-allowed"
            }`}
            style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
            disabled={uploadedFiles.length === 0 || isProcessing}
            onClick={handleGenerateResults}
          >
            <img src="/sparks.svg" className="size-[18px]" />
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-right text-white">
              Generate Results
            </p>
          </button>
        </div>

        <Footer />
      </main>
    </div>
  );
}
