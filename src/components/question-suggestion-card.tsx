"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface QuestionSuggestionCardProps {
  question: string
  onClick: () => void
}

export function QuestionSuggestionCard({ question, onClick }: QuestionSuggestionCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-slate-50 transition-colors border-slate-200 shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-3 h-3 text-slate-500" />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{question}</p>
      </div>
    </Card>
  )
}
