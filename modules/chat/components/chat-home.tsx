"use client";

import { PromptBox } from "@/modules/chat/components/prompt-box";
import { MobileMenuButton } from "@/modules/chat/components/mobile-menu-button";
import { MobilePromptBar } from "@/modules/chat/components/mobile-prompt-bar";
import { usePromptValue } from "@/modules/chat/use-prompt-value";

interface ChatHomeProps {
  onSend: (content: string, viaVoice?: boolean) => void;
}

export function ChatHome({ onSend }: ChatHomeProps) {
  const { value, setValue, setVoiceTranscript, isVoiceOrigin, reset } = usePromptValue();

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed, isVoiceOrigin);
    reset();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-2 md:hidden">
        <MobileMenuButton />
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 md:py-10">
        <div className="w-full max-w-2xl">
          <h1 className="mb-6 text-center text-3xl font-medium tracking-tight text-foreground">
            How can I help you today?
          </h1>
          <div className="hidden md:block">
            <PromptBox
              value={value}
              onChange={setValue}
              onVoiceTranscript={setVoiceTranscript}
              onSubmit={handleSubmit}
              variant="hero"
              placeholder="How can I help you today?"
              autoFocus
            />
          </div>
        </div>
      </div>
      <MobilePromptBar onSend={onSend} />
    </div>
  );
}
