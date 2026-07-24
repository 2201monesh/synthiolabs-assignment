"use client";

import { useState } from "react";

export function usePromptValue() {
  const [value, setValueState] = useState("");
  const [isVoiceOrigin, setIsVoiceOrigin] = useState(false);

  function setValue(next: string) {
    setIsVoiceOrigin(false);
    setValueState(next);
  }

  function setVoiceTranscript(next: string) {
    setIsVoiceOrigin(true);
    setValueState(next);
  }

  function reset() {
    setValueState("");
    setIsVoiceOrigin(false);
  }

  return { value, setValue, setVoiceTranscript, isVoiceOrigin, reset };
}
