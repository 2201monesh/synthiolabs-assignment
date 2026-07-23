"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { PlusIcon, SendIcon } from "@/components/ui/icons";
import { VoiceInputButton } from "@/modules/chat/components/voice-input-button";

const connectedApps = [
  { name: "Notion", src: "/notion.png", className: "brightness-0" },
  { name: "Greptile", src: "/greptile-color.png" },
  { name: "Perplexity", src: "/perplexity-color.png" },
  { name: "Slack", src: "/slack.png" },
];

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  variant?: "hero" | "dock";
  placeholder?: string;
  autoFocus?: boolean;
}

export function PromptBox({
  value,
  onChange,
  onSubmit,
  variant = "dock",
  placeholder,
  autoFocus,
}: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="relative pb-2">
      <div
        aria-hidden
        className="absolute inset-x-0 top-full z-0 flex -translate-y-6 items-center justify-between gap-3 rounded-b-xl border border-border bg-sidebar px-4 pb-3 pt-8 text-xs text-muted"
      >
        <span className="truncate">Get better answers from your apps</span>
        <span className="flex shrink-0 items-center gap-4">
          {connectedApps.map((app) => (
            <Image
              key={app.name}
              src={app.src}
              alt={app.name}
              width={16}
              height={16}
              className={cn("h-4 w-4 object-contain", app.className)}
            />
          ))}
        </span>
      </div>
      <div
        className={cn(
          "relative z-10 flex w-full flex-col gap-2 rounded-xl border border-border bg-card shadow-elevation-1 transition-colors focus-within:border-accent",
          variant === "hero" ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={variant === "hero" ? 2 : 1}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={cn(
            "max-h-52 w-full resize-none overflow-y-auto bg-transparent text-foreground placeholder:text-muted focus:outline-none",
            variant === "hero" ? "text-base" : "text-sm"
          )}
        />
        <div className="flex items-center justify-between">
          <IconButton type="button" label="Attach file" className="border border-border">
            <PlusIcon className="h-4 w-4" />
          </IconButton>
          <div className="flex items-center gap-2">
            <VoiceInputButton />
            <IconButton
              type="button"
              label="Send message"
              disabled={!value.trim()}
              onClick={onSubmit}
              className={value.trim() ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
            >
              <SendIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
