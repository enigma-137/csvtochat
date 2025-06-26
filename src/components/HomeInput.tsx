"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { ModelDropdown } from "./ModelDropdown";
import { useLLMModel } from "@/hooks/useLLMModel";

export function HomeInput({
  value,
  onChange,
  onSend,
  uploadedFile,
  onRemoveFile,
  placeholder = "Ask anything...",
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  uploadedFile?: File | null;
  onRemoveFile?: () => void;
  placeholder?: string;
}) {
  const { selectedModelSlug, setModel, models } = useLLMModel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    onChange(pastedText.trim());
    e.preventDefault(); // Prevent default paste behavior
  };

  return (
    <div className="w-full max-w-sm md:max-w-2xl mx-auto">
      <div className="relative border border-[#cad5e2] border-dashed rounded-lg p-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 resize-none text-base placeholder:text-slate-400 focus:outline-none "
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />

        <div className="flex flex-row justify-between">
          <ModelDropdown
            models={models}
            value={selectedModelSlug}
            onChange={setModel}
            className="min-w-[180px]"
          />

          {uploadedFile && (
            <div
              className="flex flex-row items-center justify-center min-w-[156px] relative overflow-hidden gap-1.5 px-2 py-1.5 rounded-lg max-h-[44px] bg-slate-100 border-[0.5px] border-[#90a1b9] md:px-4 md:py-3.5"
              style={{ boxShadow: "0px 1px 7px -3px rgba(0,0,0,0.25)" }}
            >
              <img src="/uploaded-file.svg" alt="" className="w-4 h-4" />
              <div className="flex justify-center items-center  relative gap-1.5">
                <div className="flex flex-col justify-start items-start  relative gap-1">
                  <p className=" w-[100px] text-xs font-medium text-left text-[#1d293d] truncate">
                    {uploadedFile.name}
                  </p>
                </div>
              </div>
              <button className="p-1 cursor-pointer" onClick={onRemoveFile}>
                <img src="/fileX.svg" alt="" className="size-2 min-w-2" />
              </button>
            </div>
          )}

          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="sm"
            className="size-[28px] p-0 bg-[#1D293D] disabled:bg-slate-400 hover:bg-slate-500 md:size-[44px]"
          >
            <img src="/send.svg" className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
