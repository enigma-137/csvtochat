import { loadChat } from "@/lib/chat-store";
import { ChatScreen } from "@/components/chat-screen";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chat = await loadChat(id);
  if (!chat) {
    return {
      title: "Chat not found | CSV2Chat",
      description: "No chat found for this ID.",
    };
  }
  return {
    title:
      chat.title ||
      `Chat "${
        chat.messages.find((msg) => msg.role === "user")?.content
      }" | CSV2Chat`,
    description: chat.csvHeaders
      ? `Chat about CSV columns: ${chat.csvHeaders.join(", ")}`
      : "Chat with your CSV using Together.ai",
    openGraph: {
      images: ["https://csvtochat.com/og.jpg"],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chat = await loadChat(id);

  return (
    <ChatScreen id={id} initialMessages={chat?.messages} uploadedFile={null} />
  );
}
