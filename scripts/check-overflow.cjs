// Prueba de render: detecta scroll horizontal / contenido que se sale del viewport.
// Uso: node scripts/check-overflow.cjs  (con el dev server corriendo en :3000)
const { chromium } = require("playwright-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3000";
const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440];

async function measure(page) {
  return await page.evaluate(() => {
    const se = document.scrollingElement || document.documentElement;
    const clientW = se.clientWidth;

    // ¿Se puede hacer scroll horizontal DE VERDAD? (señal real para el usuario)
    const prev = se.scrollLeft;
    se.scrollLeft = 99999;
    const canScrollX = se.scrollLeft > 0;
    se.scrollLeft = prev;

    // ¿Un elemento está dentro de un contenedor que recorta el overflow-x?
    const isClipped = (el) => {
      let p = el.parentElement;
      while (p && p !== document.body && p !== document.documentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === "auto" || ox === "scroll" || ox === "hidden" || ox === "clip") return true;
        p = p.parentElement;
      }
      return false;
    };

    const offenders = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if ((r.right > clientW + 1 || r.left < -1) && !isClipped(el)) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") || "").slice(0, 46),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
          pos: getComputedStyle(el).position,
        });
      }
    });
    offenders.sort((a, b) => b.right - a.right);
    return {
      innerWidth: window.innerWidth,
      clientW,
      canScrollX,
      overflow: canScrollX ? se.scrollWidth - clientW : 0,
      offenders: offenders.slice(0, 6),
    };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  let anyFail = false;

  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 780 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });

    const closed = await measure(page);

    // Abrir el sobre y esperar el reveal
    try {
      await page.click('button[aria-label="Abrir invitación"]', { timeout: 2000 });
      await page.waitForTimeout(2600);
    } catch {}

    const opened = await measure(page);

    // Scroll hasta el fondo en pasos, midiendo el peor caso
    let worst = opened;
    const steps = 8;
    const maxY = await page.evaluate(() => document.scrollingElement.scrollHeight);
    for (let s = 1; s <= steps; s++) {
      await page.evaluate((y) => window.scrollTo(0, y), (maxY * s) / steps);
      await page.waitForTimeout(150);
      const m = await measure(page);
      if (m.overflow > worst.overflow) worst = m;
    }

    const bad = worst.canScrollX || closed.canScrollX;
    if (bad) anyFail = true;
    const tag = bad ? "❌ SCROLL-H" : "✅ ok";
    console.log(
      `${tag}  w=${width}  cerrado=${closed.canScrollX ? "scrollea " + closed.overflow + "px" : "no"}  peor=${worst.canScrollX ? "scrollea " + worst.overflow + "px" : "no"}`
    );
    const reales = [closed, opened, worst].flatMap((m) => m.offenders);
    if (reales.length) {
      console.log(`      ⚠ elementos que exceden el viewport (posible recorte):`);
      reales.slice(0, 6).forEach((o) =>
        console.log(`      ↳ <${o.tag} class="${o.cls}"> right=${o.right} w=${o.w} pos=${o.pos}`)
      );
    }
    await ctx.close();
  }

  await browser.close();
  console.log(anyFail ? "\nRESULTADO: hay overflow horizontal en algún ancho ⬆" : "\nRESULTADO: sin scroll horizontal en ningún ancho ✅");
  process.exit(anyFail ? 1 : 0);
})();
