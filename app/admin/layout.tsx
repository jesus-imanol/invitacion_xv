import type { ReactNode } from "react";

/** Contenedor del panel (estilo utilitario claro, distinto a la invitación). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#f4f5fb",
        color: "#1f2147",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </div>
  );
}
