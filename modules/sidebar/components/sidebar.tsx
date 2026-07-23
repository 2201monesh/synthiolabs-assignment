"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "@/modules/sidebar/components/sidebar-header";
import { SidebarTabs } from "@/modules/sidebar/components/sidebar-tabs";
import { ChatHistoryList } from "@/modules/sidebar/components/chat-history-list";
import { SidebarFooter } from "@/modules/sidebar/components/sidebar-footer";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-17" : "w-64"
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <SidebarTabs collapsed={collapsed} />
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2">
        <ChatHistoryList collapsed={collapsed} />
      </div>
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
