import Image from "next/image";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { invitacion } from "@/data/invitacion";

/** Mesa de regalos — botón con logo de tienda + número de evento. */
export default function Regalos() {
  const { regalos } = invitacion;

  return (
    <Section panel>
      <Reveal>
        <SectionHeading label="Si deseas regalar" title="Mesa de regalos" />
      </Reveal>

      <Reveal delay={0.08}>
        <p
          className="font-serif fg-soft"
          style={{
            fontSize: "var(--text-body)",
            fontStyle: "italic",
            maxWidth: "32ch",
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          {regalos.texto}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1.75rem",
          }}
        >
          {regalos.opciones.map((op) => {
            const esLiverpool = op.url.toLowerCase().includes("liverpool");
            return (
              <a
                key={op.etiqueta}
                href={op.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={op.etiqueta}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  minHeight: 56,
                  padding: esLiverpool ? "0.6rem 1.75rem" : "0.75rem 2rem",
                  borderRadius: "9999px",
                  border: "1px solid var(--panel-border)",
                  background: "#ffffff",
                  color: "var(--fg)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 10px 24px -14px rgba(42,28,134,0.4)",
                }}
              >
                {esLiverpool ? (
                  <Image
                    src="/liverpool_logo.png"
                    alt="Liverpool"
                    width={150}
                    height={40}
                    style={{ height: 30, width: "auto" }}
                  />
                ) : (
                  op.etiqueta
                )}
              </a>
            );
          })}

          {regalos.eventoLiverpool && (
            <p className="label" style={{ marginTop: "0.25rem" }}>
              Número de evento:{" "}
              <span className="fg-soft" style={{ letterSpacing: "0.1em" }}>
                {regalos.eventoLiverpool}
              </span>
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
