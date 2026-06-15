import type { ReactNode } from "react";

/**
 * Sección full-width sobre el lienzo acuarela (tema único claro).
 * `panel` → el contenido va sobre una tarjeta suave tipo "carta" (da ritmo y
 * contraste sin invertir el tema, respetando el Page Theme Lock).
 */
export default function Section({
  panel = false,
  center = true,
  children,
}: {
  panel?: boolean;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      style={{ position: "relative", zIndex: 1, paddingBlock: "var(--section-y)" }}
    >
      <div className={center ? "measure text-center" : "measure"}>
        {panel ? <div className="panel-card">{children}</div> : children}
      </div>
    </section>
  );
}
