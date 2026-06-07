interface MiniSpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Inline neon-arc spinner for use inside buttons.
 * Smaller, no text, no background — fits a button slot.
 */
export default function MiniSpinner({ size = 16, className }: MiniSpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.5))" }}
    >
      <defs>
        <linearGradient id="mini-arc-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="30%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mini-arc-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
          <stop offset="30%" stopColor="#ec4899" stopOpacity="1" />
          <stop offset="70%" stopColor="#ec4899" stopOpacity="1" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mini-arc-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="30%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer cyan — clockwise */}
      <g style={{ transformOrigin: "32px 32px", animation: "mini-spin-cw 1.6s linear infinite" }}>
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke="url(#mini-arc-cyan)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Middle pink — counter-clockwise */}
      <g style={{ transformOrigin: "32px 32px", animation: "mini-spin-ccw 2s linear infinite" }}>
        <path
          d="M 14 32 A 18 18 0 0 1 50 32"
          fill="none"
          stroke="url(#mini-arc-pink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Inner purple — clockwise */}
      <g style={{ transformOrigin: "32px 32px", animation: "mini-spin-cw 1.2s linear infinite" }}>
        <path
          d="M 20 32 A 12 12 0 0 1 44 32"
          fill="none"
          stroke="url(#mini-arc-purple)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <style>{`
        @keyframes mini-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mini-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}
