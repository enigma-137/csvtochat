import { runPython } from "@/lib/coding";
import { NextRequest, NextResponse } from "next/server";
import { loadChat, saveChat } from "@/lib/chat-store";
import { generateId } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { code, session_id, files, id } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const result = await runPython(code, session_id, files);

    // Persist the code execution output as an assistant message in the chat history
    if (id) {
      const chat = await loadChat(id);
      const toolCallMessage = {
        id: generateId(),
        role: "assistant" as const,
        content: "Code execution complete.",
        createdAt: new Date(),
        toolCall: {
          toolInvocation: {
            toolName: "runCode",
            args: code,
            state: "result",
            result: result,
          },
        },
      };
      await saveChat({
        id,
        csvHeaders: chat?.csvHeaders || [],
        csvFileUrl: chat?.csvFileUrl || null,
        messages: [...(chat?.messages || []), toolCallMessage],
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
