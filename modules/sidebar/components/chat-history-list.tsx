"use client";

import { useChatSessions } from "@/modules/chat/chat-sessions-context";
import { ChatHistoryItem } from "@/modules/sidebar/components/chat-history-item";
import { useSidebarContext } from "@/modules/sidebar/sidebar-context";

interface ChatHistoryListProps {
  collapsed?: boolean;
  query?: string;
}

export function ChatHistoryList({ collapsed, query = "" }: ChatHistoryListProps) {
  const { sessions, activeSessionId, selectSession } = useChatSessions();
  const { closeMobileSidebar } = useSidebarContext();

  if (collapsed) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? sessions.filter((session) => session.title.toLowerCase().includes(normalizedQuery))
    : sessions;

  function handleSelect(sessionId: string) {
    selectSession(sessionId);
    closeMobileSidebar();
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted">
        Recents
      </p>
      {filtered.length === 0 ? (
        <p className="px-3 py-2 text-sm text-muted">
          {sessions.length === 0 ? "No chats yet." : "No chats found."}
        </p>
      ) : (
        filtered.map((session) => (
          <ChatHistoryItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onClick={() => handleSelect(session.id)}
          />
        ))
      )}
    </div>
  );
}
