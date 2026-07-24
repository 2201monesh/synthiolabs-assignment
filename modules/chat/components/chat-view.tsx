"use client";

import { useEffect, useRef } from "react";
import { ChatHome } from "@/modules/chat/components/chat-home";
import { ChatHeader } from "@/modules/chat/components/chat-header";
import { ChatMessageList } from "@/modules/chat/components/chat-message-list";
import { ChatInput } from "@/modules/chat/components/chat-input";
import { useChatSessions } from "@/modules/chat/chat-sessions-context";

function toTitle(content: string) {
  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
}

export function ChatView() {
  const { activeMessages, isStreaming, sendMessage, editMessage } = useChatSessions();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [activeMessages]);

  if (activeMessages.length === 0) {
    return <ChatHome onSend={sendMessage} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader title={toTitle(activeMessages[0].content)} />
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        <ChatMessageList messages={activeMessages} onEdit={editMessage} disabled={isStreaming} />
      </div>
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
