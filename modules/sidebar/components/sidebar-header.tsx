import { Logo } from "@/components/ui/logo";
import { IconButton } from "@/components/ui/icon-button";
import { HelpCircleIcon, PanelLeftIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-4",
        collapsed ? "flex-col justify-center" : "justify-between"
      )}
    >
      <Logo collapsed={collapsed} />
      {!collapsed && (
        <div className="flex items-center gap-1">
          <IconButton label="Help">
            <HelpCircleIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="Collapse sidebar" onClick={onToggle}>
            <PanelLeftIcon className="h-5 w-5" />
          </IconButton>
        </div>
      )}
      {collapsed && (
        <IconButton label="Expand sidebar" onClick={onToggle}>
          <PanelLeftIcon className="h-5 w-5" />
        </IconButton>
      )}
    </div>
  );
}
