import { IconButton } from "@/components/ui/icon-button";
import { ChatBubbleIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SidebarTabsProps {
  collapsed?: boolean;
}

export function SidebarTabs({ collapsed }: SidebarTabsProps) {
  return (
    <div className={cn("flex items-center gap-1 px-2", collapsed && "flex-col")}>
      <button
        className={cn(
          "flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 text-sm font-medium text-sidebar-foreground dark:bg-white/5",
          collapsed ? "justify-center px-0" : "flex-1"
        )}
      >
        <ChatBubbleIcon className="h-4 w-4 shrink-0" />
        {!collapsed && "Chat"}
      </button>
      <IconButton label="Search chats">
        <SearchIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
