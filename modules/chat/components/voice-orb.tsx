import { cn } from "@/lib/utils";

export type VoiceOrbStatus = "listening" | "thinking" | "speaking" | "muted" | "unsupported";

interface VoiceOrbProps {
  status: VoiceOrbStatus;
}

const statusDurations: Record<VoiceOrbStatus, string> = {
  listening: "2.2s",
  thinking: "1s",
  speaking: "1.3s",
  muted: "3s",
  unsupported: "3s",
};

export function VoiceOrb({ status }: VoiceOrbProps) {
  const isDimmed = status === "muted" || status === "unsupported";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-colors",
          isDimmed ? "bg-foreground/10" : "bg-foreground/20"
        )}
      />
      <div
        className={cn(
          "animate-orb-pulse relative h-28 w-28 rounded-full border border-border transition-opacity",
          isDimmed ? "opacity-40" : "opacity-100"
        )}
        style={{
          backgroundImage: "radial-gradient(circle, var(--foreground) 1.5px, transparent 1.5px)",
          backgroundSize: "9px 9px",
          animationDuration: statusDurations[status],
        }}
      />
    </div>
  );
}
