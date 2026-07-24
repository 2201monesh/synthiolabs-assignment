"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ChatMode = "text" | "voice";

interface ChatModeContextValue {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
}

const ChatModeContext = createContext<ChatModeContextValue | null>(null);

export function ChatModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ChatMode>("text");

  return (
    <ChatModeContext.Provider value={{ mode, setMode }}>{children}</ChatModeContext.Provider>
  );
}

export function useChatMode() {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error("useChatMode must be used within a ChatModeProvider");
  }
  return context;
}
