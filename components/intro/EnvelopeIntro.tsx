"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useCallback, useState } from "react";
import Tiara from "@/components/decor/Tiara";
import { useMusic } from "@/components/music/MusicProvider";
import { invitacion } from "@/data/invitacion";

type Phase = "sealed" | "opening" | "done";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const EASE_OVERSHOOT = [0.34, 1.56, 0.64, 1] as const;

/**
 * Intro del sobre con moño. Overlay encima del contenido real (el DOM debajo ya
 * existe → SEO/preview de WhatsApp ven la invitación; si el JS falla, igual carga).
 * El click es el gesto que arranca la música y revela el contenido.
 */
export default function EnvelopeIntro({ para }: { para?: string }) {
  const reduce = useReducedMotion();
  const { start } = useMusic();
  const [phase, setPhase] = useState<Phase>("sealed");

  const open = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("opening");

    // Gesto de audio: arranca la música (autoplay desbloqueado por el click).
    start();

    // Avisa al contenido que puede revelarse / hacer scroll.
    window.dispatchEvent(new Event("invitacion:open"));

    // Fin de la coreografía → desmonta el overlay y revela la portada.
    window.setTimeout(() => setPhase("done"), reduce ? 350 : 2200);
  }, [phase, reduce, start]);

  // Estado de animación: bajo reduced-motion las capas no se mueven (solo fade del overlay).
  const animState = reduce ? "sealed" : phase;

  const flapV: Variants = {
    sealed: { rotateX: 0 },
    opening: {
      rotateX: -178,
      transition: { duration: 0.6, delay: 0.4, ease: EASE_OVERSHOOT },
    },
  };
  const letterV: Variants = {
    sealed: { y: "8%", scale: 1, opacity: 1 },
    opening: {
      y: "-118%",
      scale: 1.06,
      transition: { duration: 0.75, delay: 0.95, ease: EASE_OUT },
    },
  };
  const bowGroupV: Variants = {
    sealed: { opacity: 1 },
    opening: {
      opacity: 0,
      transition: { duration: 0.4, ease: EASE_IN_OUT },
    },
  };
  const loopLeftV: Variants = {
    sealed: { scaleX: 1, x: 0, rotate: 0 },
    opening: { scaleX: 0.2, x: -10, rotate: -30, transition: { duration: 0.45, ease: EASE_IN_OUT } },
  };
  const loopRightV: Variants = {
    sealed: { scaleX: 1, x: 0, rotate: 0 },
    opening: { scaleX: 0.2, x: 10, rotate: 30, transition: { duration: 0.45, ease: EASE_IN_OUT } },
  };
  const knotV: Variants = {
    sealed: { scale: 1 },
    opening: { scale: 0, transition: { duration: 0.35, ease: EASE_IN_OUT } },
  };
  const tailsV: Variants = {
    sealed: { opacity: 1, y: 0 },
    opening: { opacity: 0, y: 10, transition: { duration: 0.4, ease: EASE_IN_OUT } },
  };

  const ENV_W = "min(82vw, 360px)";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(circle at 50% 40%, #faf6fd 0%, #efe9f9 60%, #e7dff4 100%)",
          }}
        >
          <button
            type="button"
            onClick={open}
            aria-label="Abrir invitación"
            disabled={phase !== "sealed"}
            style={{
              appearance: "none",
              background: "none",
              border: "none",
              cursor: phase === "sealed" ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(1.5rem, 6vw, 2.5rem)",
              padding: "1rem",
            }}
          >
            {/* Escenario 3D del sobre */}
            <motion.div
              animate={
                animState === "opening" && !reduce
                  ? { scale: 1.04, y: -8 }
                  : { scale: 1, y: 0 }
              }
              transition={{
                duration: 4,
                repeat: animState === "sealed" ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                position: "relative",
                width: ENV_W,
                aspectRatio: "1.5 / 1",
                perspective: 1400,
              }}
            >
              {/* Flotación leve idle */}
              <motion.div
                animate={animState === "sealed" ? { y: [-3, 3] } : { y: 0 }}
                transition={{
                  duration: 4,
                  repeat: animState === "sealed" ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Panel trasero */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 10,
                    background:
                      "linear-gradient(160deg, #efeafb 0%, #cfc4ee 100%)",
                    boxShadow:
                      "0 28px 70px -22px rgba(42,28,134,0.45), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(255,255,255,0.35)",
                    zIndex: 1,
                  }}
                />

                {/* Carta (sube del bolsillo) */}
                <motion.div
                  variants={letterV}
                  initial="sealed"
                  animate={animState}
                  style={{
                    position: "absolute",
                    left: "7%",
                    right: "7%",
                    top: "6%",
                    bottom: "6%",
                    borderRadius: 6,
                    background:
                      "linear-gradient(180deg, #fbfcff 0%, #eef2fb 100%)",
                    boxShadow: "0 8px 24px -8px rgba(7,4,20,0.5)",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "0.8rem",
                  }}
                >
                  <div style={{ width: 60 }}>
                    <Tiara id="tiara-letter" glow={false} />
                  </div>
                  <span
                    className="font-script"
                    style={{
                      color: "#1B0980",
                      fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                      lineHeight: 1,
                    }}
                  >
                    {invitacion.nombre}
                  </span>
                  <span
                    className="label"
                    style={{ color: "#8E96AC", fontSize: "0.6rem" }}
                  >
                    XV Años
                  </span>
                </motion.div>

                {/* Bolsillo frontal (chevron) — tapa la parte baja de la carta */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, #d6c9f0 0%, #b3a3e0 100%)",
                    clipPath:
                      "polygon(0 30%, 50% 56%, 100% 30%, 100% 100%, 0 100%)",
                    borderRadius: 10,
                    zIndex: 3,
                  }}
                />

                {/* Solapa superior (abre en 3D) */}
                <motion.div
                  variants={flapV}
                  initial="sealed"
                  animate={animState}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "58%",
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background:
                      "linear-gradient(180deg, #efeafb 0%, #d3c9ef 100%)",
                    borderRadius: "10px 10px 0 0",
                    zIndex: 4,
                    backfaceVisibility: "hidden",
                  }}
                />

                {/* Moño / listón (platino) */}
                <motion.div
                  variants={bowGroupV}
                  initial="sealed"
                  animate={animState}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                >
                  {/* Listón vertical */}
                  <div
                    style={{
                      position: "absolute",
                      left: "calc(50% - 7px)",
                      top: 0,
                      bottom: 0,
                      width: 14,
                      background:
                        "linear-gradient(90deg, #c6a667, #f6ebc8 50%, #c6a667)",
                      opacity: 0.95,
                    }}
                  />
                  {/* Listón horizontal */}
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(50% - 7px)",
                      left: 0,
                      right: 0,
                      height: 14,
                      background:
                        "linear-gradient(180deg, #c6a667, #f6ebc8 50%, #c6a667)",
                      opacity: 0.95,
                    }}
                  />
                  {/* Bow de satín al centro */}
                  <svg
                    viewBox="0 0 120 96"
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "50%",
                      transform: "translate(-50%, -52%)",
                      overflow: "visible",
                      filter: "drop-shadow(0 3px 5px rgba(120,90,40,0.4))",
                    }}
                  >
                    <defs>
                      <linearGradient id="bow-satin" x1="0" y1="0" x2="0.7" y2="1">
                        <stop offset="0" stopColor="#f2dca0" />
                        <stop offset="0.5" stopColor="#d2ad63" />
                        <stop offset="1" stopColor="#a8843e" />
                      </linearGradient>
                      <linearGradient id="bow-knot" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#fdf3d8" />
                        <stop offset="1" stopColor="#bfa05f" />
                      </linearGradient>
                    </defs>

                    {/* Colas que caen con corte de cola de golondrina */}
                    <motion.g variants={tailsV} initial="sealed" animate={animState}>
                      <path
                        d="M57 41 C53 58 49 72 48 88 L55 81 L61 90 C62 73 63 58 62 42 Z"
                        fill="url(#bow-satin)"
                      />
                      <path
                        d="M63 41 C67 58 71 72 72 88 L65 81 L59 90 C58 73 57 58 58 42 Z"
                        fill="url(#bow-satin)"
                      />
                    </motion.g>

                    {/* Loop izquierdo (con pliegue interior) */}
                    <motion.g
                      variants={loopLeftV}
                      initial="sealed"
                      animate={animState}
                      style={{ transformOrigin: "60px 40px" }}
                    >
                      <path
                        d="M60 40 C50 16 26 11 15 20 C4 29 9 45 25 49 C39 53 56 49 60 40 Z"
                        fill="url(#bow-satin)"
                      />
                      <path
                        d="M60 40 C50 31 35 29 27 33 C40 37 53 40 60 40 Z"
                        fill="#a9883f"
                        opacity="0.5"
                      />
                    </motion.g>

                    {/* Loop derecho (con pliegue interior) */}
                    <motion.g
                      variants={loopRightV}
                      initial="sealed"
                      animate={animState}
                      style={{ transformOrigin: "60px 40px" }}
                    >
                      <path
                        d="M60 40 C70 16 94 11 105 20 C116 29 111 45 95 49 C81 53 64 49 60 40 Z"
                        fill="url(#bow-satin)"
                      />
                      <path
                        d="M60 40 C70 31 85 29 93 33 C80 37 67 40 60 40 Z"
                        fill="#a9883f"
                        opacity="0.5"
                      />
                    </motion.g>

                    {/* Nudo central */}
                    <motion.g
                      variants={knotV}
                      initial="sealed"
                      animate={animState}
                      style={{ transformOrigin: "60px 40px" }}
                    >
                      <rect
                        x="52.5"
                        y="30"
                        width="15"
                        height="20"
                        rx="6.5"
                        fill="url(#bow-knot)"
                      />
                      <rect
                        x="56.5"
                        y="30"
                        width="2.4"
                        height="20"
                        fill="#ffffff"
                        opacity="0.45"
                      />
                    </motion.g>
                  </svg>
                </motion.div>
              </motion.div>

              {/* Shimmer que cruza el sobre (clip al rectángulo) */}
              <div
                className="decor-motion"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 10,
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 6,
                }}
              >
                <motion.div
                  animate={{ x: ["-180%", "180%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "-20%",
                    bottom: "-20%",
                    width: "36%",
                    transform: "skewX(-18deg)",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                  }}
                />
              </div>
            </motion.div>

            {/* Línea handwritten + hint */}
            <AnimatePresence>
              {phase === "sealed" && (
                <motion.div
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ textAlign: "center" }}
                >
                  <p
                    className="font-serif"
                    style={{
                      color: "var(--fg)",
                      fontStyle: "italic",
                      fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {para
                      ? `Para: ${para}`
                      : "Estás invitad@ a una noche especial"}
                  </p>
                  <motion.p
                    className="label"
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ color: "var(--fg-dim)" }}
                  >
                    Toca para abrir
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
