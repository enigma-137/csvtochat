"use server";
import { Message } from "ai";
import { generateId } from "ai";
import { redis } from "./clients"; // Import your redis client

const CHAT_KEY_PREFIX = "chat:";

type ChatData = {
  messages: Message[];
  csvFileUrl: string | null;
  title: string | null;
  // ...future fields
};

export async function createChat(): Promise<string> {
  const id = generateId();
  const initial: ChatData = {
    messages: [],
    csvFileUrl: null,
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
  messages,
  csvFileUrl = null,
  title = null,
}: {
  id: string;
  messages: Message[];
  csvFileUrl?: string | null;
  title?: string | null;
}): Promise<void> {
  const chatData: ChatData = {
    messages,
    csvFileUrl,
    title,
  };
  await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(chatData));
}
