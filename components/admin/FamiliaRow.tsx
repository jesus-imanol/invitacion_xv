"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { editarFamilia, eliminarFamilia } from "@/app/admin/actions";
import { invitationUrl } from "@/lib/links";
import ShareButton from "@/components/ShareButton";
import { invitacion } from "@/data/invitacion";
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

  // Edición
  const [editing, setEditing] = useState(false);
  const [editNombre, setEditNombre] = useState(familia.nombre);
  const [editPases, setEditPases] = useState(String(familia.pases));
  const [error, setError] = useState<string | null>(null);

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

  function abrirEdicion() {
    setEditNombre(familia.nombre);
    setEditPases(String(familia.pases));
    setError(null);
    setEditing(true);
  }

  function guardar() {
    setError(null);
    const n = parseInt(editPases, 10);
    if (!editNombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (!Number.isFinite(n) || n < 1) {
      setError("Indica el número de pases (mínimo 1).");
      return;
    }
    startTransition(async () => {
      const res = await editarFamilia(familia.id, editNombre, n);
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar.");
        return;
      }
      setEditing(false);
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
        {editing ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <label style={{ flex: "2 1 140px", display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.7rem", color: "#6a6d92" }}>
              Nombre
              <input
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                style={input}
                autoFocus
              />
            </label>
            <label style={{ flex: "1 1 70px", display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.7rem", color: "#6a6d92" }}>
              Pases
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={editPases}
                onChange={(e) => setEditPases(e.target.value.replace(/[^0-9]/g, ""))}
                style={input}
              />
            </label>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{familia.nombre}</div>
            <div style={{ fontSize: "0.8rem", color: "#6a6d92" }}>
              {familia.pases} {familia.pases === 1 ? "pase" : "pases"}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
          {familia.confirmado && (
            <Badge color="#2e8b6b">Confirmó {familia.confirmado_pases ?? familia.pases}</Badge>
          )}
          {familia.validado && <Badge color="#7a5cc4">Validado</Badge>}
          {!familia.confirmado && <Badge color="#a0a3c0">Sin confirmar</Badge>}
        </div>
        {error && <p style={{ color: "#c0285a", fontSize: "0.75rem", margin: "0.4rem 0 0" }}>{error}</p>}
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {editing ? (
          <>
            <button onClick={guardar} disabled={pending} style={{ ...smallBtn, ...primaryBtn }}>
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button onClick={() => setEditing(false)} disabled={pending} style={smallBtn}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button onClick={abrirEdicion} style={smallBtn}>
              Editar
            </button>
            <button onClick={copy} style={smallBtn}>
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>
            <ShareButton
              variant="small"
              label="Compartir"
              url={link}
              message={`Invitación a los XV Años de ${invitacion.nombre} para ${familia.nombre}:`}
            />
            <button onClick={descargarQR} style={smallBtn}>
              Descargar QR
            </button>
            <button onClick={borrar} disabled={pending} style={{ ...smallBtn, color: "#c0285a", borderColor: "#f0c9d6" }}>
              {pending ? "…" : "Eliminar"}
            </button>
          </>
        )}
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

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(160deg, #4A2BC9, #1B0980)",
  color: "#fff",
  border: "none",
};

const input: React.CSSProperties = {
  minHeight: 40,
  padding: "0.4rem 0.6rem",
  borderRadius: 9,
  border: "1px solid #d6d8ea",
  fontSize: "0.95rem",
  color: "#1f2147",
  background: "#fff",
  width: "100%",
};
