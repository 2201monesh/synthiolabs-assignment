import { IconButton } from "@/components/ui/icon-button";
import { MoreHorizontalIcon } from "@/components/ui/icons";
import { MobileMenuButton } from "@/modules/chat/components/mobile-menu-button";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-3 md:px-4">
      <MobileMenuButton />
      <span className="flex-1 truncate text-sm font-medium text-foreground">{title}</span>
      <IconButton label="Conversation options">
        <MoreHorizontalIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
