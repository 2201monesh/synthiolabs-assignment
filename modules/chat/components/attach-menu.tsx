"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { PlusIcon } from "@/components/ui/icons";

interface AttachMenuProps {
  className?: string;
}

const DEMO_OPTIONS = ["Demo option 1", "Demo option 2", "Demo option 3"];

export function AttachMenu({ className }: AttachMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <IconButton
        type="button"
        label="Attach file"
        onClick={() => setIsOpen((value) => !value)}
        className={className}
      >
        <PlusIcon className="h-4 w-4" />
      </IconButton>
      {isOpen && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-48 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-elevation-1">
          {DEMO_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setIsOpen(false)}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
