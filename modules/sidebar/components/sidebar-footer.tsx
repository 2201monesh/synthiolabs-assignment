import { NewChatButton } from "@/modules/sidebar/components/new-chat-button";
import { SparkleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  collapsed?: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className={cn("flex items-center gap-2 px-2 py-3", collapsed && "flex-col")}>
      <NewChatButton />
      {!collapsed && (
        <button className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5">
          <SparkleIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="flex-1 truncate">Ask AI Assistant</span>
          <kbd className="shrink-0 rounded-xl border border-border px-1.5 py-0.5 text-[10px] text-muted">
            ⌘ /
          </kbd>
        </button>
      )}
    </div>
  );
}
