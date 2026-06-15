"use client";

import { QRCodeSVG } from "qrcode.react";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FamiliaPublica } from "@/lib/types";

/** Pase de entrada con QR (solo en invitaciones por familia). */
export default function PaseQR({ familia }: { familia: FamiliaPublica }) {
  const personas = familia.pases === 1 ? "1 persona" : `${familia.pases} personas`;

  return (
    <Section panel>
      <Reveal>
        <SectionHeading label="Tu acceso" title="Pase de entrada" />
      </Reveal>

      <Reveal delay={0.08}>
        <p
          className="fg-soft"
          style={{
            fontSize: "var(--text-body)",
            maxWidth: "34ch",
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Muestra este código en la entrada. Válido para {personas}.
        </p>

        <div
          style={{
            display: "inline-block",
            background: "#ffffff",
            padding: 18,
            borderRadius: 18,
            marginTop: "1.5rem",
            boxShadow: "0 16px 40px -20px rgba(42,28,134,0.5)",
            border: "1px solid var(--panel-border)",
          }}
        >
          <QRCodeSVG
            value={familia.token}
            size={208}
            level="M"
            bgColor="#ffffff"
            fgColor="#2a1c86"
          />
        </div>

        {familia.validado && (
          <p
            className="label"
            style={{ marginTop: "1rem", color: "#2e8b6b" }}
          >
            Acceso ya validado
          </p>
        )}
      </Reveal>
    </Section>
  );
}
