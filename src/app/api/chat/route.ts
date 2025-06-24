import { togetherAISDKClient } from "@/lib/clients";
import {
  streamText,
  generateId,
  CoreMessage,
  appendResponseMessages,
} from "ai";
import { DbMessage, loadChat, saveNewMessage } from "@/lib/chat-store";
import { limitMessages } from "@/lib/limits";
import { generateCodePrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  const { id, message } = await req.json();

  // get from headers X-Auto-Error-Resolved
  const errorResolved = req.headers.get("X-Auto-Error-Resolved");

  // Use IP address as a simple user fingerprint
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    if (!errorResolved) {
      await limitMessages(ip);
    }
  } catch (err) {
    return new Response("Too many messages. Daily limit reached.", {
      status: 429,
    });
  }

  const chat = await loadChat(id);

  const newUserMessage: DbMessage = {
    id: generateId(),
    role: "user",
    content: message,
    createdAt: new Date(),
    isAutoErrorResolution: errorResolved === "true",
  };

  // Save the new user message
  await saveNewMessage({ id, message: newUserMessage });

  const messagesToSave: DbMessage[] = [
    ...(chat?.messages || []),
    newUserMessage,
  ];

  const coreMessagesForStream = messagesToSave
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  // Start timing
  const start = Date.now();

  const stream = streamText({
    model: togetherAISDKClient("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    system: generateCodePrompt({
      csvFileUrl: chat?.csvFileUrl || "",
      csvHeaders: chat?.csvHeaders || [],
    }),
    messages: coreMessagesForStream.filter(
      (msg) => msg.role !== "system"
    ) as CoreMessage[],
    async onFinish({ response }) {
      // End timing
      const end = Date.now();
      const duration = (end - start) / 1000;

      if (response.messages.length > 1) {
        console.log("response.messages", response.messages);
        return;
      }

      const responseMessages = appendResponseMessages({
        messages: messagesToSave,
        responseMessages: response.messages,
      });

      const responseMessage = responseMessages.at(-1);

      if (!responseMessage) {
        return;
      }

      await saveNewMessage({
        id,
        message: {
          ...responseMessage,
          duration,
        },
      });
    },
  });

  return new Response(stream.toDataStream());
}
