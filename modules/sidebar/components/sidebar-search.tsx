import { IconButton } from "@/components/ui/icon-button";
import { SearchIcon } from "@/components/ui/icons";

interface SidebarSearchProps {
  collapsed?: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onExpandClick?: () => void;
}

export function SidebarSearch({
  collapsed,
  query,
  onQueryChange,
  onExpandClick,
}: SidebarSearchProps) {
  if (collapsed) {
    return (
      <div className="flex justify-center px-2">
        <IconButton label="Search chats" onClick={onExpandClick}>
          <SearchIcon className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="flex w-full items-center gap-2 rounded-xl bg-black/5 px-3 py-2 dark:bg-white/5">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search chats..."
          className="w-full bg-transparent text-sm text-sidebar-foreground placeholder:text-muted focus:outline-none"
        />
      </div>
    </div>
  );
}
