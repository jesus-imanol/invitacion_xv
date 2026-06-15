import MusicProvider from "@/components/music/MusicProvider";
import MusicToggle from "@/components/music/MusicToggle";
import AmbientBackground from "@/components/decor/AmbientBackground";
import EnvelopeIntro from "@/components/intro/EnvelopeIntro";
import Portada from "@/components/sections/Portada";
import Frase from "@/components/sections/Frase";
import Countdown from "@/components/sections/Countdown";
import Padrinos from "@/components/sections/Padrinos";
import Itinerario from "@/components/sections/Itinerario";
import Galeria from "@/components/sections/Galeria";
import Ubicacion from "@/components/sections/Ubicacion";
import Vestimenta from "@/components/sections/Vestimenta";
import Regalos from "@/components/sections/Regalos";
import PaseQR from "@/components/sections/PaseQR";
import Rsvp from "@/components/sections/Rsvp";
import Cierre from "@/components/sections/Cierre";
import type { FamiliaPublica } from "@/lib/types";

/** Composición de la invitación. Genérica (sin familia) o personalizada (con familia). */
export default function Invitacion({ familia }: { familia?: FamiliaPublica }) {
  return (
    <MusicProvider>
      <EnvelopeIntro para={familia?.nombre} />
      <AmbientBackground />
      <main className="relative" style={{ zIndex: 1 }}>
        <Portada />
        <Frase />
        <Countdown />
        <Padrinos />
        <Itinerario />
        <Galeria />
        <Ubicacion />
        <Vestimenta />
        <Regalos />
        {familia && <PaseQR familia={familia} />}
        <Rsvp familia={familia} />
        <Cierre />
      </main>
      <MusicToggle />
    </MusicProvider>
  );
}
