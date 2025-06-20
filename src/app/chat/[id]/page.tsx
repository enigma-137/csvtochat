import { loadChat } from "@/lib/chat-store";
import { ChatScreen } from "@/components/chat-screen";

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
