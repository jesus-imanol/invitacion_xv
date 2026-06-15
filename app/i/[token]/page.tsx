import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitacion from "@/components/Invitacion";
import { createClient } from "@/lib/supabase/server";
import { invitacion } from "@/data/invitacion";
import type { FamiliaPublica } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getFamilia(token: string): Promise<FamiliaPublica | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_familia_by_token", {
    p_token: token,
  });
  if (error || !data || data.length === 0) return null;
  const row = data[0];
  return {
    nombre: row.nombre,
    pases: row.pases,
    token,
    confirmado: row.confirmado,
    confirmadoPases: row.confirmado_pases,
    validado: row.validado,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const familia = await getFamilia(token);
  return {
    title: familia
      ? `${familia.nombre} · XV de ${invitacion.nombre}`
      : `XV de ${invitacion.nombre}`,
  };
}

export default async function InvitacionFamilia({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const familia = await getFamilia(token);
  if (!familia) notFound();
  return <Invitacion familia={familia} />;
}
