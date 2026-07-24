"use client";

import { ChatView } from "@/modules/chat/components/chat-view";
import { VoiceChatView } from "@/modules/chat/components/voice-chat-view";
import { useChatMode } from "@/modules/chat/chat-mode-context";

export default function HomePage() {
  const { mode } = useChatMode();
  return mode === "voice" ? <VoiceChatView /> : <ChatView />;
}
