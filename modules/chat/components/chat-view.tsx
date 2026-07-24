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
  const [isStreaming, setIsStreaming] = useState(false);

  async function sendMessage(baseHistory: ChatMessage[], content: string) {
    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage("assistant", "");
    const requestHistory = [...baseHistory, userMessage];

    setMessages([...requestHistory, assistantMessage]);
    setIsStreaming(true);

    function updateAssistantMessage(updater: (current: string) => string) {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, content: updater(message.content) }
            : message
        )
      );
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestHistory.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        updateAssistantMessage((current) => current + chunk);
      }
    } catch {
      updateAssistantMessage(
        () => "Something went wrong while generating a response. Please try again."
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSend(content: string) {
    return sendMessage(messages, content);
  }

  function handleEdit(messageId: string, newContent: string) {
    const index = messages.findIndex((message) => message.id === messageId);
    if (index === -1) return;
    return sendMessage(messages.slice(0, index), newContent);
  }

  if (messages.length === 0) {
    return <ChatHome onSend={handleSend} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader title={toTitle(messages[0].content)} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ChatMessageList messages={messages} onEdit={handleEdit} disabled={isStreaming} />
      </div>
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
