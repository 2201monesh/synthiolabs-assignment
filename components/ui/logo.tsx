import { SparkleIcon } from "@/components/ui/icons";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed }: LogoProps) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
        <SparkleIcon className="h-4 w-4" />
      </span>
      {!collapsed && (
        <span className="truncate text-sm font-semibold text-sidebar-foreground">
          AI Assistant
        </span>
      )}
    </div>
  );
}
