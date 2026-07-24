"use client";

import { IconButton } from "@/components/ui/icon-button";
import { PlusIcon } from "@/components/ui/icons";
import { useChatSessions } from "@/modules/chat/chat-sessions-context";
import { useSidebarContext } from "@/modules/sidebar/sidebar-context";

export function NewChatButton() {
  const { startNewChat } = useChatSessions();
  const { closeMobileSidebar } = useSidebarContext();

  function handleClick() {
    startNewChat();
    closeMobileSidebar();
  }

  return (
    <IconButton label="New chat" onClick={handleClick} className="border border-border bg-card">
      <PlusIcon className="h-4 w-4" />
    </IconButton>
  );
}
