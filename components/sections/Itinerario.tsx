import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { EventIcon } from "@/components/ui/Icons";
import { invitacion } from "@/data/invitacion";

/** Itinerario — timeline en zigzag (lados alternados) con nodos e iconos. */
export default function Itinerario() {
  const items = invitacion.itinerario;

  return (
    <Section center={false}>
      <Reveal>
        <SectionHeading label="Programa de la noche" title="Itinerario" />
      </Reveal>

      <div style={{ position: "relative" }}>
        {/* Línea central continua */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 12,
            bottom: 12,
            left: "50%",
            width: 2,
            transform: "translateX(-1px)",
            background:
              "linear-gradient(180deg, var(--accent), var(--gold) 50%, var(--accent))",
            opacity: 0.5,
          }}
        />

        {items.map((it, i) => {
          const left = i % 2 === 0;
          const content = (
            <>
              <div
                className="label"
                style={{ color: "var(--accent)", marginBottom: "0.25rem" }}
              >
                {it.hora}
              </div>
              <div
                className="font-serif fg"
                style={{ fontSize: "var(--text-h2)", lineHeight: 1.2 }}
              >
                {it.titulo}
              </div>
            </>
          );

          return (
            <Reveal key={it.titulo} delay={i * 0.06}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 56px 1fr",
                  alignItems: "center",
                  minHeight: 110,
                }}
              >
                {/* Columna izquierda: contenido si left, si no reserva espacio */}
                <div
                  aria-hidden={!left}
                  style={{
                    gridColumn: 1,
                    textAlign: "right",
                    paddingRight: "1rem",
                    visibility: left ? "visible" : "hidden",
                  }}
                >
                  {content}
                </div>

                {/* Nodo central con icono (z-index para tapar la línea detrás) */}
                <div
                  style={{
                    gridColumn: 2,
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "9999px",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--gold)",
                      background: "#ffffff",
                      border: "1px solid var(--panel-border)",
                      boxShadow: "0 8px 20px -10px rgba(198,166,103,0.7)",
                    }}
                  >
                    <span style={{ width: 26, height: 26 }}>
                      <EventIcon name={it.icono} />
                    </span>
                  </span>
                </div>

                {/* Columna derecha: contenido si right, si no reserva espacio */}
                <div
                  aria-hidden={left}
                  style={{
                    gridColumn: 3,
                    textAlign: "left",
                    paddingLeft: "1rem",
                    visibility: left ? "hidden" : "visible",
                  }}
                >
                  {content}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
