import { invitacion } from "@/data/invitacion";
import { waLink } from "@/lib/whatsapp";

/** Sello de autor + contacto para contrataciones. Usado en invitación y panel. */
export default function CreditFooter() {
  const { autor } = invitacion;
  const contacto = waLink(
    autor.whatsapp,
    `Hola ${autor.nombre.split(" ")[0]}, vi una invitación que hiciste y me gustaría una para mi evento.`
  );

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        padding: "2rem 1.25rem 2.5rem",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <p className="fg-dim" style={{ fontSize: "0.78rem", margin: 0 }}>
        Invitación diseñada por{" "}
        <strong className="fg-soft" style={{ fontWeight: 600 }}>
          {autor.nombre}
        </strong>
      </p>
      <a
        href={contacto}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          marginTop: "0.6rem",
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          color: "var(--accent)",
          textDecoration: "none",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.4-1.1-2.6 0-1.3.7-1.9.9-2.1.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.2.5.3.5.4.1.2.1.7-.2 1.1z" />
        </svg>
        ¿Quieres una invitación así? Escríbeme · {autor.whatsappDisplay}
      </a>
    </footer>
  );
}
