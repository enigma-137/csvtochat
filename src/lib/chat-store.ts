"use server";
import {
  Message as AIMsg,
  CoreAssistantMessage,
  CoreToolMessage,
  generateText,
} from "ai";
import { generateId } from "ai";
import { redis, togetherAISDKClient } from "./clients"; // Import your redis client
const CHAT_KEY_PREFIX = "chat:";

// Extend the Message type to include duration for Redis persistence
export type DbMessage = AIMsg & {
  duration?: number;
  isAutoErrorResolution?: boolean; // if true then this message is an automatic error resolution prompt
};

type ChatData = {
  messages: DbMessage[];
  csvFileUrl: string | null;
  csvHeaders: string[] | null;
  title: string | null; // inferring the title of the chat based on csvHeaders and first user messages
  createdAt?: Date;
  // ...future fields
};

export async function createChat({
  userQuestion,
  csvHeaders,
  csvFileUrl,
}: {
  userQuestion: string;
  csvHeaders: string[];
  csvFileUrl: string;
}): Promise<string> {
  const id = generateId();

  // use userQuestion to generate a title for the chat
  const { text: title } = await generateText({
    model: togetherAISDKClient("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    prompt: `
You are an expert data scientist assistant that create titles for chat conversations.

You are given a dataset and a question.

The dataset has the following columns: ${
      csvHeaders?.join(", ") || "[NO HEADERS PROVIDED]"
    }

The question from the user is: ${userQuestion}

Just return the title of the chat conversation but keep it super short like a maximum of 5 words.
`,
    maxTokens: 100,
  });

  const initial: ChatData = {
    messages: [],
    csvHeaders,
    csvFileUrl,
    title,
    createdAt: new Date(),
  };
  await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(initial));
  return id;
}

export async function loadChat(id: string): Promise<ChatData | null> {
  const value = await redis.get(`${CHAT_KEY_PREFIX}${id}`);
  if (!value) return null;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}

export async function saveNewMessage({
  id,
  message,
}: {
  id: string;
  message: DbMessage;
}): Promise<void> {
  const chat = await loadChat(id);
  if (chat) {
    const updatedMessages = [...(chat.messages || []), message];
    await redis.set(
      `${CHAT_KEY_PREFIX}${id}`,
      JSON.stringify({
        ...chat,
        messages: updatedMessages,
      })
    );
  } else {
    // If chat does not exist, create a new one with this message
    const newChat: ChatData = {
      messages: [message],
      csvHeaders: null,
      csvFileUrl: null,
      title: null,
    };
    await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(newChat));
  }
}
