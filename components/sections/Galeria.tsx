"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Tiara from "@/components/decor/Tiara";
import { invitacion } from "@/data/invitacion";

export default function Galeria() {
  const fotos = invitacion.galeria;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) =>
      setOpen((cur) =>
        cur === null ? cur : (cur + dir + fotos.length) % fotos.length
      ),
    [fotos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  return (
    <Section center={false}>
      <Reveal>
        <SectionHeading label="Recuerdos" title="Galería" />
      </Reveal>

      {fotos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.6rem",
          }}
        >
          {fotos.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 0.05}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Abrir foto ${i + 1}`}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(159,192,238,0.18)",
                  cursor: "pointer",
                  padding: 0,
                  background: "var(--indigo-900)",
                }}
              >
                <Image
                  src={src}
                  alt={`Sol Angélica ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <p
            className="font-serif fg-soft"
            style={{
              textAlign: "center",
              fontStyle: "italic",
              marginBottom: "1.5rem",
              opacity: 0.85,
            }}
          >
            Las fotografías se agregarán muy pronto.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.6rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "3 / 4",
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                }}
              >
                <div style={{ width: "42%", opacity: 0.3 }}>
                  <Tiara id={`tiara-ph-${i}`} glow={false} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Lightbox */}
      {open !== null && fotos[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(7,4,20,0.92)",
            display: "grid",
            placeItems: "center",
            padding: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            style={closeBtn}
          >
            ×
          </button>
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Anterior"
                style={{ ...navBtn, left: "0.75rem" }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Siguiente"
                style={{ ...navBtn, right: "0.75rem" }}
              >
                ›
              </button>
            </>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(90vw, 600px)",
              aspectRatio: "3 / 4",
            }}
          >
            <Image
              src={fotos[open]}
              alt={`Sol Angélica ${open + 1}`}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}
    </Section>
  );
}

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  width: 44,
  height: 44,
  borderRadius: "9999px",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--white)",
  fontSize: "1.6rem",
  lineHeight: 1,
  cursor: "pointer",
};

const navBtn: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 44,
  height: 44,
  borderRadius: "9999px",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--white)",
  fontSize: "1.8rem",
  lineHeight: 1,
  cursor: "pointer",
};
