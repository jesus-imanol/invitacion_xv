import Tiara from "@/components/decor/Tiara";
import { invitacion } from "@/data/invitacion";

/**
 * Portada (hero). Server Component: es el LCP, visible de inmediato (no reveal).
 * Tema claro acuarela: nombre índigo del vestido con glow suave + halo femenino.
 */
export default function Portada() {
  return (
    <section
      className="measure relative flex min-h-dvh flex-col items-center justify-center text-center"
      style={{ paddingBlock: "var(--section-y)", zIndex: 1 }}
    >
      {/* Halo focal suave detrás del nombre */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "46%",
          width: "min(110vw, 720px)",
          height: "min(80vw, 520px)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(231,156,196,0.35) 0%, rgba(195,184,238,0.22) 42%, transparent 72%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <p className="label" style={{ marginBottom: "1.75rem" }}>
        Acompáñanos a celebrar los XV Años
      </p>

      <div style={{ width: "clamp(5rem, 22vw, 8.5rem)", marginBottom: "0.25rem" }}>
        <Tiara id="tiara-portada" />
      </div>

      <h1
        className="font-script fg"
        style={{
          fontSize: "var(--text-name)",
          lineHeight: 1.05,
          textShadow: "0 2px 24px rgba(231,156,196,0.45), 0 0 8px rgba(255,255,255,0.6)",
          marginBlock: "0.5rem 0.75rem",
        }}
      >
        {invitacion.nombre}
      </h1>

      <p
        className="font-serif fg-soft"
        style={{
          fontSize: "var(--text-h2)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {invitacion.apellidos}
      </p>

      {/* Divisor con rombo rosa */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBlock: "1.75rem",
        }}
      >
        <span
          style={{
            display: "block",
            width: "clamp(2.5rem, 14vw, 5rem)",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--rule))",
          }}
        />
        <span
          style={{
            width: 6,
            height: 6,
            transform: "rotate(45deg)",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
        />
        <span
          style={{
            display: "block",
            width: "clamp(2.5rem, 14vw, 5rem)",
            height: 1,
            background: "linear-gradient(90deg, var(--rule), transparent)",
          }}
        />
      </div>

      <p
        className="font-serif fg-soft"
        style={{ fontSize: "var(--text-body)", letterSpacing: "0.04em" }}
      >
        {invitacion.fechaTexto}
      </p>
      <p className="label" style={{ marginTop: "0.5rem" }}>
        {invitacion.horaTexto}
      </p>

      {/* Hint de scroll */}
      <div
        aria-hidden
        className="decor-motion"
        style={{
          position: "absolute",
          bottom: "1.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          animation: "scroll-hint 2s ease-in-out infinite",
        }}
      >
        <span className="label" style={{ fontSize: "0.65rem" }}>
          Desliza
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
