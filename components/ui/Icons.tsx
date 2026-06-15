import {
  Champagne,
  Church,
  Confetti,
  ForkKnife,
  MapPin,
  MusicNotes,
} from "@phosphor-icons/react/dist/ssr";

/** Mapeo de iconos del evento a Phosphor (librería, no hand-rolled). */
const MAP: Record<string, typeof Church> = {
  misa: Church,
  brindis: Champagne,
  vals: MusicNotes,
  cena: ForkKnife,
  baile: Confetti,
  pin: MapPin,
};

export function EventIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name] ?? MusicNotes;
  return (
    <Cmp
      weight="light"
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
