"use client";

import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface QuestionSuggestionCardProps {
  question: string;
  onClick: () => void;
}

export function QuestionSuggestionCard({
  question,
  onClick,
}: QuestionSuggestionCardProps) {
  return (
    <Card
      className="flex justify-start items-start overflow-hidden gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border-[0.7px] border-[#cad5e2] w-fit md:min-w-[440px]"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/suggestion.svg" alt="suggestion" className="size-[18px]" />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{question}</p>
      </div>
    </Card>
  );
}
