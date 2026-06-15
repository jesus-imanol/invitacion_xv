"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { eliminarFamilia } from "@/app/admin/actions";
import { invitationUrl } from "@/lib/links";
import type { AdminFamilia } from "@/components/admin/types";

export default function FamiliaRow({
  familia,
  baseUrl,
}: {
  familia: AdminFamilia;
  baseUrl: string;
}) {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const link = baseUrl ? `${baseUrl}/i/${familia.token}` : invitationUrl(familia.token);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  function descargarQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `QR-${familia.nombre.replace(/\s+/g, "_")}.png`;
    a.click();
  }

  function borrar() {
    if (!confirm(`¿Eliminar a "${familia.nombre}"?`)) return;
    startTransition(async () => {
      await eliminarFamilia(familia.id);
      router.refresh();
    });
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "1rem",
        boxShadow: "0 10px 30px -24px rgba(31,33,71,0.5)",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* QR (oculto a tamaño descargable; se muestra a 64px) */}
      <div ref={qrRef} style={{ lineHeight: 0 }}>
        <QRCodeCanvas value={familia.token} size={64} level="M" fgColor="#1B0980" />
      </div>

      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{familia.nombre}</div>
        <div style={{ fontSize: "0.8rem", color: "#6a6d92" }}>
          {familia.pases} {familia.pases === 1 ? "pase" : "pases"}
        </div>
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
          {familia.confirmado && (
            <Badge color="#2e8b6b">
              Confirmó {familia.confirmado_pases ?? familia.pases}
            </Badge>
          )}
          {familia.validado && <Badge color="#7a5cc4">Validado</Badge>}
          {!familia.confirmado && <Badge color="#a0a3c0">Sin confirmar</Badge>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button onClick={copy} style={smallBtn}>
          {copied ? "¡Copiado!" : "Copiar link"}
        </button>
        <button onClick={descargarQR} style={smallBtn}>
          Descargar QR
        </button>
        <button onClick={borrar} disabled={pending} style={{ ...smallBtn, color: "#c0285a", borderColor: "#f0c9d6" }}>
          {pending ? "…" : "Eliminar"}
        </button>
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#fff",
        background: color,
        borderRadius: 9999,
        padding: "0.2rem 0.6rem",
      }}
    >
      {children}
    </span>
  );
}

const smallBtn: React.CSSProperties = {
  border: "1px solid #d6d8ea",
  background: "#fff",
  borderRadius: 9999,
  padding: "0.45rem 0.85rem",
  fontSize: "0.75rem",
  cursor: "pointer",
  color: "#1f2147",
  minHeight: 38,
};
