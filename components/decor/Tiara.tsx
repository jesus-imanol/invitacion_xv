/**
 * Tiara SVG — elemento firma (corona de princesa, no "montañitas").
 * Joya marquesa central + dos joyas redondas laterales sobre banda doble.
 * Metálico champán/dorado (combina con el sello). `id` único por instancia.
 */
export default function Tiara({
  className,
  id = "tiara-gold",
  glow = true,
}: {
  className?: string;
  id?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 66"
      className={className}
      role="img"
      aria-label="Tiara"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        ...(glow
          ? { filter: "drop-shadow(0 2px 8px rgba(198,166,103,0.55))" }
          : {}),
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e2b4" />
          <stop offset="0.5" stopColor="#cda968" />
          <stop offset="1" stopColor="#a07f3d" />
        </linearGradient>
      </defs>

      <g
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Banda doble */}
        <path d="M12 50 Q60 62 108 50" />
        <path d="M16 55 Q60 65 104 55" />
        {/* Joya marquesa central (vesica) */}
        <path d="M60 8 C70 24 70 34 60 50 C50 34 50 24 60 8 Z" />
        {/* Líneas internas de la marquesa (facetas) */}
        <path d="M60 14 L60 46 M53 29 L67 29" strokeWidth="1.4" />
        {/* Tallos laterales hacia las joyas */}
        <path d="M42 51 C40 40 39 34 40 29" />
        <path d="M78 51 C80 40 81 34 80 29" />
        {/* Arcos exteriores que enmarcan */}
        <path d="M24 52 C24 38 30 33 38 38" />
        <path d="M96 52 C96 38 90 33 82 38" />
      </g>

      {/* Joyas redondas */}
      <g fill={`url(#${id})`}>
        <circle cx="40" cy="25" r="4.2" />
        <circle cx="80" cy="25" r="4.2" />
        <circle cx="24" cy="50" r="2.4" />
        <circle cx="96" cy="50" r="2.4" />
        <circle cx="60" cy="6" r="2.6" />
      </g>
    </svg>
  );
}
