"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearFamilia } from "@/app/admin/actions";

export default function NuevaFamiliaForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pases, setPases] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) return;
    startTransition(async () => {
      const res = await crearFamilia(nombre, pases);
      if (!res.ok) {
        setError(res.error ?? "No se pudo crear.");
        return;
      }
      setNombre("");
      setPases(2);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "1.1rem",
        boxShadow: "0 10px 30px -22px rgba(31,33,71,0.5)",
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      <label style={{ flex: "2 1 200px", display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.75rem", color: "#6a6d92" }}>
        Nombre de la familia
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Familia Pérez Osuna"
          style={input}
        />
      </label>
      <label style={{ flex: "1 1 90px", display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.75rem", color: "#6a6d92" }}>
        Pases
        <input
          type="number"
          min={1}
          max={50}
          value={pases}
          onChange={(e) => setPases(Math.max(1, Number(e.target.value)))}
          style={input}
        />
      </label>
      <button type="submit" disabled={pending} style={addBtn}>
        {pending ? "Agregando…" : "Agregar familia"}
      </button>
      {error && <p style={{ flexBasis: "100%", color: "#c0285a", fontSize: "0.8rem", margin: 0 }}>{error}</p>}
    </form>
  );
}

const input: React.CSSProperties = {
  minHeight: 44,
  padding: "0.5rem 0.75rem",
  borderRadius: 10,
  border: "1px solid #d6d8ea",
  fontSize: "1rem",
  color: "#1f2147",
  background: "#fff",
};

const addBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 1.4rem",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(160deg, #4A2BC9, #1B0980)",
  color: "#fff",
  fontSize: "0.8rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};
