"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { invitacion } from "@/data/invitacion";

type Remaining = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  llego: boolean;
};

function diff(targetMs: number): Remaining {
  const now = Date.now();
  let d = Math.max(0, targetMs - now);
  const dias = Math.floor(d / 86400000);
  d -= dias * 86400000;
  const horas = Math.floor(d / 3600000);
  d -= horas * 3600000;
  const minutos = Math.floor(d / 60000);
  d -= minutos * 60000;
  const segundos = Math.floor(d / 1000);
  return { dias, horas, minutos, segundos, llego: targetMs - now <= 0 };
}

export default function Countdown() {
  const targetMs = new Date(invitacion.fechaISO).getTime();
  const [r, setR] = useState<Remaining | null>(null);

  useEffect(() => {
    setR(diff(targetMs));
    const id = window.setInterval(() => setR(diff(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const unidades: { valor: number | null; label: string }[] = [
    { valor: r?.dias ?? null, label: "Días" },
    { valor: r?.horas ?? null, label: "Horas" },
    { valor: r?.minutos ?? null, label: "Minutos" },
    { valor: r?.segundos ?? null, label: "Segundos" },
  ];

  return (
    <Section>
      <Reveal>
        <SectionHeading label="Cuenta regresiva" title="Para nuestro gran día" />
      </Reveal>

      <Reveal delay={0.1}>
        {r?.llego ? (
          <p
            className="font-script fg"
            style={{ fontSize: "var(--text-h1)", textShadow: "0 0 24px rgba(159,192,238,0.5)" }}
          >
            ¡Hoy es el día!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(0.4rem, 2vw, 1rem)",
            }}
          >
            {unidades.map((u) => (
              <div
                key={u.label}
                style={{
                  borderRadius: 14,
                  padding: "clamp(0.75rem, 3vw, 1.4rem) 0.25rem",
                  background: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="font-serif fg"
                  style={{
                    fontSize: "clamp(1.8rem, 9vw, 3rem)",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {u.valor === null ? "--" : String(u.valor).padStart(2, "0")}
                </div>
                <div
                  className="label"
                  style={{ marginTop: "0.6rem", fontSize: "0.6rem" }}
                >
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  );
}
