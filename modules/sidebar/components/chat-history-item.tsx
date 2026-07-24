import { cn } from "@/lib/utils";
import type { ChatSession } from "@/modules/chat/chat-sessions-context";

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive?: boolean;
  onClick: () => void;
}

export function ChatHistoryItem({ session, isActive, onClick }: ChatHistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "truncate rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5",
        isActive
          ? "bg-black/5 text-foreground dark:bg-white/5"
          : "text-sidebar-foreground/80"
      )}
    >
      {session.title}
    </button>
  );
}
