"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NuevaFamiliaForm from "@/components/admin/NuevaFamiliaForm";
import FamiliaRow from "@/components/admin/FamiliaRow";
import ScannerPanel from "@/components/admin/ScannerPanel";
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

  const totalPases = familias.reduce((s, f) => s + f.pases, 0);
  const confirmadas = familias.filter((f) => f.confirmado).length;
  const validadas = familias.filter((f) => f.validado).length;

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

          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {familias.length === 0 && (
              <p style={{ color: "#6a6d92", fontSize: "0.9rem" }}>
                Aún no hay familias. Agrega la primera arriba.
              </p>
            )}
            {familias.map((f) => (
              <FamiliaRow key={f.id} familia={f} baseUrl={baseUrl} />
            ))}
          </div>
        </>
      ) : (
        <ScannerPanel />
      )}
    </div>
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
