import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { EventIcon } from "@/components/ui/Icons";
import { invitacion } from "@/data/invitacion";

const isPendiente = (v: string) => v.trim().toUpperCase().startsWith("TODO");
const esUrl = (v: string) => /^https?:\/\//i.test(v.trim());

/** Ubicación (sección oscura) — iglesia + salón con botón "Cómo llegar". */
export default function Ubicacion() {
  return (
    <Section center={false}>
      <Reveal>
        <SectionHeading label="Dónde celebramos" title="Ubicación" />
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {invitacion.lugares.map((lugar, i) => {
          const direccionOk = !isPendiente(lugar.direccion);
          const mapsOk = esUrl(lugar.maps);
          return (
            <Reveal key={lugar.nombre} delay={i * 0.08}>
              <article
                style={{
                  textAlign: "center",
                  borderRadius: 16,
                  padding: "clamp(1.5rem, 6vw, 2.25rem) 1.25rem",
                  background: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    display: "inline-grid",
                    placeItems: "center",
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                  }}
                >
                  <EventIcon name="pin" />
                </span>
                <p className="label" style={{ color: "var(--accent)" }}>
                  {lugar.tipo}
                </p>
                <h3
                  className="font-serif fg"
                  style={{
                    fontSize: "var(--text-h2)",
                    marginBlock: "0.4rem 0.5rem",
                    lineHeight: 1.2,
                  }}
                >
                  {lugar.nombre}
                </h3>
                <p
                  className="fg-soft"
                  style={{ fontSize: "0.95rem", opacity: direccionOk ? 0.9 : 0.6 }}
                >
                  {direccionOk ? lugar.direccion : "Dirección por confirmar"}
                </p>
                <p className="label" style={{ marginTop: "0.5rem" }}>
                  {lugar.hora}
                </p>

                {mapsOk ? (
                  <a
                    href={lugar.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btn}
                  >
                    Cómo llegar
                  </a>
                ) : (
                  <span style={{ ...btn, ...btnDisabled }} aria-disabled="true">
                    Ubicación próximamente
                  </span>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  marginTop: "1.25rem",
  padding: "0.6rem 1.5rem",
  borderRadius: "9999px",
  border: "1px solid var(--accent)",
  color: "var(--fg-soft)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.75rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  textDecoration: "none",
  background: "rgba(159,192,238,0.08)",
};

const btnDisabled: React.CSSProperties = {
  borderColor: "var(--rule)",
  color: "var(--fg-dim)",
  background: "transparent",
  cursor: "not-allowed",
};
