import type { Conversation } from "@/lib/types";

interface ChatHistoryItemProps {
  conversation: Conversation;
}

export function ChatHistoryItem({ conversation }: ChatHistoryItemProps) {
  return (
    <button className="truncate rounded-xl px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors hover:bg-black/5 dark:hover:bg-white/5">
      {conversation.title}
    </button>
  );
}
