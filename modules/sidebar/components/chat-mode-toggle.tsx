"use client";

import { cn } from "@/lib/utils";
import { ChatBubbleIcon, MicIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { useChatMode } from "@/modules/chat/chat-mode-context";

interface ChatModeToggleProps {
  collapsed?: boolean;
}

export function ChatModeToggle({ collapsed }: ChatModeToggleProps) {
  const { mode, setMode } = useChatMode();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 px-2">
        <IconButton
          label="Text chat"
          onClick={() => setMode("text")}
          className={cn(mode === "text" && "bg-black/5 dark:bg-white/5")}
        >
          <ChatBubbleIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Voice chat"
          onClick={() => setMode("voice")}
          className={cn(mode === "voice" && "bg-black/5 dark:bg-white/5")}
        >
          <MicIcon className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="flex items-center gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/5">
        <button
          onClick={() => setMode("text")}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "text"
              ? "bg-card text-foreground shadow-elevation-1"
              : "text-muted hover:text-foreground"
          )}
        >
          <ChatBubbleIcon className="h-3.5 w-3.5" />
          Text chat
        </button>
        <button
          onClick={() => setMode("voice")}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "voice"
              ? "bg-card text-foreground shadow-elevation-1"
              : "text-muted hover:text-foreground"
          )}
        >
          <MicIcon className="h-3.5 w-3.5" />
          Voice chat
        </button>
      </div>
    </div>
  );
}
