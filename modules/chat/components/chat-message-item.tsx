"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";
import type { ChatMessage } from "@/lib/types";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-xl bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <p className="max-w-[85%] text-sm leading-relaxed text-foreground">
        {message.content}
      </p>
      <button
        onClick={handleCopy}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
        )}
        aria-label="Copy response"
        title="Copy response"
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
