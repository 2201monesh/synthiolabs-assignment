import { SparkleIcon } from "@/components/ui/icons";

export function Logo() {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
        <SparkleIcon className="h-4 w-4" />
      </span>
      <span className="truncate text-sm font-semibold text-sidebar-foreground">
        AI Assistant
      </span>
    </div>
  );
}
