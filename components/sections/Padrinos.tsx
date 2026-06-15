import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { invitacion } from "@/data/invitacion";

/** Padres y padrinos (sección clara). Lista vertical con divisores finos. */
export default function Padrinos() {
  const grupos: { label: string; nombres: readonly string[] }[] = [
    { label: "Con la bendición de mis padres", nombres: invitacion.padres },
    { label: "Padrinos de Velación", nombres: invitacion.padrinosVelacion },
    { label: "Padrinos de Brindis", nombres: invitacion.padrinosBrindis },
  ];

  return (
    <Section panel>
      <Reveal>
        <SectionHeading label="Acompañados por" title="Padres y Padrinos" />
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
        {grupos.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.08}>
            <div>
              <p
                className="label"
                style={{ marginBottom: "0.85rem", color: "var(--accent)" }}
              >
                {g.label}
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {g.nombres.map((n) => (
                  <li
                    key={n}
                    className="font-serif fg-soft"
                    style={{ fontSize: "var(--text-h2)", lineHeight: 1.3 }}
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            {i < grupos.length - 1 && (
              <span
                aria-hidden
                style={{
                  display: "block",
                  width: "clamp(3rem, 18vw, 6rem)",
                  height: 1,
                  margin: "2.25rem auto 0",
                  background:
                    "linear-gradient(90deg, transparent, var(--rule), transparent)",
                }}
              />
            )}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
