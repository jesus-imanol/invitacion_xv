import Reveal from "@/components/Reveal";
import Tiara from "@/components/decor/Tiara";
import { invitacion } from "@/data/invitacion";

/** Cierre — nombre + fecha + despedida. */
export default function Cierre() {
  return (
    <section
      className="measure text-center"
      style={{
        paddingBlock: "var(--section-y)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.1rem",
      }}
    >
      <Reveal>
        <div style={{ width: "clamp(4rem, 18vw, 6.5rem)", marginInline: "auto" }}>
          <Tiara id="tiara-cierre" />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <p
          className="font-serif fg-soft"
          style={{ fontSize: "var(--text-body)", fontStyle: "italic" }}
        >
          Con todo mi cariño, te espero para celebrar juntos.
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <h2
          className="font-script fg"
          style={{
            fontSize: "clamp(2.5rem, 11vw, 4.5rem)",
            lineHeight: 1,
            textShadow: "0 0 36px rgba(159,192,238,0.45)",
            marginBlock: "0.25rem",
          }}
        >
          {invitacion.nombre}
        </h2>
      </Reveal>

      <Reveal delay={0.24}>
        <p className="label">{invitacion.fechaTexto}</p>
      </Reveal>
    </section>
  );
}
