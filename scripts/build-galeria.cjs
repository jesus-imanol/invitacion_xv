// Copia una selección de fotos a public/galeria/ con nombres limpios y genera
// data/galeria.ts (con dimensiones reales para masonry sin distorsión).
// Uso: node scripts/build-galeria.cjs
const fs = require("fs");
const path = require("path");
const { createHash } = require("crypto");
const { imageSize } = require("image-size");

const hash = (buf) => createHash("md5").update(buf).digest("hex").slice(0, 8);

const SRC = "public/xv_sol_imagenes_quinceaniera/xv_sol_imagenes_quinceaniera";
const OUT_DIR = "public/galeria";

const featured = { file: "jardin.jpeg", slug: "destacada", alt: "Sol Angélica en el jardín" };

// [archivo original, slug, alt] — curación (se omiten casi-duplicados)
const items = [
  ["1.jpeg", "cuerpo-completo", "Sol Angélica en sus XV Años"],
  ["de frente.jpeg", "de-frente", "Sol Angélica de frente"],
  ["foto en balcon.jpeg", "balcon", "En el balcón"],
  ["mano en la cintura jdin.jpeg", "jardin-cintura", "En el jardín"],
  ["mirando el anillo.jpeg", "anillo", "Mirando el anillo"],
  ["de espalda ramo.jpeg", "espalda-ramo", "De espaldas con el ramo"],
  ["frente zoom.jpeg", "retrato", "Retrato"],
  ["pasillo mano cintura.jpeg", "pasillo-cintura", "En el pasillo"],
  ["de frente pasillo.jpeg", "pasillo-frente", "En el pasillo"],
  ["pasillo.jpeg", "pasillo", "En el pasillo"],
  ["pasillo 3.jpeg", "pasillo-3", "En el pasillo"],
  ["jardin ramo.jpeg", "jardin-ramo", "En el jardín con su ramo"],
  ["ramo.jpeg", "ramo", "Con su ramo"],
  ["ramo alzado.jpeg", "ramo-alzado", "Ramo en alto"],
  ["petalos.jpeg", "petalos", "Pétalos"],
  ["petalos volando.jpeg", "petalos-volando", "Pétalos al viento"],
  ["puerta.jpeg", "puerta", "En la puerta"],
  ["asillo 1.jpeg", "pasillo-1", "En el pasillo"],
];

// Limpia la carpeta cada corrida (el script es la fuente de verdad; sin huérfanos)
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

function copyAndSize(file, slug) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    console.log("⚠ FALTA:", file);
    return null;
  }
  const buf = fs.readFileSync(from);
  const { width, height } = imageSize(buf);
  // hash en el NOMBRE: URL única por contenido → nunca sirve caché viejo, sin query.
  const name = `${slug}.${hash(buf)}.jpeg`;
  fs.writeFileSync(path.join(OUT_DIR, name), buf);
  return { src: `/galeria/${name}`, w: width, h: height };
}

const fd = copyAndSize(featured.file, featured.slug);
const destacada = fd ? { ...fd, alt: featured.alt } : null;

const list = [];
for (const [file, slug, alt] of items) {
  const r = copyAndSize(file, slug);
  if (r) list.push({ ...r, alt });
}

const ts =
  `// Generado por scripts/build-galeria.cjs — NO editar a mano.\n` +
  `export type Foto = { src: string; w: number; h: number; alt: string };\n\n` +
  `export const galeriaDestacada: Foto${destacada ? "" : " | null"} = ${JSON.stringify(destacada, null, 2)};\n\n` +
  `export const galeria: Foto[] = ${JSON.stringify(list, null, 2)};\n`;
fs.writeFileSync("data/galeria.ts", ts);

console.log("Destacada:", destacada && `${destacada.src} (${destacada.w}x${destacada.h})`);
console.log("Fotos en galería:", list.length);
console.log("Orientación (V=vertical H=horizontal):", list.map((i) => (i.w > i.h ? "H" : "V")).join(""));
