"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  uploadedFile?: File | null;
  onRemoveFile?: () => void;
  placeholder?: string;
  multiline?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  uploadedFile,
  onRemoveFile,
  placeholder = "Ask anything...",
  multiline = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  if (multiline) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl">
        <div className="relative border border-slate-200 rounded-xl p-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 resize-none text-base placeholder:text-slate-400 focus:outline-none "
            onKeyDown={handleKeyDown}
          />

          <div className="flex flex-row justify-between">
            {uploadedFile && (
              <div
                className="flex flex-row items-center justify-center min-w-[156px] relative overflow-hidden gap-1.5 px-2 py-1.5 rounded-lg max-h-[44px] bg-slate-100 border-[0.5px] border-[#90a1b9] md:px-4 md:py-3.5"
                style={{ boxShadow: "0px 1px 7px -3px rgba(0,0,0,0.25)" }}
              >
                <img src="/uploaded-file.svg" alt="" className="w-4 h-4" />
                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-1">
                    <p className="flex-grow-0 flex-shrink-0 w-[100px] text-xs font-medium text-left text-[#1d293d]">
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

  return (
    <div className="border-t border-slate-100 p-4">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pr-12 border-slate-200 h-12"
          onKeyDown={handleKeyDown}
        />
        {uploadedFile && (
          <div className="absolute -top-10 left-3 flex items-center gap-2 bg-slate-100 rounded px-2 py-1 text-xs">
            <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            <span className="text-slate-600 max-w-24 truncate">
              {uploadedFile.name}
            </span>
            {onRemoveFile && (
              <button
                onClick={onRemoveFile}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        <Button
          onClick={onSend}
          disabled={!value.trim()}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0"
        >
          <img src="/send.svg" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
