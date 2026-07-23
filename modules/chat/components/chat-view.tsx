"use client";

import { useState } from "react";
import { ChatHome } from "@/modules/chat/components/chat-home";
import { ChatHeader } from "@/modules/chat/components/chat-header";
import { ChatMessageList } from "@/modules/chat/components/chat-message-list";
import { ChatInput } from "@/modules/chat/components/chat-input";
import type { ChatMessage } from "@/lib/types";

function toTitle(content: string) {
  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSend(content: string) {
    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage(
      "assistant",
      "This is a placeholder response. Connect an AI backend to make me smarter."
    );
    setMessages((previous) => [...previous, userMessage, assistantMessage]);
  }

  if (messages.length === 0) {
    return <ChatHome onSend={handleSend} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader title={toTitle(messages[0].content)} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ChatMessageList messages={messages} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
