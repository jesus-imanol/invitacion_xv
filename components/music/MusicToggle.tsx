"use client";

import { motion } from "framer-motion";
import { useMusic } from "@/components/music/MusicProvider";

/** Botón flotante de música (play/pause), siempre visible. */
export default function MusicToggle() {
  const { hasMusic, playing, toggle } = useMusic();
  if (!hasMusic) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      aria-pressed={playing}
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 40,
        width: 48,
        height: 48,
        borderRadius: "9999px",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        color: "var(--ice)",
        background:
          "linear-gradient(160deg, rgba(21,10,82,0.85), rgba(14,8,48,0.85))",
        border: "1px solid rgba(159,192,238,0.35)",
        boxShadow: "0 8px 24px -8px rgba(7,4,20,0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      {playing ? (
        // Barras animadas (equalizer)
        <span style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 18 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              }}
              style={{
                display: "block",
                width: 3,
                height: 18,
                transformOrigin: "bottom",
                borderRadius: 2,
                background: "var(--sky)",
              }}
            />
          ))}
        </span>
      ) : (
        // Icono play
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
