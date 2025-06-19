import { loadChat } from "@/lib/chat-store";
import { ChatScreen } from "@/components/chat-screen";
import { Message } from "@/components/chat-screen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chat = await loadChat(id);

  // Ensure initialMessages has all required properties from UIMessage
  const initialMessages: Message[] =
    chat?.messages.map((msg) => ({
      ...msg,
      parts: [{ type: "text", text: msg.content }], // Provide a default parts array
    })) || [];

  return (
    <ChatScreen id={id} initialMessages={initialMessages} uploadedFile={null} />
  );
}
