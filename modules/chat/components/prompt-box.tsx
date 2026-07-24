"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, UIEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { SendIcon } from "@/components/ui/icons";
import { AttachMenu } from "@/modules/chat/components/attach-menu";
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
  disabled?: boolean;
}

export function PromptBox({
  value,
  onChange,
  onSubmit,
  variant = "dock",
  placeholder,
  autoFocus,
  disabled,
}: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  function updateScrollFade(textarea: HTMLTextAreaElement) {
    const { scrollTop, scrollHeight, clientHeight } = textarea;
    setCanScrollUp(scrollTop > 1);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    updateScrollFade(textarea);
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  function handleScroll(event: UIEvent<HTMLTextAreaElement>) {
    updateScrollFade(event.currentTarget);
  }

  return (
    <div className={cn("relative", variant === "hero" && "pb-2")}>
      {variant === "hero" && (
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
      )}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col gap-2 rounded-xl border border-border bg-card shadow-elevation-1 transition-colors focus-within:border-foreground/30",
          variant === "hero" ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <div className="relative">
          {canScrollUp && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6"
              style={{ background: "linear-gradient(to bottom, var(--card), transparent)" }}
            />
          )}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            rows={variant === "hero" ? 2 : 1}
            autoFocus={autoFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "scrollbar-hide max-h-52 w-full resize-none overflow-y-auto bg-transparent text-foreground placeholder:text-muted focus:outline-none",
              variant === "hero" ? "text-base" : "text-sm"
            )}
          />
          {canScrollDown && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6"
              style={{ background: "linear-gradient(to top, var(--card), transparent)" }}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <AttachMenu className="h-8 w-8 border border-border cursor-pointer" />
          <div className="flex items-center gap-1">
            <VoiceInputButton className="h-8 w-8" />
            <IconButton
              type="button"
              label="Send message"
              disabled={disabled || !value.trim()}
              onClick={onSubmit}
              className="h-8 w-8 cursor-pointer"
            >
              <SendIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
