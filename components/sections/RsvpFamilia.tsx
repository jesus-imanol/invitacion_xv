"use client";

import { useState, useTransition } from "react";
import Reveal from "@/components/Reveal";
import { confirmarAsistencia } from "@/app/actions";
import { invitacion } from "@/data/invitacion";
import { waLink, waValido } from "@/lib/whatsapp";
import type { FamiliaPublica } from "@/lib/types";

export default function RsvpFamilia({ familia }: { familia: FamiliaPublica }) {
  const [pases, setPases] = useState(familia.confirmadoPases ?? familia.pases);
  const [confirmado, setConfirmado] = useState(familia.confirmado);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const waOk = waValido(invitacion.whatsapp);
  const waHref = waOk
    ? waLink(
        invitacion.whatsapp,
        `Hola, confirmo la asistencia de ${familia.nombre} (${pases} ${
          pases === 1 ? "pase" : "pases"
        }) a los XV Años de ${invitacion.nombre}.`
      )
    : undefined;

  const opciones = Array.from({ length: familia.pases }, (_, i) => i + 1);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await confirmarAsistencia(familia.token, pases);
      if (res.ok) setConfirmado(true);
      else setError("No se pudo confirmar. Intenta de nuevo.");
    });
  }

  return (
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
        {familia.nombre}, tienen {familia.pases}{" "}
        {familia.pases === 1 ? "pase reservado" : "pases reservados"}. ¿Cuántos
        asistirán?
      </p>

      <div style={{ marginTop: "1.25rem" }}>
        <select
          aria-label="Número de asistentes"
          value={pases}
          onChange={(e) => setPases(Number(e.target.value))}
          disabled={pending || confirmado}
          style={{
            minHeight: 48,
            padding: "0.5rem 2.5rem 0.5rem 1.25rem",
            borderRadius: "9999px",
            border: "1px solid var(--panel-border)",
            background: "#ffffff",
            color: "var(--fg)",
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          {opciones.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "asistente" : "asistentes"}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.85rem",
        }}
      >
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending || confirmado}
          style={{
            minHeight: 50,
            padding: "0.85rem 2.25rem",
            borderRadius: "9999px",
            background: confirmado
              ? "#2e8b6b"
              : "linear-gradient(160deg, #4A2BC9, #1B0980)",
            border: "none",
            color: "var(--white)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.82rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: pending || confirmado ? "default" : "pointer",
            boxShadow: "0 12px 30px -10px rgba(74,43,201,0.6)",
          }}
        >
          {confirmado
            ? "✓ Asistencia confirmada"
            : pending
              ? "Confirmando…"
              : "Confirmar asistencia"}
        </button>

        {error && (
          <p className="label" style={{ color: "#c0497a" }}>
            {error}
          </p>
        )}

        {waOk && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="label"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            o avisar por WhatsApp
          </a>
        )}
      </div>
    </Reveal>
  );
}
