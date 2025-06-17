"use client";

import { useChat } from "@ai-sdk/react";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ChatInput } from "@/components/chat-input";
import { MemoizedMarkdown } from "./MemoizedMarkdown";
import { TogetherCodeInterpreterResponseData } from "@/lib/coding";
import { CodeRender } from "./code-render";
import { type Message as AIsdkMessage } from "ai";

export type Message = AIsdkMessage & {
  isThinking?: boolean;
  isUser?: boolean;
  toolCall?: {
    toolInvocation: {
      toolName: string;
      args: string;
      state: string;
      result?: any;
    };
  };
};

interface ChatScreenProps {
  initialMessage?: string;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  onNewChat: () => void;
}

export function extractCodeFromText(text: string) {
  const codeRegex = /```python\s*([\s\S]*?)\s*```/g;
  const match = codeRegex.exec(text);
  return match ? match[1] : null;
}

export function ChatScreen({
  initialMessage,
  uploadedFile,
  onRemoveFile,
  onNewChat,
}: ChatScreenProps) {
  const { messages, setMessages, append } = useChat({
    // Fake tool call
    onFinish: async (message) => {
      const code = extractCodeFromText(message.content);

      console.log("code", code);

      if (code) {
        // Add a "tool-invocation" message with a "start" state
        setMessages((prev) => {
          return [
            ...prev,
            {
              id: message.id + "_tool_call", // Unique ID for the tool call message
              role: "assistant",
              content: "Running code...",
              isThinking: true,
              toolCall: {
                toolInvocation: {
                  toolName: "runCode",
                  args: code,
                  state: "start",
                },
              },
            },
          ];
        });

        const response = await fetch("/api/coding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const result = await response.json();

        console.log("/api/coding result:", result);

        // Update the tool call message with the "result" state
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === message.id + "_tool_call") {
              return {
                ...msg,
                isThinking: false,
                content: "Code execution complete.", // Or an empty string if content is not needed
                toolCall: {
                  toolInvocation: {
                    toolName: "runCode",
                    args: code,
                    state: "result",
                    result: result,
                  },
                },
              };
            }
            return msg;
          });
        });
      }
    },
  });

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      append({
        role: "user",
        content: initialMessage,
      });
    }
  }, [initialMessage]);

  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNewChat={onNewChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => {
          const currentMessage = message as Message; // Cast to our custom Message interface

          const codeResults =
            currentMessage.toolCall?.toolInvocation.toolName === "runCode"
              ? (currentMessage.toolCall?.toolInvocation
                  .result as TogetherCodeInterpreterResponseData)
              : undefined;

          const stdOut = codeResults?.outputs?.find(
            (result: any) => result.type === "stdout"
          );

          const errorCode = codeResults?.outputs?.find(
            (result: any) => result.type === "error"
          );

          const imagePngBase64 = codeResults?.outputs?.find(
            (result: any) => result.type === "display_data"
          );

          return (
            <div key={currentMessage.id}>
              {currentMessage.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-slate-200 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-slate-800 text-sm">
                      {currentMessage.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-4">
                    <div className="text-slate-800 text-sm prose">
                      <MemoizedMarkdown
                        id={currentMessage.id}
                        content={currentMessage.content}
                      />
                    </div>
                    {currentMessage.isThinking && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e] animate-pulse">
                        <h3 className="text-slate-200 text-xs font-semibold px-4 py-2 border-b border-slate-700">
                          Running code...
                        </h3>
                        <CodeRender code="" language="bash" theme="dark" />
                      </div>
                    )}

                    {currentMessage.toolCall?.toolInvocation.state ===
                      "result" && (
                      <div className="text-slate-800 text-sm leading-relaxed">
                        {stdOut && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e]">
                            <h3 className="text-slate-200 text-xs font-semibold px-4 py-2 border-b border-slate-700">
                              Bash Output (stdout):
                            </h3>
                            <CodeRender
                              code={stdOut.data}
                              language="bash"
                              theme="dark"
                            />
                          </div>
                        )}

                        {errorCode && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-red-700 bg-[#2d1e1e]">
                            <h3 className="text-red-300 text-xs font-semibold px-4 py-2 border-b border-red-700">
                              Error:
                            </h3>
                            <CodeRender
                              code={errorCode.data}
                              language="bash"
                              theme="dark"
                            />
                          </div>
                        )}

                        {imagePngBase64 && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-white p-4 flex justify-center items-center">
                            <h3 className="sr-only">Image:</h3>
                            <img
                              src={`data:image/png;base64,${
                                (imagePngBase64.data as any)["image/png"]
                              }`}
                              alt="image"
                              className="max-w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={() => {
          // add user message to the chat
          append({
            role: "user",
            content: inputValue,
          });
          setInputValue("");
        }}
        uploadedFile={uploadedFile}
        onRemoveFile={onRemoveFile}
      />
    </div>
  );
}
