"use client";

import type { KeyboardEvent } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { SendIcon } from "@/components/ui/icons";
import { VoiceInputButton } from "@/modules/chat/components/voice-input-button";
import { usePromptValue } from "@/modules/chat/use-prompt-value";

interface MobilePromptBarProps {
  onSend: (content: string, viaVoice?: boolean) => void;
  disabled?: boolean;
}

export function MobilePromptBar({ onSend, disabled }: MobilePromptBarProps) {
  const { value, setValue, setVoiceTranscript, isVoiceOrigin, reset } = usePromptValue();

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, isVoiceOrigin);
    reset();
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
        disabled={disabled}
        placeholder="Message AI Assistant..."
        className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none"
      />
      <VoiceInputButton onTranscript={setVoiceTranscript} />
      <IconButton
        type="button"
        label="Send message"
        disabled={disabled || !value.trim()}
        onClick={handleSubmit}
      >
        <SendIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
