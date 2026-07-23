import { conversations } from "@/data/conversations";
import { ChatHistoryItem } from "@/modules/sidebar/components/chat-history-item";

interface ChatHistoryListProps {
  collapsed?: boolean;
}

export function ChatHistoryList({ collapsed }: ChatHistoryListProps) {
  if (collapsed) return null;

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted">
        Recents
      </p>
      {conversations.map((conversation) => (
        <ChatHistoryItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
