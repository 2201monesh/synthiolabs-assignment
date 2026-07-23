"use client";

import { useState } from "react";
import { PromptBox } from "@/modules/chat/components/prompt-box";

interface ChatHomeProps {
  onSend: (content: string) => void;
}

export function ChatHome({ onSend }: ChatHomeProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-medium tracking-tight text-foreground">
          How can I help you today?
        </h1>
        <PromptBox
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          variant="hero"
          placeholder="How can I help you today?"
          autoFocus
        />
        {/* <p className="mt-4 text-center text-xs text-muted">
          AI Assistant can make mistakes. Please double-check responses.
        </p> */}
      </div>
    </div>
  );
}
