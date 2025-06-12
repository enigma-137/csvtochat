"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { ChatInput } from "@/components/chat-input";
import { UploadArea } from "@/components/upload-area";
import { QuestionSuggestionCard } from "@/components/question-suggestion-card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
}

interface SuggestedQuestion {
  id: string;
  text: string;
}

export default function CSVToChat() {
  const [currentScreen, setCurrentScreen] = useState<"upload" | "chat">(
    "upload"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestion[]
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
      setIsProcessing(true);

      // Simulate CSV processing
      setTimeout(() => {
        // Mock extracted columns
        const mockColumns = [
          "Industry",
          "Total_Income_2024",
          "Total_Income_2023",
          "Growth_Rate",
          "Assets_2024",
        ];
        setCsvColumns(mockColumns);

        // Generate AI suggestions based on columns
        const suggestions: SuggestedQuestion[] = [
          {
            id: "1",
            text: "What is the total income trend by industry in the year 2024?",
          },
          {
            id: "2",
            text: "How do total expenditures and income compare in 2023?",
          },
          {
            id: "3",
            text: "What is the current versus total assets distribution in 2024?",
          },
        ];
        setSuggestedQuestions(suggestions);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setCsvColumns([]);
    setSuggestedQuestions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Thinking...",
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setCurrentScreen("chat");
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: generateAIResponse(text),
      };

      setMessages((prev) =>
        prev.filter((m) => !m.isThinking).concat([userMessage, aiResponse])
      );
    }, 2000);
  };

  const generateAIResponse = (question: string): string => {
    if (question.toLowerCase().includes("income trend")) {
      return `Based on your dataset, the combined total income across all industries in 2024 is $9.3 billion, reflecting a 5% year-over-year growth. Here's a quick breakdown by major industry:

\`\`\`python
import matplotlib.pyplot as plt

industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]
income_2024 = [3.1, 2.2, 1.6, 1.1, 1.3]  # in billions USD

plt.bar(industries, income_2024, color="#4F81BD")
plt.title("Total Income by Industry (2024)")
\`\`\`

• **Technology**: $3.1B (up 7% from last year)
• **Healthcare**: $2.2B (up 5%)
• **Finance**: $1.6B (up 4%)
• **Retail**: $1.1B (up 6%)
• **Manufacturing**: $1.3B (up 3%)

Technology remains the fastest-growing sector, driven by increased investment in software and services, while Healthcare shows steady growth due to rising demand in medical services.`;
    }

    return "I can help you analyze your CSV data. Please ask me specific questions about the trends, comparisons, or insights you'd like to explore.";
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentScreen("upload");
    setInputValue("");
  };

  if (currentScreen === "upload") {
    return (
      <div className="min-h-screen bg-white">
        <Header onNewChat={startNewChat} />

        <div className="flex flex-col items-center px-6">
          <UploadArea
            onFileSelect={() => fileInputRef.current?.click()}
            hasFile={!!uploadedFile}
          />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Large Input Area */}
          {uploadedFile && (
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              uploadedFile={uploadedFile}
              onRemoveFile={removeFile}
              multiline={true}
            />
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center text-slate-500 my-8">
              <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Processing your CSV file...</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestedQuestions.length > 0 && !isProcessing && (
            <div className="w-full max-w-sm mt-8 md:max-w-2xl">
              <p className="text-slate-500 text-sm mb-4">
                <span className="font-medium">Suggestions</span>{" "}
                <span className="text-slate-400">
                  based on your uploaded CSV:
                </span>
              </p>
              <div className="flex flex-col gap-3">
                {suggestedQuestions.map((suggestion) => (
                  <QuestionSuggestionCard
                    key={suggestion.id}
                    question={suggestion.text}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNewChat={startNewChat} />

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
                {message.isThinking && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
                    Thinking...
                  </div>
                )}
                {!message.isThinking && (
                  <div className="space-y-4">
                    <div className="text-slate-800 text-sm leading-relaxed">
                      {message.content.split("\n\n").map((paragraph, index) => {
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
                              {bulletPoints.map((point, pointIndex) => (
                                <div
                                  key={pointIndex}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">
                                    {point.replace("• ", "")}
                                  </span>
                                </div>
                              ))}
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        uploadedFile={uploadedFile}
        onRemoveFile={removeFile}
      />
    </div>
  );
}
