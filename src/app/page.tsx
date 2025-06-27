"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { UploadArea } from "@/components/upload-area";
import { QuestionSuggestionCard } from "@/components/question-suggestion-card";
import { extractCsvData } from "@/lib/csvUtils";
import { HeroSection } from "@/components/hero-section";
import { redirect } from "next/navigation";
import { createChat } from "@/lib/chat-store";
import { useS3Upload } from "next-s3-upload";
import { PromptInput } from "@/components/PromptInput";
import { toast } from "sonner";
import { useLLMModel } from "@/hooks/useLLMModel";

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export default function CSVToChat() {
  const { uploadToS3 } = useS3Upload();

  const { selectedModelSlug } = useLLMModel();
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestion[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File | null) => {
    if (file && file.type === "text/csv") {
      setLocalFile(file);
      setIsProcessing(true);

      try {
        const { headers, sampleRows } = await extractCsvData(file);

        if (headers.length === 0) {
          alert("Please upload a CSV with headers.");
          setLocalFile(null);
          setIsProcessing(false);
          return;
        }

        setCsvHeaders(headers);

        const uploadPromise = uploadToS3(file);

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

        const uploadedFile = await uploadPromise;

        setUploadedFileUrl(uploadedFile.url);

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
    setLocalFile(null);
    setSuggestedQuestions([]);
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    if (!uploadedFileUrl) {
      toast.warning("Please upload a CSV file first.");
      return;
    }

    if (csvHeaders.length === 0) {
      toast.warning("Please upload a CSV with headers.");
      return;
    }

    localStorage.setItem("pendingMessage", text);

    const id = await createChat({
      userQuestion: text, // it's not stored in db here just used for chat title!
      csvHeaders: csvHeaders,
      csvFileUrl: uploadedFileUrl,
    });
    redirect(`/chat/${id}?model=${selectedModelSlug}`);
  };

  const startNewChat = () => {
    removeFile();
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNewChat={startNewChat} />

      <div className="flex flex-col items-center px-4 md:px-6">
        <div className="flex flex-col items-center md:items-start pt-16 md:pt-[132px] pb-8 max-w-[655px] mx-auto w-full">
          <HeroSection />

          <UploadArea
            onFileChange={handleFileUpload}
            uploadedFile={localFile}
          />
        </div>

        {/* Large Input Area */}
        {localFile && (
          <div className="w-full max-w-sm md:max-w-2xl mx-auto">
            <PromptInput
              value={inputValue}
              onChange={setInputValue}
              onSend={() => {
                handleSendMessage(inputValue);
              }}
              uploadedFile={{
                name: localFile.name,
              }}
              onRemoveFile={removeFile}
              textAreaClassName="h-[88px] md:h-[100px]"
            />
          </div>
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
