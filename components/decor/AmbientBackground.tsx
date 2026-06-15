import type { CSSProperties } from "react";

/**
 * Lienzo acuarela claro: blobs suaves (lavanda/rosa/cielo) + pétalos cayendo +
 * destellos champán. Fijo detrás del contenido.
 * - Solo anima transform/opacity. aria-hidden + pointer-events:none.
 * - Configuración DETERMINISTA por índice → sin desajuste de hidratación.
 * - Partículas con .decor-motion → ocultas bajo reduced-motion.
 */

const PETAL_COLORS = ["var(--rosa)", "var(--lavender)", "var(--sky)"];

function rand(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Blossom({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden style={{ color }}>
      <g fill="currentColor" opacity="0.95">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="12" cy="6.5" rx="3" ry="5" transform={`rotate(${a} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.4" fill="var(--gold-soft)" opacity="0.9" />
    </svg>
  );
}

function Petal({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden style={{ color }}>
      <path d="M12 1C7 7 5 12 12 23C19 12 17 7 12 1Z" fill="currentColor" opacity="0.92" />
    </svg>
  );
}

const PETAL_COUNT = 20;
const STAR_COUNT = 26;

export default function AmbientBackground() {
  const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
    const size = 12 + rand(i, 1) * 18;
    const left = rand(i, 2) * 100;
    const duration = 18 + rand(i, 3) * 16;
    const delay = -rand(i, 4) * duration;
    const drift = (rand(i, 5) - 0.5) * 16;
    const spin = 120 + rand(i, 6) * 220;
    const opacity = 0.3 + rand(i, 7) * 0.35;
    const sway = 1 + rand(i, 8) * 2.5;
    const swayDur = 4 + rand(i, 9) * 4;
    const color = PETAL_COLORS[i % PETAL_COLORS.length];
    const isBlossom = i % 3 === 0;

    const wrapStyle: CSSProperties = {
      position: "absolute",
      top: 0,
      left: `${left}%`,
      width: size,
      height: size,
      ["--petal-drift" as string]: `${drift}vw`,
      ["--petal-spin" as string]: `${spin}deg`,
      ["--petal-opacity" as string]: opacity,
      animation: `petal-fall ${duration}s linear ${delay}s infinite`,
      willChange: "transform, opacity",
      filter: "drop-shadow(0 2px 4px rgba(210,104,164,0.18))",
    };
    const innerStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      ["--petal-sway" as string]: `${sway}vw`,
      animation: `petal-sway ${swayDur}s ease-in-out ${delay}s infinite`,
    };

    return (
      <div key={i} className="decor-motion" style={wrapStyle}>
        <div style={innerStyle}>
          {isBlossom ? <Blossom color={color} /> : <Petal color={color} />}
        </div>
      </div>
    );
  });

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const size = 2 + rand(i, 11) * 3;
    const left = rand(i, 12) * 100;
    const top = rand(i, 13) * 100;
    const dur = 2.5 + rand(i, 14) * 4;
    const delay = -rand(i, 15) * dur;
    const style: CSSProperties = {
      position: "absolute",
      left: `${left}%`,
      top: `${top}%`,
      width: size,
      height: size,
      borderRadius: "9999px",
      background: i % 3 === 0 ? "var(--rosa-soft)" : "var(--gold-soft)",
      boxShadow: "0 0 6px currentColor",
      animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
    };
    return <span key={i} className="decor-motion" style={style} />;
  });

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Washes acuarela (blobs suaves) */}
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          background:
            "radial-gradient(40% 35% at 18% 12%, rgba(195,184,238,0.55), transparent 70%)," +
            "radial-gradient(45% 40% at 85% 22%, rgba(244,206,225,0.5), transparent 70%)," +
            "radial-gradient(50% 45% at 75% 78%, rgba(169,196,240,0.45), transparent 72%)," +
            "radial-gradient(40% 40% at 22% 85%, rgba(231,212,166,0.35), transparent 72%)",
        }}
      />
      {/* Halo suave central que respira */}
      <div
        className="decor-motion"
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: "min(110vw, 820px)",
          height: "min(90vw, 620px)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(231,156,196,0.3) 0%, rgba(195,184,238,0.16) 40%, transparent 72%)",
          animation: "halo-breathe 9s ease-in-out infinite",
        }}
      />
      {stars}
      {petals}
    </div>
  );
}
