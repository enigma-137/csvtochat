"use client";

import { useChat } from "@ai-sdk/react";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ChatInput } from "@/components/chat-input";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

interface ChatScreenProps {
  initialMessage?: string;
  onSendMessage: (messageText?: string) => Promise<void>;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  onNewChat: () => void;
}

export function ChatScreen({
  initialMessage,
  onSendMessage,
  uploadedFile,
  onRemoveFile,
  onNewChat,
}: ChatScreenProps) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat(
    {}
  );

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      append({
        role: "user",
        content: initialMessage,
      });
    }
  }, [initialMessage, onSendMessage]);

  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNewChat={onNewChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-slate-200 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                  <p className="text-slate-800 text-sm">{message.content}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-4">
                  <div className="text-slate-800 text-sm leading-relaxed">
                    {message.content
                      .split("\n\n")
                      .map((paragraph: string, index: number) => {
                        if (paragraph.startsWith("```python")) {
                          const code = paragraph
                            .replace("```python\n", "")
                            .replace("\n```", "");
                          return (
                            <div key={index} className="my-4">
                              <div className="bg-slate-100 rounded-lg overflow-hidden">
                                <div className="bg-slate-200 px-3 py-2 text-xs text-slate-600 border-b">
                                  barGraph.py
                                </div>
                                <pre className="p-3 text-xs text-slate-700 overflow-x-auto">
                                  <code>{code}</code>
                                </pre>
                              </div>
                            </div>
                          );
                        }

                        if (paragraph.startsWith("•")) {
                          const bulletPoints = paragraph.split("\n");
                          return (
                            <div key={index} className="space-y-2 my-4">
                              {bulletPoints.map(
                                (point: string, pointIndex: number) => (
                                  <div
                                    key={pointIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">
                                      {point.replace("• ", "")}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          );
                        }

                        return (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={onSendMessage}
        uploadedFile={uploadedFile}
        onRemoveFile={onRemoveFile}
      />
    </div>
  );
}
