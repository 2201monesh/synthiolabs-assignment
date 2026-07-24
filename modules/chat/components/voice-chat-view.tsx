"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { MicIcon, MicOffIcon, XIcon } from "@/components/ui/icons";
import { MobileMenuButton } from "@/modules/chat/components/mobile-menu-button";
import { VoiceOrb, type VoiceOrbStatus } from "@/modules/chat/components/voice-orb";
import { useChatSessions } from "@/modules/chat/chat-sessions-context";
import { useChatMode } from "@/modules/chat/chat-mode-context";

const statusLabels: Record<VoiceOrbStatus, string> = {
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  muted: "Mic muted",
  unsupported: "Voice input isn't supported in this browser",
};

export function VoiceChatView() {
  const { activeMessages, isStreaming, sendMessage } = useChatSessions();
  const { setMode } = useChatMode();

  const [isSupported, setIsSupported] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [turnPending, setTurnPending] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isActiveRef = useRef(true);
  const micCheckedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const isStreamingRef = useRef(isStreaming);
  const turnPendingRef = useRef(turnPending);
  const sendMessageRef = useRef(sendMessage);

  isMutedRef.current = isMuted;
  isStreamingRef.current = isStreaming;
  turnPendingRef.current = turnPending;
  sendMessageRef.current = sendMessage;

  const status: VoiceOrbStatus = !isSupported
    ? "unsupported"
    : isStreaming
      ? "thinking"
      : turnPending
        ? "speaking"
        : isMuted
          ? "muted"
          : "listening";

  function shouldBeListening() {
    return (
      isActiveRef.current &&
      micCheckedRef.current &&
      !isMutedRef.current &&
      !isStreamingRef.current &&
      !turnPendingRef.current
    );
  }

  function submitTranscript(text: string) {
    setInterimTranscript("");
    setErrorMessage(null);
    setTurnPending(true);
    // Read via ref, not the closed-over `sendMessage`: this handler is wired up once on
    // mount, so calling the destructured `sendMessage` directly would freeze onto the
    // very first render's session state and never see later turns/sessions.
    sendMessageRef.current(text, true, () => {
      setTurnPending(false);
    });
  }

  useEffect(() => {
    let cancelled = false;
    isActiveRef.current = true;
    micCheckedRef.current = false;

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) setInterimTranscript(interim);
      if (finalTranscript.trim()) {
        submitTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      setInterimTranscript("");

      if (event.error === "no-speech" || event.error === "aborted") {
        // Benign: silence timeout or an intentional stop/restart. The onend
        // handler below already takes care of resuming listening.
        return;
      }

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setErrorMessage(
          "Microphone access is blocked. Allow microphone permission for this site (check the icon in your browser's address bar) and try again."
        );
        isActiveRef.current = false;
        return;
      }

      setErrorMessage("Something went wrong with the microphone. Please try again.");
    };

    recognition.onend = () => {
      if (shouldBeListening()) {
        setTimeout(() => {
          if (shouldBeListening()) {
            try {
              recognition.start();
            } catch {
              // ignore: already running, the watcher effect below will retry
            }
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;

    async function requestMicAndStart() {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
        }
        if (cancelled) return;
        micCheckedRef.current = true;
        recognition.start();
      } catch {
        if (cancelled) return;
        micCheckedRef.current = true;
        setErrorMessage(
          "Microphone access is blocked. Allow microphone permission for this site and try again."
        );
      }
    }

    requestMicAndStart();

    return () => {
      cancelled = true;
      isActiveRef.current = false;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !micCheckedRef.current) return;

    if (shouldBeListening()) {
      try {
        recognition.start();
      } catch {
        // already listening
      }
    } else {
      try {
        recognition.stop();
      } catch {
        // already stopped
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, isStreaming, turnPending]);

  function handleEndSession() {
    isActiveRef.current = false;
    recognitionRef.current?.stop();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setMode("text");
  }

  const lastMessage = activeMessages[activeMessages.length - 1];
  const captionText =
    errorMessage || interimTranscript || lastMessage?.content || "Say something to get started.";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-2 md:hidden">
        <MobileMenuButton />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <VoiceOrb status={errorMessage ? "unsupported" : status} />
          <p className="text-sm font-medium text-muted">
            {errorMessage ? "Microphone unavailable" : statusLabels[status]}
          </p>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-foreground">{captionText}</p>
      </div>
      <div className="flex items-center justify-center gap-6 pb-10">
        <div className="flex flex-col items-center gap-1.5">
          <IconButton
            label={isMuted ? "Unmute microphone" : "Mute microphone"}
            disabled={!isSupported}
            onClick={() => setIsMuted((value) => !value)}
            className={cn(
              "h-12 w-12 border border-border",
              isMuted && "bg-black/5 dark:bg-white/5"
            )}
          >
            {isMuted ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
          </IconButton>
          <span className="text-xs text-muted">{isMuted ? "Unmute" : "Mute"}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <IconButton
            label="End session"
            onClick={handleEndSession}
            className="h-12 w-12 border border-border"
          >
            <XIcon className="h-5 w-5" />
          </IconButton>
          <span className="text-xs text-muted">End</span>
        </div>
      </div>
    </div>
  );
}
