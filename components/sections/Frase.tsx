import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import { invitacion } from "@/data/invitacion";

/** Frase de bienvenida (sección clara): cita serif con comilla decorativa. */
export default function Frase() {
  return (
    <Section panel>
      <Reveal>
        <span
          aria-hidden
          className="font-serif"
          style={{
            display: "block",
            fontSize: "5rem",
            lineHeight: 0.5,
            color: "var(--accent)",
            opacity: 0.55,
            marginBottom: "1.5rem",
          }}
        >
          &ldquo;
        </span>
        <p
          className="font-serif fg-soft"
          style={{
            fontSize: "var(--text-h2)",
            fontStyle: "italic",
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          {invitacion.frase}
        </p>
      </Reveal>
    </Section>
  );
}
