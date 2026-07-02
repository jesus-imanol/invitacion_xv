import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { invitacion } from "@/data/invitacion";

/** Código de vestimenta (sección clara) + color reservado para la quinceañera. */
export default function Vestimenta() {
  const { vestimenta, vestimentaNota, colorReservado } = invitacion;

  return (
    <Section panel>
      <Reveal>
        <SectionHeading label="Para la ocasión" title="Código de vestimenta" />
      </Reveal>

      <Reveal delay={0.08}>
        <p
          className="font-serif fg"
          style={{ fontSize: "var(--text-h2)", letterSpacing: "0.04em" }}
        >
          {vestimenta}
        </p>
        {vestimentaNota && (
          <p
            className="fg-soft"
            style={{
              fontSize: "var(--text-body)",
              maxWidth: "32ch",
              marginInline: "auto",
              marginTop: "0.6rem",
              lineHeight: 1.6,
            }}
          >
            {vestimentaNota}
          </p>
        )}
      </Reveal>

      <Reveal delay={0.16}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.85rem",
            marginTop: "1.75rem",
            padding: "0.85rem 1.4rem",
            borderRadius: "9999px",
            border: "1px solid var(--panel-border)",
            background: "var(--panel)",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "9999px",
              background: colorReservado.hex,
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: `0 0 12px ${colorReservado.hex}`,
              flexShrink: 0,
            }}
          />
          <span className="fg-soft" style={{ fontSize: "0.9rem" }}>
            Color reservado para la quinceañera:{" "}
            <strong className="fg">{colorReservado.label}</strong>
          </span>
        </div>
      </Reveal>
    </Section>
  );
}
