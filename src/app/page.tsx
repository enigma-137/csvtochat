"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { HomeInput } from "@/components/HomeInput";
import { UploadArea } from "@/components/upload-area";
import { QuestionSuggestionCard } from "@/components/question-suggestion-card";
import { extractCsvData } from "@/lib/csvUtils";
import { HeroSection } from "@/components/hero-section";
import { ChatScreen } from "@/components/chat-screen";

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export default function CSVToChat() {
  const [currentScreen, setCurrentScreen] = useState<"upload" | "chat">(
    "upload"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestion[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File | null) => {
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
      setIsProcessing(true);

      try {
        const { headers, sampleRows } = await extractCsvData(file);

        const response = await fetch("/api/generate-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ columns: headers }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuggestedQuestions(data.questions);
      } catch (error) {
        console.error("Failed to process CSV file:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const removeFile = () => {
    setUploadedFile(null);
    setInitialMessage(null);
    setSuggestedQuestions([]);
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;
    setInitialMessage(text);
    setCurrentScreen("chat");
    setInputValue("");
  };

  const startNewChat = () => {
    removeFile();
    setCurrentScreen("upload");
    setInputValue("");
  };

  if (currentScreen === "upload") {
    return (
      <div className="min-h-screen bg-white">
        <Header onNewChat={startNewChat} />

        <div className="flex flex-col items-center px-6">
          <div className="flex flex-col items-center pt-16 pb-8">
            <HeroSection />

            <UploadArea
              onFileChange={handleFileUpload}
              uploadedFile={uploadedFile}
            />
          </div>

          {/* Large Input Area */}
          {uploadedFile && (
            <HomeInput
              value={inputValue}
              onChange={setInputValue}
              onSend={() => {
                handleSendMessage(inputValue);
              }}
              uploadedFile={uploadedFile}
              onRemoveFile={removeFile}
            />
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="w-full max-w-sm my-8 md:max-w-2xl">
              <p className="text-slate-500 text-sm mb-4 animate-pulse">
                <span className="font-medium">Generating suggestions</span>{" "}
                <span className="text-slate-400">...</span>
              </p>
              <div className="flex flex-col gap-3">
                {Array(3)
                  .fill(null)
                  .map((_, idx) => (
                    <QuestionSuggestionCard key={idx} question={""} isLoading />
                  ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestedQuestions.length > 0 && !isProcessing && (
            <div className="w-full max-w-sm my-8 md:max-w-2xl">
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

  if (!initialMessage) return <></>;

  // Chat Screen
  return (
    <ChatScreen
      initialMessage={initialMessage}
      uploadedFile={uploadedFile}
      onRemoveFile={removeFile}
      onNewChat={startNewChat}
    />
  );
}
