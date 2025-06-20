import { runPython } from "@/lib/coding";
import { NextRequest, NextResponse } from "next/server";
import { loadChat, saveNewMessage } from "@/lib/chat-store";
import { generateId } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { code, session_id, files, id } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Start timing
    const start = Date.now();
    const result = await runPython(code, session_id, files);
    const end = Date.now();
    const duration = (end - start) / 1000;

    // Persist the code execution output as an assistant message in the chat history
    if (id) {
      const toolCallMessage = {
        id: generateId(),
        role: "assistant" as const,
        content: "Code execution complete.",
        createdAt: new Date(),
        duration,
        toolCall: {
          toolInvocation: {
            toolName: "runCode",
            // args: code, // maybe we don't save code also here cause it's already in the previous llm message
            state: "result",
            result: result,
          },
        },
      };
      await saveNewMessage({ id, message: toolCallMessage });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
