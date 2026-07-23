import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export function IconButton({
  label,
  active,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-black/5 dark:hover:bg-white/5",
        active && "bg-accent text-accent-foreground hover:bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
