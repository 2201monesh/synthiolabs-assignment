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
          "absolute inset-0 rounded-full bg-blue-500/25 blur-2xl transition-opacity",
          isDimmed ? "opacity-40" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "animate-orb-pulse relative h-28 w-28 overflow-hidden rounded-full ring-1 ring-white/10 transition-opacity",
          isDimmed ? "opacity-40" : "opacity-100"
        )}
        style={{
          background: "radial-gradient(circle at 35% 30%, #1e3a8a, #0b1220 75%)",
          animationDuration: statusDurations[status],
        }}
      >
        <span
          className="animate-[blob-drift-1_7s_ease-in-out_infinite] absolute -left-6 -top-6 h-24 w-24 rounded-full mix-blend-screen blur-xl"
          style={{ background: "radial-gradient(circle, #7dd3fc, transparent 70%)" }}
        />
        <span
          className="animate-[blob-drift-2_9s_ease-in-out_infinite] absolute -bottom-8 -right-4 h-24 w-24 rounded-full mix-blend-screen blur-xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
        />
        <span
          className="animate-[blob-drift-3_6s_ease-in-out_infinite] absolute bottom-0 left-2 h-20 w-20 rounded-full mix-blend-screen blur-lg"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
      </div>
    </div>
  );
}
