import { togetherAISDKClient } from "@/lib/clients";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: togetherAISDKClient("Qwen/Qwen2.5-7B-Instruct-Turbo"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
