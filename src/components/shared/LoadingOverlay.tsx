interface LoadingOverlayProps {
  message?: string;
  /** Visual variant */
  variant?: "neon-arcs" | "cyber-orb" | "aurora-wave" | "sparkle-stars" | "ai-brain-chip";
  /** "absolute" (default) overlays a parent container; "fullscreen" covers the viewport */
  mode?: "absolute" | "fullscreen";
}

// ─────────────────────────────────────────────
// 1. Neon Arcs — các cung tròn neon xoay đảo chiều + glow halo
// ─────────────────────────────────────────────
function NeonArcs() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* Background glow halo */}
      <div
        className="absolute -inset-2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(232,121,249,0.25) 50%, rgba(168,85,247,0.25) 100%)",
          animation: "arc-halo 2s ease-in-out infinite",
        }}
      />

      {/* SVG with rotating arcs */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="relative"
        style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.5))" }}
      >
        <defs>
          {/* Cyan arc gradient (outer, spins clockwise) */}
          <linearGradient id="arc-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="30%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="70%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          {/* Pink arc gradient (middle, spins counter-clockwise) */}
          <linearGradient id="arc-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="30%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          {/* Purple arc gradient (inner, spins clockwise) */}
          <linearGradient id="arc-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Top half arcs (the "rainbow" on top) */}
        {/* Outer cyan — clockwise */}
        <g style={{ transformOrigin: "32px 32px", animation: "arc-spin-cw 1.6s linear infinite" }}>
          <path
            d="M 8 32 A 24 24 0 0 1 56 32"
            fill="none"
            stroke="url(#arc-cyan)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Middle pink — counter-clockwise */}
        <g style={{ transformOrigin: "32px 32px", animation: "arc-spin-ccw 2s linear infinite" }}>
          <path
            d="M 14 32 A 18 18 0 0 1 50 32"
            fill="none"
            stroke="url(#arc-pink)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Inner purple — clockwise */}
        <g style={{ transformOrigin: "32px 32px", animation: "arc-spin-cw 1.2s linear infinite" }}>
          <path
            d="M 20 32 A 12 12 0 0 1 44 32"
            fill="none"
            stroke="url(#arc-purple)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Glowing core */}
        <circle cx="32" cy="32" r="2" fill="white" opacity="0.9">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;2.5;1.5" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <style>{`
        @keyframes arc-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arc-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes arc-halo {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. Cyber Orb — gradient ring xoay + lõi phát sáng
// ─────────────────────────────────────────────
function CyberOrb() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <div
        className="absolute inset-0 animate-spin rounded-full opacity-60 cyber-orb-ring"
        style={{ animationDuration: "1.5s" }}
      />
      <div className="absolute inset-1 rounded-full bg-black/80 backdrop-blur-sm" />
      <div className="absolute inset-1 animate-pulse rounded-full bg-white/10" />
      <div
        className="relative h-5 w-5 rounded-full bg-gradient-to-br from-electric-blue to-cyber-purple shadow-lg shadow-cyber-purple/50"
        style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}
      />
      <style>{`
        .cyber-orb-ring {
          background: conic-gradient(from 0deg, #6366f1, #ec4899, #8b5cf6, #6366f1);
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(139,92,246,0.3); }
          50% { transform: scale(1.15); box-shadow: 0 0 40px rgba(139,92,246,0.6); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. Aurora Wave — sóng gradient chạy ngang
// ─────────────────────────────────────────────
function AuroraWave() {
  return (
    <div className="flex h-14 items-end gap-1">
      {[0.1, 0.2, 0.3, 0.5, 0.7, 0.5, 0.3, 0.2, 0.1].map((scale, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-electric-blue via-neon-pink to-cyber-purple"
          style={{
            height: "100%",
            animation: "aurora-wave 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.08}s`,
            transform: `scaleY(${scale})`,
          }}
        />
      ))}
      <style>{`
        @keyframes aurora-wave {
          0%, 100% { opacity: 0.4; filter: blur(1px); }
          50% { opacity: 1; filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. Sparkle Stars — 3 ngôi sao 4 cánh lấp lánh
// ─────────────────────────────────────────────
function SparkleStars() {
  const stars = [
    { from: "#22d3ee", to: "#6366f1", glow: "rgba(34,211,238,0.9)" },
    { from: "#d946ef", to: "#e11d48", glow: "rgba(232,121,249,0.9)" },
    { from: "#fbbf24", to: "#f97316", glow: "rgba(251,191,36,0.9)" },
  ];

  return (
    <div className="relative flex items-center gap-3">
      <div
        className="absolute -inset-6 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(232,121,249,0.25) 50%, rgba(251,191,36,0.25) 100%)",
          animation: "sparkle-bg 2.5s ease-in-out infinite",
        }}
      />
      {stars.map((star, i) => (
        <div
          key={i}
          className="relative flex items-center justify-center"
          style={{
            animation: `star-float 2.5s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <div
            className="absolute -inset-2 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${star.glow} 0%, transparent 70%)`,
              animation: `star-glow-pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            style={{
              animation: `star-twinkle 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <defs>
              <linearGradient id={`star-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={star.from} />
                <stop offset="100%" stopColor={star.to} />
              </linearGradient>
            </defs>
            <path
              d="M16 2 Q16 12 16 16 Q16 12 16 30 Q16 16 16 16 Q16 12 16 2"
              fill={`url(#star-grad-${i})`}
              stroke="white"
              strokeWidth="0.4"
              strokeOpacity="0.2"
            />
            <path
              d="M2 16 Q12 16 16 16 Q12 16 30 16 Q16 16 16 16 Q12 16 2 16"
              fill={`url(#star-grad-${i})`}
              stroke="white"
              strokeWidth="0.4"
              strokeOpacity="0.2"
            />
            <circle cx="16" cy="16" r="2" fill="white" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
              <animate
                attributeName="r"
                values="1.5;2.5;1.5"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </circle>
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.2; filter: blur(1.5px); }
          50% { transform: scale(1.25) rotate(45deg); opacity: 1; filter: blur(0); }
        }
        @keyframes star-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes star-glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(2); opacity: 0.7; }
        }
        @keyframes sparkle-bg {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(2); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. AI Brain Chip — chip AI với sóng lan tỏa
// ─────────────────────────────────────────────
function AiBrainChip() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full border border-electric-blue/30"
        style={{ animation: "chip-ripple 2s ease-out infinite" }}
      />
      <div
        className="absolute inset-2 rounded-full border border-neon-pink/20"
        style={{ animation: "chip-ripple 2s ease-out 0.4s infinite" }}
      />
      <div
        className="absolute inset-4 rounded-full border border-cyber-purple/10"
        style={{ animation: "chip-ripple 2s ease-out 0.8s infinite" }}
      />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900">
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-electric-blue/20 via-transparent to-cyber-purple/20"
          style={{ animation: "chip-core 2s ease-in-out infinite" }}
        />
        <svg
          className="relative h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.6" />
          <path d="M2 17l10 5 10-5" opacity="0.4" />
          <path d="M2 12l10 5 10-5" opacity="0.5" />
        </svg>
      </div>
      <style>{`
        @keyframes chip-ripple {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes chip-core {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// Loading Overlay — switch variants here
// ─────────────────────────────────────────────
const LOADERS: Record<string, () => React.JSX.Element> = {
  "neon-arcs": NeonArcs,
  "cyber-orb": CyberOrb,
  "aurora-wave": AuroraWave,
  "sparkle-stars": SparkleStars,
  "ai-brain-chip": AiBrainChip,
};

export default function LoadingOverlay({
  message = "Loading...",
  variant = "neon-arcs",
  mode = "absolute",
}: LoadingOverlayProps) {
  const Loader = LOADERS[variant] ?? NeonArcs;

  return (
    <div
      className={
        mode === "fullscreen"
          ? "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm"
          : "absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-2xl bg-black/60 backdrop-blur-sm"
      }
    >
      <Loader />
      <p className="text-sm font-medium tracking-wide text-zinc-300">
        {message}
      </p>
    </div>
  );
}
