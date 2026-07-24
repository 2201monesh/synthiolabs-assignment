import { ChatMessageItem } from "@/modules/chat/components/chat-message-item";
import type { ChatMessage } from "@/lib/types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  onEdit: (messageId: string, newContent: string) => void;
  disabled?: boolean;
}

export function ChatMessageList({ messages, onEdit, disabled }: ChatMessageListProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} onEdit={onEdit} disabled={disabled} />
      ))}
    </div>
  );
}
