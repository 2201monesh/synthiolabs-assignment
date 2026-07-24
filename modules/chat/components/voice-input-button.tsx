"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { MicIcon } from "@/components/ui/icons";

export function VoiceInputButton() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <IconButton
      type="button"
      label={isRecording ? "Stop voice input" : "Start voice input"}
      onClick={() => setIsRecording((value) => !value)}
      className="cursor-pointer"
    >
      <MicIcon className="h-4 w-4" />
    </IconButton>
  );
}
