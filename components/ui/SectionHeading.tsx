/** Encabezado de sección: label + título serif + divisor con rombo. Usa tokens semánticos. */
export default function SectionHeading({
  label,
  title,
}: {
  label?: string;
  title: string;
}) {
  return (
    <div className="text-center" style={{ marginBottom: "2.75rem" }}>
      {label && (
        <p className="label" style={{ marginBottom: "0.85rem" }}>
          {label}
        </p>
      )}
      <h2
        className="font-serif fg"
        style={{ fontSize: "var(--text-h1)", letterSpacing: "0.02em", lineHeight: 1.15 }}
      >
        {title}
      </h2>
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          marginTop: "1.1rem",
        }}
      >
        <span
          style={{
            width: "clamp(2rem, 10vw, 3.5rem)",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--rule))",
          }}
        />
        <span
          style={{
            width: 5,
            height: 5,
            transform: "rotate(45deg)",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
        />
        <span
          style={{
            width: "clamp(2rem, 10vw, 3.5rem)",
            height: 1,
            background: "linear-gradient(90deg, var(--rule), transparent)",
          }}
        />
      </div>
    </div>
  );
}
