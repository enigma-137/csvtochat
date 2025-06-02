"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onFileSelect: () => void;
  hasFile: boolean;
}

export function UploadArea({ onFileSelect, hasFile }: UploadAreaProps) {
  return (
    <div className="flex flex-col items-center pt-16 pb-8">
      <img src="/logo.svg" className="size-[42px]  mb-8" />

      {/* Title */}
      <h1 className="text-[28px] font-medium text-slate-900 text-center mb-12 leading-tight">
        What do you want to
        <br />
        analyze?
      </h1>

      {/* Upload Button */}
      {!hasFile && (
        <Button
          onClick={onFileSelect}
          variant="outline"
          className="mb-8 border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV File
        </Button>
      )}
    </div>
  );
}
