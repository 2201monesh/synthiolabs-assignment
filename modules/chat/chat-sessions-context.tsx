"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ChatMessage } from "@/lib/types";

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

interface ChatSessionsContextValue {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeMessages: ChatMessage[];
  isStreaming: boolean;
  startNewChat: () => void;
  selectSession: (sessionId: string) => void;
  sendMessage: (content: string, viaVoice?: boolean) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
}

function stripMarkdownForSpeech(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s/gm, "")
    .trim();
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const cleaned = stripMarkdownForSpeech(text);
  if (!cleaned) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  window.speechSynthesis.speak(utterance);
}

const ChatSessionsContext = createContext<ChatSessionsContextValue | null>(null);

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function toTitle(content: string) {
  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
}

export function ChatSessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeMessages = sessions.find((session) => session.id === activeSessionId)?.messages ?? [];

  function updateSessionMessages(
    sessionId: string,
    updater: (messages: ChatMessage[]) => ChatMessage[]
  ) {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === sessionId ? { ...session, messages: updater(session.messages) } : session
      )
    );
  }

  async function streamAssistantReply(
    sessionId: string,
    requestHistory: ChatMessage[],
    assistantMessageId: string,
    onComplete?: (finalText: string) => void
  ) {
    setIsStreaming(true);
    let fullText = "";

    function updateAssistantMessage(updater: (current: string) => string) {
      updateSessionMessages(sessionId, (messages) =>
        messages.map((message) =>
          message.id === assistantMessageId
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
          messages: requestHistory.map(({ role, content }) => ({ role, content })),
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
        fullText += chunk;
        updateAssistantMessage((current) => current + chunk);
      }

      onComplete?.(fullText);
    } catch {
      updateAssistantMessage(
        () => "Something went wrong while generating a response. Please try again."
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function startNewChat() {
    setActiveSessionId(null);
  }

  function selectSession(sessionId: string) {
    setActiveSessionId(sessionId);
  }

  async function sendMessage(content: string, viaVoice?: boolean) {
    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage("assistant", "");
    const onComplete = viaVoice ? speak : undefined;

    const existingSession = sessions.find((session) => session.id === activeSessionId);

    if (existingSession) {
      const requestHistory = [...existingSession.messages, userMessage];
      updateSessionMessages(existingSession.id, (messages) => [
        ...messages,
        userMessage,
        assistantMessage,
      ]);
      await streamAssistantReply(
        existingSession.id,
        requestHistory,
        assistantMessage.id,
        onComplete
      );
      return;
    }

    const sessionId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: sessionId,
      title: toTitle(content),
      messages: [userMessage, assistantMessage],
      updatedAt: new Date().toISOString(),
    };

    setSessions((previous) => [newSession, ...previous]);
    setActiveSessionId(sessionId);
    await streamAssistantReply(sessionId, [userMessage], assistantMessage.id, onComplete);
  }

  async function editMessage(messageId: string, newContent: string) {
    const session = sessions.find((item) => item.id === activeSessionId);
    if (!session) return;

    const index = session.messages.findIndex((message) => message.id === messageId);
    if (index === -1) return;

    const baseHistory = session.messages.slice(0, index);
    const userMessage = createMessage("user", newContent);
    const assistantMessage = createMessage("assistant", "");
    const requestHistory = [...baseHistory, userMessage];

    updateSessionMessages(session.id, () => [...baseHistory, userMessage, assistantMessage]);
    await streamAssistantReply(session.id, requestHistory, assistantMessage.id);
  }

  return (
    <ChatSessionsContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeMessages,
        isStreaming,
        startNewChat,
        selectSession,
        sendMessage,
        editMessage,
      }}
    >
      {children}
    </ChatSessionsContext.Provider>
  );
}

export function useChatSessions() {
  const context = useContext(ChatSessionsContext);
  if (!context) {
    throw new Error("useChatSessions must be used within a ChatSessionsProvider");
  }
  return context;
}
