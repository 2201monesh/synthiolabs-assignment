"use client";

import { cn } from "@/lib/utils";
import { PencilSquareIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { useChatSessions } from "@/modules/chat/chat-sessions-context";
import { useSidebarContext } from "@/modules/sidebar/sidebar-context";

interface NewChatRowProps {
  collapsed?: boolean;
}

export function NewChatRow({ collapsed }: NewChatRowProps) {
  const { startNewChat } = useChatSessions();
  const { closeMobileSidebar } = useSidebarContext();

  function handleClick() {
    startNewChat();
    closeMobileSidebar();
  }

  if (collapsed) {
    return (
      <div className="flex justify-center px-2">
        <IconButton label="New chat" onClick={handleClick}>
          <PencilSquareIcon className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="px-2">
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        )}
      >
        <PencilSquareIcon className="h-4 w-4 shrink-0" />
        New chat
      </button>
    </div>
  );
}
