"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TooltipUsage from "./tooltipUsage";
import { useUserLimits } from "@/hooks/useUserLimits";
import { ModelDropdown } from "./ModelDropdown";
import { CHAT_MODELS } from "@/lib/models";
import { useLLMModel } from "@/hooks/useLLMModel";

export function ChatInput({
  isLLMAnswering,
  value,
  onChange,
  onSend,
  uploadedFile,
  onStopLLM,
  placeholder = "Ask anything...",
}: {
  isLLMAnswering: boolean;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStopLLM: () => void;
  uploadedFile?: {
    url: string;
  };
  placeholder?: string;
}) {
  const {
    remainingMessages,
    resetTimestamp,
    loading: limitsLoading,
    refetch,
  } = useUserLimits();

  const { selectedModelSlug, setModel, models } = useLLMModel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const handleSendMessage = async () => {
    if (value.trim() === "") return;
    onSend();
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  return (
    <>
      <div className="h-[110px] w-full md:hidden" />
      <div className="w-full md:max-w-2xl mx-auto fixed bottom-0 bg-white md:relative">
        <div className="relative border border-[#cad5e2] border-dashed rounded-lg p-3 md:mb-4">
          <div className="flex flex-row gap-2 mb-2">
            <ModelDropdown
              models={models}
              value={selectedModelSlug}
              onChange={setModel}
              className="min-w-[180px]"
            />
          </div>
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
                className="flex flex-row items-center justify-center min-w-[156px] relative overflow-hidden gap-2.5 px-2 py-1.5 rounded-lg max-h-[28px] bg-slate-100 border-[0.5px] border-[#90a1b9]"
                style={{ boxShadow: "0px 1px 7px -3px rgba(0,0,0,0.25)" }}
              >
                <img src="/new-uploaded-file.svg" alt="" className="w-4 h-4" />
                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-1">
                    <p
                      className="flex-grow-0 flex-shrink-0 w-[100px] text-xs font-medium text-left text-[#1d293d] truncate"
                      title={uploadedFile.url.split("/").pop() || ""}
                    >
                      {uploadedFile.url.split("/").pop()}
                    </p>
                  </div>
                </div>
                <button className="p-2 cursor-pointer">
                  <img src="/3dots.svg" alt="" className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex flex-row gap-2">
              {!limitsLoading && (
                <TooltipUsage
                  remainingMessages={remainingMessages ?? 0}
                  resetTimestamp={resetTimestamp ?? undefined}
                />
              )}

              {isLLMAnswering ? (
                <Button
                  onClick={onStopLLM}
                  size="sm"
                  className="size-[28px] p-0 bg-[#1D293D] disabled:bg-slate-400 hover:bg-slate-500 cursor-pointer"
                >
                  <img src="/stop.svg" className="size-3" />
                </Button>
              ) : (
                <Button
                  onClick={handleSendMessage}
                  disabled={!value.trim() || limitsLoading}
                  size="sm"
                  className="size-[28px] p-0 bg-[#1D293D] disabled:bg-slate-400 hover:bg-slate-500 cursor-pointer"
                >
                  <img src="/send.svg" className="size-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
