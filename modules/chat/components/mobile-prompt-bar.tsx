"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { SendIcon } from "@/components/ui/icons";
import { VoiceInputButton } from "@/modules/chat/components/voice-input-button";

interface MobilePromptBarProps {
  onSend: (content: string) => void;
}

export function MobilePromptBar({ onSend }: MobilePromptBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-3 md:hidden">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message AI Assistant..."
        className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <VoiceInputButton />
      <IconButton
        type="button"
        label="Send message"
        disabled={!value.trim()}
        onClick={handleSubmit}
        className={value.trim() ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
      >
        <SendIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
