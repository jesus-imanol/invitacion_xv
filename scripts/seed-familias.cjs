// Alta inicial de familias desde la lista maestra editada por el cliente:
//   FUENTE:  public/list/familias_links.csv   (cols: #, Invitado, Pases, Sección)
//   SALIDA:  supabase/seed_familias.sql          (pegar en Supabase SQL Editor)
//            supabase/familias_con_links.csv     (nombre, sección, token, link)  <- NO pisa la fuente
// Uso: node scripts/seed-familias.cjs
const { randomBytes } = require("crypto");
const fs = require("fs");

const SRC = "public/list/familias_links.csv";
const OUT_SQL = "supabase/seed_familias.sql";
const OUT_CSV = "supabase/familias_con_links.csv";
const BASE = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

function parseLine(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}
function tok(n = 10) {
  let s = "";
  while (s.length < n) s += randomBytes(12).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
  return s.slice(0, n);
}
const escSql = (s) => String(s).replace(/'/g, "''");
const escCsv = (s) => `"${String(s).replace(/"/g, '""')}"`;

const raw = fs.readFileSync(SRC, "utf8").replace(/^﻿/, "").replace(/\r/g, "").trim();
const lines = raw.split("\n");
const I_NOMBRE = 1, I_PASES = 2, I_SECCION = 3;

const familias = [];
const flags = [];
lines.slice(1).forEach((l, li) => {
  const c = parseLine(l);
  const nombre = (c[I_NOMBRE] || "").trim();
  if (!nombre || /total/i.test(nombre)) return;
  const seccion = (c[I_SECCION] || "").trim();
  const rawP = (c[I_PASES] || "").trim();
  let pases = parseInt(rawP, 10);
  if (!Number.isFinite(pases) || pases < 1) {
    if (rawP !== "") flags.push(`fila ${li + 2}: pases inválido "${rawP}" en ${nombre} -> 1`);
    else if (!/individual/i.test(seccion)) flags.push(`fila ${li + 2}: ${nombre} (${seccion}) sin pases -> 1`);
    pases = 1;
  }
  familias.push({ nombre, pases, seccion, token: tok(10) });
});

const values = familias
  .map((f) => `  ('${escSql(f.nombre)}', ${f.pases}, '${f.token}', ${f.seccion ? `'${escSql(f.seccion)}'` : "null"})`)
  .join(",\n");
const sql =
  `-- Alta inicial de familias (generado desde public/list/familias_links.csv)\n` +
  `-- Requiere haber corrido antes supabase/schema.sql (crea la tabla).\n` +
  `alter table public.familias add column if not exists seccion text;\n` +
  `insert into public.familias (nombre, pases, token, seccion) values\n${values};\n`;
fs.writeFileSync(OUT_SQL, sql);

const outCsv =
  "#,nombre,pases,seccion,token,link\n" +
  familias
    .map((f, i) => `${i + 1},${escCsv(f.nombre)},${f.pases},${escCsv(f.seccion)},${f.token},${BASE}/i/${f.token}`)
    .join("\n") +
  "\n";
fs.writeFileSync(OUT_CSV, outCsv);

const total = familias.reduce((s, f) => s + f.pases, 0);
const bySec = {};
familias.forEach((f) => (bySec[f.seccion || "(sin sección)"] = (bySec[f.seccion || "(sin sección)"] || 0) + 1));
console.log(`Familias: ${familias.length} | Pases: ${total}`);
console.log("Por sección:", bySec);
console.log(flags.length ? "⚠ Avisos:" : "Sin avisos.");
flags.forEach((x) => console.log("  -", x));
