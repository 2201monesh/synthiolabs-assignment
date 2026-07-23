import { IconButton } from "@/components/ui/icon-button";
import { MoreHorizontalIcon } from "@/components/ui/icons";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <span className="truncate text-sm font-medium text-foreground">{title}</span>
      <IconButton label="Conversation options">
        <MoreHorizontalIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
