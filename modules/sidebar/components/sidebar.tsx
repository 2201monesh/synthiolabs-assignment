"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/modules/sidebar/sidebar-context";
import { SidebarHeader } from "@/modules/sidebar/components/sidebar-header";
import { NewChatRow } from "@/modules/sidebar/components/new-chat-row";
import { ChatHistoryList } from "@/modules/sidebar/components/chat-history-list";
import { SidebarFooter } from "@/modules/sidebar/components/sidebar-footer";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { mobileOpen, closeMobileSidebar } = useSidebarContext();

  useEffect(() => {
    if (mobileOpen) setCollapsed(false);
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 -translate-x-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 md:static md:translate-x-0",
          mobileOpen && "translate-x-0",
          collapsed ? "md:w-17" : "md:w-64"
        )}
      >
        <SidebarHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onCloseMobile={closeMobileSidebar}
        />
        <NewChatRow collapsed={collapsed} />
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2">
          <ChatHistoryList collapsed={collapsed} />
        </div>
        <SidebarFooter collapsed={collapsed} />
      </aside>
    </>
  );
}
