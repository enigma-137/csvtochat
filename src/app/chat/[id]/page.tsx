import { loadChat } from "@/lib/chat-store";
import { ChatScreen } from "@/components/chat-screen";
import { Message } from "@/components/chat-screen";

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id; // get the chat ID from the URL
  const messages = await loadChat(id);

  // Ensure initialMessages has all required properties from UIMessage
  const initialMessages: Message[] = messages.map((msg) => ({
    ...msg,
    parts: [{ type: "text", text: msg.content }], // Provide a default parts array
  }));

  return (
    <ChatScreen id={id} initialMessages={initialMessages} uploadedFile={null} />
  );
}
