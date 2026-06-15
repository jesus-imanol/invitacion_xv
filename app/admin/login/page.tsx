"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Correo o contraseña incorrectos.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100dvh", padding: "1.5rem" }}>
      <form
        onSubmit={submit}
        style={{
          width: "min(92vw, 360px)",
          background: "#ffffff",
          borderRadius: 16,
          padding: "2rem 1.5rem",
          boxShadow: "0 20px 50px -25px rgba(31,33,71,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: 0 }}>
          Panel · XV Sol Angélica
        </h1>
        <label style={labelStyle}>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={inputStyle}
          />
        </label>
        {error && <p style={{ color: "#c0285a", fontSize: "0.85rem", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={pending} style={btnStyle}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  fontSize: "0.8rem",
  color: "#5a5d85",
};

const inputStyle: React.CSSProperties = {
  minHeight: 44,
  padding: "0.5rem 0.75rem",
  borderRadius: 10,
  border: "1px solid #d6d8ea",
  fontSize: "1rem",
  color: "#1f2147",
  background: "#fff",
};

const btnStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(160deg, #4A2BC9, #1B0980)",
  color: "#fff",
  fontSize: "0.85rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  cursor: "pointer",
};
