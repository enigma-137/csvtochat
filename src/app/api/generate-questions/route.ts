import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { togetherAISDKClient } from "@/lib/clients";

const questionSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .describe("A question that can be asked about the provided CSV columns."),
});

const outputSchema = z.array(questionSchema);

export async function POST(req: Request) {
  try {
    const { columns } = await req.json();

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: "columns" array is required.' },
        { status: 400 }
      );
    }

    const { object: generatedQuestions } = await generateObject({
      model: togetherAISDKClient("meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"),
      mode: "json",
      schema: outputSchema,
      prompt: `Generate 5 insightful questions that can be asked to analyze a CSV file with the following columns: ${columns.join(
        ", "
      )}. Focus on questions that would reveal trends, comparisons,  or insights from the data. Do not include phrases like "in the dataset", "from the data", or "in the CSV file". Provide the questions in the format: {id: string, text: string}.`,
    });

    return NextResponse.json(
      { questions: generatedQuestions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
