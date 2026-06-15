"use client";

import { ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import { waShare } from "@/lib/whatsapp";

/**
 * Botón de compartir: usa el menú nativo del dispositivo (cualquier medio)
 * y cae a WhatsApp si el navegador no soporta Web Share API.
 */
export default function ShareButton({
  url,
  message = "",
  label = "Compartir invitación",
  variant = "primary",
}: {
  url?: string;
  message?: string;
  label?: string;
  variant?: "primary" | "small";
}) {
  async function handle() {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const text = message ? `${message} ${shareUrl}` : shareUrl;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: message || "Invitación",
          text: message || undefined,
          url: shareUrl,
        });
      } catch {
        /* el usuario canceló: no hacer nada */
      }
      return;
    }
    window.open(waShare(text), "_blank", "noopener");
  }

  if (variant === "small") {
    return (
      <button type="button" onClick={handle} style={small}>
        <ShareNetwork weight="bold" size={14} />
        {label}
      </button>
    );
  }

  return (
    <button type="button" onClick={handle} style={primary}>
      <ShareNetwork weight="bold" size={18} />
      {label}
    </button>
  );
}

const primary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  minHeight: 48,
  padding: "0.75rem 1.75rem",
  borderRadius: "9999px",
  border: "1px solid var(--accent)",
  background: "rgba(231,156,196,0.12)",
  color: "var(--fg)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.78rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const small: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  border: "1px solid #d6d8ea",
  background: "#fff",
  borderRadius: 9999,
  padding: "0.45rem 0.85rem",
  fontSize: "0.75rem",
  cursor: "pointer",
  color: "#1f2147",
  minHeight: 38,
};
