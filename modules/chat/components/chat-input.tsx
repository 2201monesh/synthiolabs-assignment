"use client";

import { useState } from "react";
import { PromptBox } from "@/modules/chat/components/prompt-box";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="bg-background px-4 py-4">
      <div className="mx-auto w-full max-w-3xl">
        <PromptBox
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          variant="dock"
          placeholder="Reply to your AI assistant..."
        />
        <p className="mt-2 text-center text-xs text-muted">
          AI Assistant can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
