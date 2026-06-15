import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { baseUrl } from "@/lib/links";
import AdminPanel from "@/components/admin/AdminPanel";
import type { AdminFamilia } from "@/components/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("familias")
    .select(
      "id, nombre, pases, token, confirmado, confirmado_pases, validado, validado_at, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <AdminPanel
      familias={(data ?? []) as AdminFamilia[]}
      baseUrl={baseUrl()}
      userEmail={user.email ?? ""}
    />
  );
}
