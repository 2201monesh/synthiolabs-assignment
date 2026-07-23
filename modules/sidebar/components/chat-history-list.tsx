import { conversations } from "@/data/conversations";
import { ChatHistoryItem } from "@/modules/sidebar/components/chat-history-item";

interface ChatHistoryListProps {
  collapsed?: boolean;
  query?: string;
}

export function ChatHistoryList({ collapsed, query = "" }: ChatHistoryListProps) {
  if (collapsed) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(normalizedQuery)
      )
    : conversations;

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted">
        Recents
      </p>
      {filtered.length === 0 ? (
        <p className="px-3 py-2 text-sm text-muted">No chats found.</p>
      ) : (
        filtered.map((conversation) => (
          <ChatHistoryItem key={conversation.id} conversation={conversation} />
        ))
      )}
    </div>
  );
}
