import type { ReactNode } from "react";
import { Sidebar } from "@/modules/sidebar/components/sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-1">
      <Sidebar />
      <main className="flex h-full min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
