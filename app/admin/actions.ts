"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";

/** Alta de familia (organizador autenticado; RLS exige sesión). */
export async function crearFamilia(nombre: string, pases: number) {
  const supabase = await createClient();
  const token = nanoid(10);
  const { error } = await supabase
    .from("familias")
    .insert({ nombre: nombre.trim(), pases, token });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Editar nombre y pases de una familia. */
export async function editarFamilia(id: string, nombre: string, pases: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("familias")
    .update({ nombre: nombre.trim(), pases })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Eliminar familia. */
export async function eliminarFamilia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("familias").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Validar entrada por token (atómica, anti-doble-uso). */
export async function validarFamilia(token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("validar_familia", {
    p_token: token,
  });
  if (error) return { estado: "error" as const, error: error.message };
  const row = data?.[0];
  if (!row) return { estado: "no_existe" as const };
  return {
    estado: row.estado as "ok" | "ya_validada" | "no_existe",
    nombre: row.nombre as string | null,
    pases: row.pases as number | null,
    validadoAt: row.validado_at as string | null,
  };
}
