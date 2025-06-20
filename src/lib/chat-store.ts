"use server";
import { Message as AIMsg } from "ai";
import { generateId } from "ai";
import { redis } from "./clients"; // Import your redis client

const CHAT_KEY_PREFIX = "chat:";

// Extend the Message type to include duration for Redis persistence
export type Message = AIMsg & {
  duration?: number;
};

type ChatData = {
  messages: Message[];
  csvFileUrl: string | null;
  csvHeaders: string[] | null;
  title: string | null; // inferring the title of the chat based on csvHeaders and first user messages
  // ...future fields
};

export async function createChat({
  csvHeaders,
  csvFileUrl,
}: {
  csvHeaders: string[];
  csvFileUrl: string;
}): Promise<string> {
  const id = generateId();
  const initial: ChatData = {
    messages: [],
    csvHeaders,
    csvFileUrl,
    title: null,
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

export async function saveChat({
  id,
  csvHeaders,
  messages,
  csvFileUrl = null,
  title = null,
}: {
  id: string;
  csvHeaders: string[] | null;
  messages: Message[];
  csvFileUrl?: string | null;
  title?: string | null;
}): Promise<void> {
  const chatData: ChatData = {
    csvHeaders,
    messages,
    csvFileUrl,
    title,
  };
  await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(chatData));
}
