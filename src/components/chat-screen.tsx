"use client";

import { useChat } from "@ai-sdk/react";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ChatInput } from "@/components/ChatInput";
import { MemoizedMarkdown } from "./MemoizedMarkdown";
import { TogetherCodeInterpreterResponseData } from "@/lib/coding";
import { CodeRender } from "./code-render";
import { type UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { ImageFigure } from "./chatTools/ImageFigure";
import { TerminalOutput } from "./chatTools/TerminalOutput";
import { ErrorOutput } from "./chatTools/ErrorOutput";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useDraftedInput } from "../hooks/useDraftedInput";
import { DbMessage } from "@/lib/chat-store";

export type Message = UIMessage & {
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
  duration?: number; // Duration in seconds for LLM/coding
  isAutoErrorResolution?: boolean; // Added for auto error resolution prompt
};

interface ChatScreenProps {
  uploadedFile: File | null;
  id?: string;
  initialMessages?: DbMessage[];
}

export function extractCodeFromText(text: string) {
  const codeRegex = /```python\s*([\s\S]*?)\s*```/g;
  const match = codeRegex.exec(text);
  return match ? match[1] : null;
}

// Thinking indicator component
function ThinkingIndicator() {
  return (
    <div className="flex items-start justify-start my-4">
      <img
        src="/loading.svg"
        alt="Thinking..."
        className="size-4 animate-spin"
      />
      <span className="ml-2 text-[#006597] font-semibold text-sm">
        Thinking <span className="animate-pulse">...</span>
      </span>
    </div>
  );
}

// ErrorBanner component for custom error and auto resolution prompt messages
function ErrorBanner({ isWaiting }: { isWaiting: boolean }) {
  return (
    <div className="mt-4 rounded-lg overflow-hidden bg-slate-50 border border-[#cad5e2] py-3 px-4 flex items-center max-w-[580px]">
      {isWaiting && (
        <img
          src="/loading.svg"
          alt="Loading"
          className="size-[14px] animate-spin"
        />
      )}
      <span className="text-[#45556c] text-sm ml-2">
        Something went wrong. Please hold tight while we fix things behind the
        scenes
      </span>
    </div>
  );
}

export function ChatScreen({
  uploadedFile,
  id,
  initialMessages,
}: ChatScreenProps) {
  const router = useRouter();
  const { messages, setMessages, append, data, status } = useChat({
    id, // use the provided chat ID
    initialMessages: initialMessages || [], // initial messages if provided
    sendExtraMessageFields: true, // send id and createdAt for each message
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1].content, id };
    },
    // Fake tool call
    onFinish: async (message) => {
      const code = extractCodeFromText(message.content);

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

        setIsCodeRunning(true);
        const response = await fetch("/api/coding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, id }),
        });

        const result = await response.json();

        // Check for error in outputs
        const errorOutput = Array.isArray(result.outputs)
          ? result.outputs.find((output: any) => output.type === "error")
          : undefined;
        const errorOccurred = Boolean(errorOutput);
        const errorMessage = errorOutput
          ? errorOutput.data || "Unknown error"
          : "";

        if (errorOccurred) {
          // Send error back to AI for resolution
          const errorResolutionPrompt = `The following error occurred when running the code you provided: ${errorMessage}. Please try to fix the code and try again.`;

          // Append the error resolution prompt as a user message
          setTimeout(() => {
            append(
              {
                role: "user",
                content: errorResolutionPrompt,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Auto-Error-Resolved": "true",
                },
              }
            );
          }, 1000); // slight delay for UX
        }

        // Update the tool call message with the "result" state
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === message.id + "_tool_call") {
              return {
                ...msg,
                isThinking: false,
                content: errorOccurred
                  ? "Code execution failed."
                  : "Code execution complete.",
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
        setIsCodeRunning(false);
      }
    },
  });

  // On mount, check for pendingMessage in localStorage and append it if present
  const didAppendPending = React.useRef(false);
  useEffect(() => {
    if (
      !didAppendPending.current &&
      messages.length === 0 &&
      typeof window !== "undefined"
    ) {
      const pending = localStorage.getItem("pendingMessage");
      if (pending) {
        append({
          role: "user",
          content: pending,
        });
        localStorage.removeItem("pendingMessage");
        didAppendPending.current = true;
      }
    }
  }, [append, messages.length]);

  // Use a unique key for each chat window's draft input
  const [inputValue, setInputValue, clearInputValue] = useDraftedInput(
    id ? `chatInputDraft-${id}` : "chatInputDraft"
  );

  // Define onRemoveFile and onNewChat inside the Client Component
  const handleRemoveFile = () => {
    // TODO: Implement file removal logic if needed
    console.log("File removed");
  };

  const handleNewChat = () => {
    router.push("/");
  };

  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const { messagesContainerRef, messagesEndRef, isUserAtBottom } =
    useAutoScroll({ status, isCodeRunning });

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Header onNewChat={handleNewChat} chatId={id} />

      <div className="flex flex-col md:ml-[70px]">
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-6 mx-auto max-w-[700px] w-full"
          ref={messagesContainerRef}
        >
          {messages.map((message, messageIdx) => {
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

            const isThisLastMessage = messages.length - 1 === messageIdx;

            return (
              <div key={currentMessage.id}>
                {isThisLastMessage && status === "streaming" && (
                  <ThinkingIndicator />
                )}

                {currentMessage.role === "user" ? (
                  <>
                    {currentMessage.isAutoErrorResolution ? (
                      <ErrorBanner isWaiting={isThisLastMessage} />
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-slate-200 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                          <p className="text-slate-800 text-sm">
                            {currentMessage.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
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
                          {stdOut && <TerminalOutput data={stdOut.data} />}

                          {errorCode && <ErrorOutput data={errorCode.data} />}

                          {imagePngBase64 && (
                            <ImageFigure
                              imageData={imagePngBase64.data as any}
                            />
                          )}
                        </div>
                      )}
                      {/* Timestamp for assistant messages */}
                      {currentMessage.role === "assistant" &&
                        currentMessage.createdAt && (
                          <div className="flex justify-start mt-1">
                            <span className="text-xs text-slate-400">
                              {typeof currentMessage.duration === "number" && (
                                <>
                                  <span className="mr-0.5">
                                    {currentMessage.duration.toFixed(2)}s -
                                  </span>
                                </>
                              )}
                              {formatTimestamp(currentMessage.createdAt)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {isThisLastMessage && status === "submitted" && (
                  <ThinkingIndicator />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSend={async () => {
            // Clear input and localStorage immediately on submit
            const newMessage = inputValue;
            clearInputValue();
            await append({
              role: "user",
              content: newMessage,
            });
          }}
          uploadedFile={uploadedFile}
          onRemoveFile={handleRemoveFile}
        />
      </div>
    </div>
  );
}

// Add this helper function at the top-level (outside the component)
function formatTimestamp(dateString: string | number | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  let timeAgo = "";
  if (secondsAgo < 60) {
    timeAgo = `${secondsAgo}s`;
  } else if (secondsAgo < 3600) {
    timeAgo = `${Math.floor(secondsAgo / 60)}m`;
  } else {
    timeAgo = `${Math.floor(secondsAgo / 3600)}h`;
  }
  // Format: Apr 8, 06:17:50 PM
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formatted = date.toLocaleString("en-US", options);
  return formatted;
}
