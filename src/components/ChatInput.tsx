"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ChatInput({
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

  // Autofocus logic
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      <div className="h-[110px] w-full md:hidden" />
      <div className="w-full md:max-w-2xl mx-auto fixed bottom-0 bg-white md:relative">
        <div className="relative border border-slate-200 rounded-xl p-3 md:mb-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 resize-none text-base placeholder:text-slate-400 focus:outline-none "
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />

          <div className="flex flex-row justify-between">
            {uploadedFile && (
              <div
                className="flex flex-row items-center justify-center min-w-[156px] relative overflow-hidden gap-1.5 px-2 py-1.5 rounded-lg max-h-[28px] bg-slate-100 border-[0.5px] border-[#90a1b9]"
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
              className="size-[28px] p-0 bg-[#1D293D] disabled:bg-slate-400 hover:bg-slate-500"
            >
              <img src="/send.svg" className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
