"use client";

import { useState } from "react";
import { PromptBox } from "@/modules/chat/components/prompt-box";
import { MobilePromptBar } from "@/modules/chat/components/mobile-prompt-bar";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <>
      <div className="hidden bg-background px-4 py-4 md:block">
        <div className="mx-auto w-full max-w-3xl">
          <PromptBox
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            variant="dock"
            placeholder="Reply to your AI assistant..."
            disabled={disabled}
          />
          <p className="mt-2 text-center text-xs text-muted">
            AI Assistant can make mistakes. Please double-check responses.
          </p>
        </div>
      </div>
      <MobilePromptBar onSend={onSend} disabled={disabled} />
    </>
  );
}
