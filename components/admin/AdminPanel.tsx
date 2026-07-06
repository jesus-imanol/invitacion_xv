"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NuevaFamiliaForm from "@/components/admin/NuevaFamiliaForm";
import FamiliaRow from "@/components/admin/FamiliaRow";
import ScannerPanel from "@/components/admin/ScannerPanel";
import CreditFooter from "@/components/CreditFooter";
import type { AdminFamilia } from "@/components/admin/types";

export default function AdminPanel({
  familias,
  baseUrl,
  userEmail,
}: {
  familias: AdminFamilia[];
  baseUrl: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"familias" | "validar">("familias");
  const [filtro, setFiltro] = useState<"todas" | "confirmadas" | "sin">("todas");
  const [q, setQ] = useState("");

  // "now" solo tras montar (evita mismatch de hidratación por Date.now)
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const VENTANA_NUEVA = 24 * 60 * 60 * 1000; // 24h

  const totalPases = familias.reduce((s, f) => s + f.pases, 0);
  const confirmadas = familias.filter((f) => f.confirmado).length;
  const sinConfirmar = familias.length - confirmadas;
  const validadas = familias.filter((f) => f.validado).length;

  const norm = (s: string) =>
    s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
  const nq = norm(q);

  const familiasFiltradas = familias
    .filter((f) =>
      filtro === "confirmadas" ? f.confirmado : filtro === "sin" ? !f.confirmado : true
    )
    .filter((f) => (nq === "" ? true : norm(f.nombre).includes(nq)));

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "1.25rem" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: 0 }}>
          Panel · XV Sol Angélica
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", color: "#6a6d92" }}>{userEmail}</span>
          <button onClick={logout} style={ghostBtn}>
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          onClick={() => setTab("familias")}
          style={tab === "familias" ? tabActive : tabIdle}
        >
          Familias
        </button>
        <button
          onClick={() => setTab("validar")}
          style={tab === "validar" ? tabActive : tabIdle}
        >
          Validar QR
        </button>
      </div>

      {tab === "familias" ? (
        <>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <Stat label="Familias" value={familias.length} />
            <Stat label="Pases" value={totalPases} />
            <Stat label="Confirmadas" value={confirmadas} />
            <Stat label="Validadas" value={validadas} />
          </div>

          <NuevaFamiliaForm />

          {/* Buscador */}
          <div style={{ marginTop: "1.5rem" }}>
            <label
              htmlFor="buscar-familia"
              style={{
                display: "block",
                fontSize: "0.7rem",
                color: "#6a6d92",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.35rem",
              }}
            >
              Buscar familia
            </label>
            <div style={{ position: "relative" }}>
              <span
                aria-hidden
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9a9dbb", fontSize: "1rem" }}
              >
                ⌕
              </span>
              <input
                id="buscar-familia"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Escribe un nombre…"
                style={{
                  width: "100%",
                  minHeight: 48,
                  padding: "0.6rem 2.75rem",
                  borderRadius: 12,
                  border: "1px solid #d6d8ea",
                  fontSize: 16, // ≥16px evita auto-zoom en iOS
                  color: "#1f2147",
                  background: "#fff",
                }}
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Limpiar búsqueda"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 34,
                    height: 34,
                    borderRadius: 9999,
                    border: "none",
                    background: "#eef0f7",
                    color: "#6a6d92",
                    cursor: "pointer",
                    fontSize: "1.15rem",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filtro por estado de confirmación */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
            <Chip activo={filtro === "todas"} onClick={() => setFiltro("todas")}>
              Todas ({familias.length})
            </Chip>
            <Chip activo={filtro === "confirmadas"} onClick={() => setFiltro("confirmadas")}>
              Confirmadas ({confirmadas})
            </Chip>
            <Chip activo={filtro === "sin"} onClick={() => setFiltro("sin")}>
              Sin confirmar ({sinConfirmar})
            </Chip>
          </div>

          {(nq !== "" || filtro !== "todas") && familias.length > 0 && (
            <p style={{ fontSize: "0.75rem", color: "#8a8db0", marginTop: "0.75rem" }}>
              Mostrando {familiasFiltradas.length} de {familias.length}
            </p>
          )}

          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {familias.length === 0 ? (
              <p style={{ color: "#6a6d92", fontSize: "0.9rem" }}>
                Aún no hay familias. Agrega la primera arriba.
              </p>
            ) : familiasFiltradas.length === 0 ? (
              <p style={{ color: "#6a6d92", fontSize: "0.9rem" }}>
                {nq !== ""
                  ? `No se encontró ninguna familia con “${q}”.`
                  : "No hay familias en este filtro."}
              </p>
            ) : (
              familiasFiltradas.map((f) => (
                <FamiliaRow
                  key={f.id}
                  familia={f}
                  baseUrl={baseUrl}
                  esNueva={
                    now !== null &&
                    now - new Date(f.created_at).getTime() < VENTANA_NUEVA
                  }
                />
              ))
            )}
          </div>
        </>
      ) : (
        <ScannerPanel />
      )}

      <div style={{ marginTop: "2.5rem" }}>
        <CreditFooter />
      </div>
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: activo ? "1px solid #4A2BC9" : "1px solid #d6d8ea",
        background: activo ? "#efeafd" : "#fff",
        color: activo ? "#2a1c86" : "#4a4d75",
        borderRadius: 9999,
        padding: "0.4rem 0.95rem",
        fontSize: "0.78rem",
        fontWeight: activo ? 600 : 400,
        cursor: "pointer",
        minHeight: 38,
      }}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        background: "#fff",
        borderRadius: 12,
        padding: "0.85rem 1rem",
        boxShadow: "0 8px 24px -18px rgba(31,33,71,0.5)",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)" }}>{value}</div>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8a8db0" }}>
        {label}
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  border: "1px solid #d6d8ea",
  background: "#fff",
  borderRadius: 9999,
  padding: "0.4rem 0.9rem",
  fontSize: "0.78rem",
  cursor: "pointer",
  color: "#1f2147",
};

const tabBase: React.CSSProperties = {
  border: "none",
  borderRadius: 9999,
  padding: "0.55rem 1.4rem",
  fontSize: "0.82rem",
  cursor: "pointer",
  fontWeight: 500,
};
const tabActive: React.CSSProperties = {
  ...tabBase,
  background: "linear-gradient(160deg, #4A2BC9, #1B0980)",
  color: "#fff",
};
const tabIdle: React.CSSProperties = {
  ...tabBase,
  background: "#e7e8f4",
  color: "#4a4d75",
};
