"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { MicIcon } from "@/components/ui/icons";

interface VoiceInputButtonProps {
  className?: string;
}

export function VoiceInputButton({ className }: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <IconButton
      type="button"
      label={isRecording ? "Stop voice input" : "Start voice input"}
      onClick={() => setIsRecording((value) => !value)}
      className={cn("cursor-pointer", className)}
    >
      <MicIcon className="h-4 w-4" />
    </IconButton>
  );
}
