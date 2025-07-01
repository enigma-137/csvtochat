"use server";
import { Message as AIMsg, generateText } from "ai";
import { generateId } from "ai";
import { redis, togetherAISDKClient } from "./clients"; // Import your redis client
import { generateTitlePrompt } from "./prompts";
import { EXAMPLE_QUESTION } from "./utils";
const CHAT_KEY_PREFIX = "chat:";

// Extend the Message type to include duration for Redis persistence
export type DbMessage = AIMsg & {
  duration?: number;
  model?: string; // which model was used to generate this message
  isAutoErrorResolution?: boolean; // if true then this message is an automatic error resolution prompt
};

type ChatData = {
  messages: DbMessage[];
  csvFileUrl: string | null;
  csvHeaders: string[] | null;
  csvRows: { [key: string]: string }[] | null;
  title: string | null; // inferring the title of the chat based on csvHeaders and first user messages
  createdAt?: Date;
  // ...future fields
};

export async function createExampleChat(): Promise<string> {
  const csvFileUrl =
    "https://napkinsdev.s3.us-east-1.amazonaws.com/next-s3-uploads/3b241aef-14f2-4881-9746-ede14fe62162/products-100.csv";
  const csvHeaders = [
    "Index",
    "Name",
    "Description",
    "Brand",
    "Category",
    "Price",
    "Currency",
    "Stock",
    "EAN",
    "Color",
    "Size",
    "Availability",
    "Internal ID",
  ];
  const userQuestion = EXAMPLE_QUESTION;

  return createChat({
    userQuestion,
    csvHeaders,
    csvRows: [
      {
        Index: "1",
        Name: "Compact Printer Air Advanced Digital",
        Description: "Situation organization these memory much off.",
        Brand: "Garner, Boyle and Flynn",
        Category: "Books & Stationery",
        Price: "265",
        Currency: "USD",
        Stock: "774",
        EAN: "2091465262179",
        Color: "ForestGreen",
        Size: "Large",
        Availability: "pre_order",
        "Internal ID": "56",
      },
      {
        Index: "34",
        Name: "Automatic Brush Fast Eco",
        Description: "Record response relationship.",
        Brand: "Newman Ltd",
        Category: "Kids' Clothing",
        Price: "407",
        Currency: "USD",
        Stock: "285",
        EAN: "2327483415120",
        Color: "SeaGreen",
        Size: "8x10 in",
        Availability: "out_of_stock",
        "Internal ID": "65",
      },
      {
        Index: "67",
        Name: "Mini Charger Lock Oven Sense Sense",
        Description: "Major tell him share allow.",
        Brand: "Burton, Gross and Giles",
        Category: "Haircare",
        Price: "750",
        Currency: "USD",
        Stock: "623",
        EAN: "9282813513019",
        Color: "Olive",
        Size: "12x18 in",
        Availability: "in_stock",
        "Internal ID": "81",
      },
      {
        Index: "100",
        Name: "Smart Lamp",
        Description: "However public major baby.",
        Brand: "Hebert, Hughes and Trujillo",
        Category: "Bedding & Bath",
        Price: "71",
        Currency: "USD",
        Stock: "518",
        EAN: "8264263605712",
        Color: "Brown",
        Size: "Medium",
        Availability: "limited_stock",
        "Internal ID": "3",
      },
    ],
    csvFileUrl,
  });
}

export async function createChat({
  userQuestion,
  csvHeaders,
  csvRows,
  csvFileUrl,
}: {
  userQuestion: string;
  csvHeaders: string[];
  csvRows: { [key: string]: string }[];
  csvFileUrl: string;
}): Promise<string> {
  const id = generateId();

  // use userQuestion to generate a title for the chat
  const { text: title } = await generateText({
    model: togetherAISDKClient("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    prompt: generateTitlePrompt({ csvHeaders, userQuestion }),
    maxTokens: 100,
  });

  const initial: ChatData = {
    messages: [],
    csvHeaders,
    csvRows,
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
    return typeof value === "string" ? JSON.parse(value) : (value as ChatData);
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
      csvRows: null,
      csvFileUrl: null,
      title: null,
    };
    await redis.set(`${CHAT_KEY_PREFIX}${id}`, JSON.stringify(newChat));
  }
}
