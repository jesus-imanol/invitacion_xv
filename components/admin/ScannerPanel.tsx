"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { validarFamilia } from "@/app/admin/actions";

// Carga solo en cliente (usa la cámara / API del navegador).
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false }
);

type Resultado = Awaited<ReturnType<typeof validarFamilia>>;

export default function ScannerPanel() {
  const [result, setResult] = useState<Resultado | null>(null);
  const [scanning, setScanning] = useState(true);
  const [busy, setBusy] = useState(false);

  async function onScan(codes: IDetectedBarcode[]) {
    const value = codes?.[0]?.rawValue;
    if (!value || busy) return;
    setBusy(true);
    setScanning(false);
    const res = await validarFamilia(value);
    setResult(res);
    setBusy(false);
  }

  function reset() {
    setResult(null);
    setScanning(true);
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <p style={{ textAlign: "center", color: "#6a6d92", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Apunta la cámara al QR del invitado para validar su entrada.
      </p>

      {scanning && (
        <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "1 / 1", background: "#000" }}>
          <Scanner
            onScan={onScan}
            onError={() => {}}
            constraints={{ facingMode: "environment" }}
            sound={false}
          />
        </div>
      )}

      {result && <ResultadoCard result={result} onReset={reset} />}
    </div>
  );
}

function ResultadoCard({ result, onReset }: { result: Resultado; onReset: () => void }) {
  const map = {
    ok: { bg: "#e6f6ee", border: "#2e8b6b", title: "Acceso válido ✓" },
    ya_validada: { bg: "#fdeede", border: "#d08a2e", title: "Ya fue validado ⚠" },
    no_existe: { bg: "#fbe6ee", border: "#c0285a", title: "QR no reconocido ✕" },
    error: { bg: "#fbe6ee", border: "#c0285a", title: "Error al validar" },
  } as const;
  const s = map[result.estado as keyof typeof map] ?? map.error;

  return (
    <div
      style={{
        marginTop: "1.25rem",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 16,
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem", color: s.border, fontFamily: "var(--font-serif)", fontSize: "1.4rem" }}>
        {s.title}
      </h3>
      {"nombre" in result && result.nombre && (
        <p style={{ margin: "0.25rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#1f2147" }}>
          {result.nombre}
        </p>
      )}
      {"pases" in result && result.pases != null && (
        <p style={{ margin: 0, color: "#4a4d75" }}>
          {result.pases} {result.pases === 1 ? "pase" : "pases"}
        </p>
      )}
      {result.estado === "ya_validada" && "validadoAt" in result && result.validadoAt && (
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "#8a6a2e" }}>
          Entró: {new Date(result.validadoAt).toLocaleString("es-MX")}
        </p>
      )}
      <button
        onClick={onReset}
        style={{
          marginTop: "1.25rem",
          minHeight: 46,
          padding: "0 1.6rem",
          borderRadius: 9999,
          border: "none",
          background: "#1f2147",
          color: "#fff",
          fontSize: "0.82rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Escanear otro
      </button>
    </div>
  );
}
