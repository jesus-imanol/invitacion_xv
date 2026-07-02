"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { galeria, type Foto } from "@/data/galeria";

export default function Galeria() {
  const fotos: Foto[] = galeria;
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

  if (fotos.length === 0) return null;

  // Carrusel = primeras 7; editorial = el resto (con su índice global)
  const carrusel = fotos.slice(0, 7);
  const editorial = fotos.slice(7).map((f, k) => ({ foto: f, gi: 7 + k }));

  // Editorial: alterna 1 grande a todo lo ancho + 1 par
  const filas: { tipo: "full" | "par"; items: { foto: Foto; gi: number }[] }[] = [];
  for (let i = 0; i < editorial.length; ) {
    filas.push({ tipo: "full", items: [editorial[i]] });
    i += 1;
    if (i < editorial.length) {
      filas.push({ tipo: "par", items: editorial.slice(i, i + 2) });
      i += 2;
    }
  }

  return (
    <Section center={false}>
      <Reveal>
        <SectionHeading label="Recuerdos" title="Galería" />
      </Reveal>

      {/* Carrusel (swipe) */}
      <Reveal>
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: "0.7rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "0.25rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {carrusel.map((foto, i) => (
            <button
              key={foto.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Abrir ${foto.alt}`}
              className="gal-item"
              style={{
                flex: "0 0 80%",
                maxWidth: 360,
                scrollSnapAlign: "center",
                position: "relative",
                aspectRatio: "3 / 4",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid var(--panel-border)",
                boxShadow: "0 20px 50px -28px rgba(42,28,134,0.5)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 640px) 80vw, 360px"
                style={{ objectFit: "cover", objectPosition: "center 12%" }}
              />
            </button>
          ))}
        </div>
        <p className="label" style={{ textAlign: "center", marginTop: "0.75rem" }}>
          ‹ Desliza ›
        </p>
      </Reveal>

      {/* Editorial alternado */}
      <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {filas.map((fila, r) => (
          <Reveal key={r} delay={0.04}>
            {fila.tipo === "full" ? (
              <button
                type="button"
                onClick={() => setOpen(fila.items[0].gi)}
                aria-label={`Abrir ${fila.items[0].foto.alt}`}
                className="gal-item"
                style={{ ...tile, width: "100%", aspectRatio: "4 / 5" }}
              >
                <Image
                  src={fila.items[0].foto.src}
                  alt={fila.items[0].foto.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, 38rem"
                  style={{ objectFit: "cover", objectPosition: "center 15%" }}
                />
              </button>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.7rem" }}>
                {fila.items.map(({ foto, gi }) => (
                  <button
                    key={foto.src}
                    type="button"
                    onClick={() => setOpen(gi)}
                    aria-label={`Abrir ${foto.alt}`}
                    className="gal-item"
                    style={{ ...tile, width: "100%", aspectRatio: "3 / 4" }}
                  >
                    <Image
                      src={foto.src}
                      alt={foto.alt}
                      fill
                      sizes="(max-width: 640px) 46vw, 18rem"
                      style={{ objectFit: "cover", objectPosition: "center 15%" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && fotos[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fotos[open].alt}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(20,12,40,0.92)",
            display: "grid",
            placeItems: "center",
            padding: "1.5rem",
          }}
        >
          <button type="button" onClick={close} aria-label="Cerrar" style={closeBtn}>
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
              width: "min(90vw, 460px)",
              aspectRatio: `${fotos[open].w} / ${fotos[open].h}`,
              maxHeight: "82vh",
            }}
          >
            <Image
              src={fotos[open].src}
              alt={fotos[open].alt}
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

const tile: React.CSSProperties = {
  position: "relative",
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid var(--panel-border)",
  boxShadow: "0 16px 40px -28px rgba(42,28,134,0.5)",
  cursor: "pointer",
  padding: 0,
  display: "block",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  width: 44,
  height: 44,
  borderRadius: "9999px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
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
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "1.8rem",
  lineHeight: 1,
  cursor: "pointer",
};
