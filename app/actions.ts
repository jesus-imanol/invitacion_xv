"use server";

import { createClient } from "@/lib/supabase/server";

/** RSVP público: confirma asistencia de una familia (RPC anon). */
export async function confirmarAsistencia(token: string, pases: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("confirmar_asistencia", {
    p_token: token,
    p_pases: pases,
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: Boolean(data) };
}
