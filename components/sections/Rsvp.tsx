import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import RsvpFamilia from "@/components/sections/RsvpFamilia";
import { invitacion } from "@/data/invitacion";
import { waLink, waValido } from "@/lib/whatsapp";
import type { FamiliaPublica } from "@/lib/types";

/** Confirmación de asistencia. Con familia: online + WhatsApp. Genérico: WhatsApp. */
export default function Rsvp({ familia }: { familia?: FamiliaPublica }) {
  return (
    <Section panel>
      <Reveal>
        <SectionHeading label="Te esperamos" title="Confirma tu asistencia" />
      </Reveal>

      {familia ? (
        <RsvpFamilia familia={familia} />
      ) : (
        <GenericoWhatsApp />
      )}
    </Section>
  );
}

/** RSVP genérico (sin familia): solo botón de WhatsApp del evento. */
function GenericoWhatsApp() {
  const ok = waValido(invitacion.whatsapp);
  const mensaje = `Hola, confirmo mi asistencia a los XV Años de ${invitacion.nombre}. `;
  const href = ok ? waLink(invitacion.whatsapp, mensaje) : undefined;

  return (
    <>
      <Reveal delay={0.08}>
        <p
          className="fg-soft"
          style={{
            fontSize: "var(--text-body)",
            maxWidth: "34ch",
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Tu confirmación nos ayuda a preparar todo con cariño.
          {invitacion.fechaLimiteRSVP &&
            !invitacion.fechaLimiteRSVP.toUpperCase().startsWith("TODO") && (
              <>
                {" "}
                Por favor confirma antes del{" "}
                <strong className="fg">{invitacion.fechaLimiteRSVP}</strong>.
              </>
            )}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        {ok ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              minHeight: 50,
              marginTop: "1.75rem",
              padding: "0.85rem 2.25rem",
              borderRadius: "9999px",
              background: "linear-gradient(160deg, #4A2BC9, #1B0980)",
              border: "1px solid rgba(159,192,238,0.45)",
              color: "var(--white)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 12px 30px -10px rgba(74,43,201,0.7)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.4-1.1-2.6 0-1.3.7-1.9.9-2.1.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.2.5.3.5.4.1.2.1.7-.2 1.1z" />
            </svg>
            Confirmar por WhatsApp
          </a>
        ) : (
          <span
            aria-disabled="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 50,
              marginTop: "1.75rem",
              padding: "0.85rem 2rem",
              borderRadius: "9999px",
              border: "1px solid var(--rule)",
              color: "var(--fg-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "not-allowed",
            }}
          >
            Número de WhatsApp pendiente
          </span>
        )}
      </Reveal>
    </>
  );
}
