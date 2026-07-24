import type { ReactNode } from "react";
import { Sidebar } from "@/modules/sidebar/components/sidebar";
import { SidebarProvider } from "@/modules/sidebar/sidebar-context";
import { ChatSessionsProvider } from "@/modules/chat/chat-sessions-context";
import { ChatModeProvider } from "@/modules/chat/chat-mode-context";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ChatModeProvider>
      <ChatSessionsProvider>
        <SidebarProvider>
          <div className="mx-auto flex h-full w-full min-h-0 max-w-[1600px] flex-1 bg-sidebar">
            <Sidebar />
            <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-background md:my-2 md:overflow-hidden md:rounded-l-xl">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ChatSessionsProvider>
    </ChatModeProvider>
  );
}
