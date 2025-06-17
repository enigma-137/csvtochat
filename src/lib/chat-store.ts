"use server";
import { Message } from "ai";
import { generateId } from "ai";
import { redis } from "./clients"; // Import your redis client

const CHAT_KEY_PREFIX = "chat:";

export async function createChat(): Promise<string> {
  const id = generateId();
  await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify([])); // Store an empty array for messages
  return id;
}

export async function loadChat(id: string): Promise<Message[]> {
  const chatData = await redis.get(`${CHAT_KEY_PREFIX}${id}`);
  return typeof chatData === "string" && chatData.length > 0
    ? JSON.parse(chatData)
    : [];
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(messages));
}
