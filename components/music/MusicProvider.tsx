"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { invitacion } from "@/data/invitacion";

type MusicCtx = {
  hasMusic: boolean;
  playing: boolean;
  start: () => void; // arranca con fade-in (gesto del sobre)
  toggle: () => void; // play/pause manual
};

const Ctx = createContext<MusicCtx | null>(null);

export function useMusic(): MusicCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic debe usarse dentro de <MusicProvider>");
  return c;
}

const TARGET_VOL = 0.55;

export default function MusicProvider({ children }: { children: ReactNode }) {
  const src = invitacion.musica[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeId = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const fadeIn = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeId.current) window.clearInterval(fadeId.current);
    fadeId.current = window.setInterval(() => {
      const v = Math.min(TARGET_VOL, a.volume + 0.04);
      a.volume = v;
      if (v >= TARGET_VOL && fadeId.current) {
        window.clearInterval(fadeId.current);
        fadeId.current = null;
      }
    }, 90);
  }, []);

  const start = useCallback(() => {
    const a = audioRef.current;
    if (!a || playing) return;
    a.volume = 0;
    a.play()
      .then(() => {
        setPlaying(true);
        fadeIn();
      })
      .catch(() => {
        /* sin archivo o bloqueado: el botón flotante lo reintenta */
      });
  }, [playing, fadeIn]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => {
          setPlaying(true);
          fadeIn();
        })
        .catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [fadeIn]);

  return (
    <Ctx.Provider value={{ hasMusic: !!src, playing, start, toggle }}>
      {src && <audio ref={audioRef} src={src} loop preload="none" />}
      {children}
    </Ctx.Provider>
  );
}
