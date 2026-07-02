// Recorta el emblema circular de public/logo_xv.png a un cuadrado y lo guarda
// como app/icon.png (favicon de Next App Router). Uso: node scripts/make-favicon.cjs
const Jimp = require("jimp");

(async () => {
  const img = await Jimp.read("public/logo_xv.png");
  const size = Math.round(img.bitmap.height * 0.94); // recorta un poco de margen
  const x = Math.round((img.bitmap.width - size) / 2);
  const y = Math.round((img.bitmap.height - size) / 2);
  img.crop(x, y, size, size).resize(512, 512);
  await img.writeAsync("app/icon.png");
  console.log(`app/icon.png generado (${size}x${size} -> 512x512)`);
})();
