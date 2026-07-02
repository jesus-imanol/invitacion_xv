import Image from "next/image";
import Tiara from "@/components/decor/Tiara";
import { invitacion } from "@/data/invitacion";
import { galeriaDestacada } from "@/data/galeria";

/**
 * Portada (hero). Server Component: es el LCP, visible de inmediato (no reveal).
 * Tema claro acuarela: nombre índigo del vestido con glow suave + halo femenino.
 */
export default function Portada() {
  const lugarPrincipal = invitacion.lugares.find((l) =>
    /^https?:\/\//.test(l.maps)
  );

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
          width: "min(100%, 720px)",
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

      {galeriaDestacada ? (
        <div
          style={{
            position: "relative",
            width: "clamp(220px, 72vw, 330px)",
            marginInline: "auto",
            marginBottom: "1.5rem",
          }}
        >
          {/* Marco dorado en arco */}
          <div
            style={{
              padding: 6,
              borderRadius: "48% 48% 14px 14px / 30% 30% 4% 4%",
              background: "linear-gradient(160deg, #f3e2b4, #cda968 55%, #a07f3d)",
              boxShadow: "0 22px 50px -26px rgba(42,28,134,0.55)",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "5 / 6",
                borderRadius: "46% 46% 9px 9px / 28% 28% 3% 3%",
                overflow: "hidden",
                background: "var(--lavender)",
              }}
            >
              <Image
                src={galeriaDestacada.src}
                alt={galeriaDestacada.alt}
                fill
                sizes="(max-width: 640px) 72vw, 330px"
                style={{ objectFit: "cover", objectPosition: "center 12%" }}
                priority
              />
            </div>
          </div>
          {/* Tiara coronando el arco */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-9%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "46%",
              zIndex: 2,
            }}
          >
            <Tiara id="tiara-portada" />
          </div>
        </div>
      ) : (
        <div style={{ width: "clamp(5rem, 22vw, 8.5rem)", marginBottom: "0.25rem" }}>
          <Tiara id="tiara-portada" />
        </div>
      )}

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

      {/* Ubicación rápida (también al inicio) */}
      {lugarPrincipal && (
        <div
          style={{
            marginTop: "1.4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <p className="font-serif fg-soft" style={{ fontSize: "0.98rem" }}>
            {lugarPrincipal.nombre}
          </p>
          <a
            href={lugarPrincipal.maps}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              minHeight: 42,
              padding: "0.5rem 1.35rem",
              borderRadius: "9999px",
              border: "1px solid var(--accent)",
              background: "rgba(231,156,196,0.1)",
              color: "var(--fg-soft)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11" r="2.1" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Cómo llegar
          </a>
        </div>
      )}

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
