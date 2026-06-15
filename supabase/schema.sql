-- =============================================================================
-- Invitación XV — esquema Supabase
-- Pega TODO esto en: Supabase → SQL Editor → New query → Run
-- =============================================================================

-- 1) Tabla de familias -------------------------------------------------------
create table if not exists public.familias (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  pases           int  not null default 1 check (pases >= 1),
  token           text unique not null,
  confirmado      boolean not null default false,
  confirmado_pases int,
  confirmado_at   timestamptz,
  validado        boolean not null default false,
  validado_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.familias enable row level security;

-- Solo el organizador autenticado tiene acceso directo a la tabla.
drop policy if exists "admin full access" on public.familias;
create policy "admin full access" on public.familias
  for all to authenticated using (true) with check (true);

-- 2) RPC pública: obtener UNA familia por token (no expone las demás) ---------
create or replace function public.get_familia_by_token(p_token text)
returns table (
  nombre text,
  pases int,
  confirmado boolean,
  confirmado_pases int,
  validado boolean
)
language sql
security definer
set search_path = public
as $$
  select f.nombre, f.pases, f.confirmado, f.confirmado_pases, f.validado
  from public.familias f
  where f.token = p_token;
$$;

grant execute on function public.get_familia_by_token(text) to anon, authenticated;

-- 3) RPC pública: confirmar asistencia (RSVP) --------------------------------
create or replace function public.confirmar_asistencia(p_token text, p_pases int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_max int;
begin
  select pases into v_max from public.familias where token = p_token;
  if v_max is null then
    return false;
  end if;
  update public.familias
    set confirmado = true,
        confirmado_pases = greatest(0, least(p_pases, v_max)),
        confirmado_at = now()
    where token = p_token;
  return true;
end;
$$;

grant execute on function public.confirmar_asistencia(text, int) to anon, authenticated;

-- 4) RPC del organizador: validar entrada (atómica, anti-doble-uso) ----------
create or replace function public.validar_familia(p_token text)
returns table (
  estado text,        -- 'ok' | 'ya_validada' | 'no_existe'
  nombre text,
  pases int,
  validado_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.familias;
begin
  select * into v_row from public.familias where token = p_token for update;
  if not found then
    return query select 'no_existe'::text, null::text, null::int, null::timestamptz;
    return;
  end if;
  if v_row.validado then
    return query select 'ya_validada'::text, v_row.nombre, v_row.pases, v_row.validado_at;
    return;
  end if;
  update public.familias set validado = true, validado_at = now() where id = v_row.id;
  return query select 'ok'::text, v_row.nombre, v_row.pases, now();
end;
$$;

-- Solo el organizador autenticado puede validar entradas.
revoke execute on function public.validar_familia(text) from anon;
grant execute on function public.validar_familia(text) to authenticated;

-- =============================================================================
-- Después: Authentication → Users → Add user (correo + contraseña del organizador)
-- =============================================================================
