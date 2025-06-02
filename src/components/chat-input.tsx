"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  uploadedFile?: File | null
  onRemoveFile?: () => void
  placeholder?: string
  multiline?: boolean
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
      e.preventDefault()
      onSend()
    }
  }

  if (multiline) {
    return (
      <div className="w-full max-w-sm">
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 resize-none border border-slate-200 rounded-xl p-4 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={handleKeyDown}
          />

          {uploadedFile && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-100 rounded-md px-2 py-1">
              <div className="w-4 h-4 bg-slate-600 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <span className="text-slate-600 text-sm max-w-32 truncate">
                {uploadedFile.name.replace(".csv", "")}...
              </span>
              {onRemoveFile && (
                <button onClick={onRemoveFile} className="text-slate-400 hover:text-slate-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="sm"
            className="absolute bottom-3 right-3 w-8 h-8 p-0 bg-slate-400 hover:bg-slate-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
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
            <span className="text-slate-600 max-w-24 truncate">{uploadedFile.name}</span>
            {onRemoveFile && (
              <button onClick={onRemoveFile} className="text-slate-400 hover:text-slate-600">
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
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
