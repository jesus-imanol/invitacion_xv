# DESIGN.md — Invitación XV Años "Sol Angélica"

> **Fuente única de verdad.** Todo color, tipografía, espaciado, easing y duración del proyecto
> deriva de aquí. Los tokens viven en `app/globals.css` (`@theme` de Tailwind v4) y las fuentes
> en `app/layout.tsx`. No introduzcas valores hardcodeados fuera de estos tokens.

---

## 1. Concepto

Invitación digital de XV años como **landing premium**, mobile-first (se abre desde WhatsApp en
celular). Estética **clara, acuarela y femenina** (un solo tema, "Page Theme Lock") — azul del
vestido (`#1B0980`) llevado a tonos más suaves sobre base lavanda-blanco, con acento **rosa cuarzo**
femenino y metálico **champán** para el sello. El contraste/ritmo lo dan la textura acuarela y las
tarjetas tipo carta, NO invertir a oscuro.

> Historial: la v1 fue "premium de noche" (oscuro). A petición del cliente y alineado con
> `design-taste-frontend §4.11`, se migró a tema claro único más femenino.

Dos momentos:
1. **Intro:** sobre con moño centrado → al click se desata, abre y la carta sube → entra a la página.
2. **Landing de una sola columna** con todas las secciones del evento.

**Un solo "wow":** tiara en SVG sobre el nombre + halo radial (guiño a "Sol") + starfield sutil.
Toda la audacia visual vive en ese elemento; lo demás, callado.

---

## 2. Dials de diseño (design-taste-frontend)

| Dial | Valor | Implicación |
|---|---|---|
| **Variance** | media-alta | Layout con carácter, no plantilla. Tiara + halo como firma. |
| **Motion** | alta en intro / media en scroll | Coreografía del sobre rica; reveals de scroll contenidos. |
| **Density** | baja (aireada) | Ritmo vertical generoso, mucho aire entre secciones. |

---

## 3. Color (tokens)

Base casi negra con vida índigo; blanco para respirar; azul cielo de acento (flores del cartón
original); metálico **platino frío** (no oro) para lo elegante.

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#070414` | Base de la página (índigo casi negro) |
| `--indigo-900` | `#0E0830` | Superficies elevadas, fondos de sección |
| `--indigo-700` | `#150A52` | Bordes suaves, hovers |
| `--indigo` | `#1B0980` | Color del vestido: glows, acentos, gradientes |
| `--indigo-lit` | `#4A2BC9` | Highlight |
| `--sky` | `#9FC0EE` | Acento azul cielo (flores) |
| `--ice` | `#D6E6FB` | Texto secundario claro, detalles |
| `--white` | `#F6F8FE` | Texto principal |
| `--platinum` | `#D9DEEA` | Metálico frío (tiara, lacre, líneas finas) |
| `--platinum-dim` | `#8E96AC` | Texto terciario, labels apagados |

**Gradiente prismático** (SOLO para SVG/figuras — tiara, lacre — **nunca sobre texto**):
```
--prism: linear-gradient(110deg, #4A2BC9, #9FC0EE, #D6E6FB, #D9DEEA);
```

### Contraste (AA obligatorio)
- `--white` (#F6F8FE) sobre `--ink` (#070414) → ratio ~19:1 ✓
- `--ice` (#D6E6FB) sobre `--ink` → ~16:1 ✓
- `--platinum-dim` (#8E96AC) sobre `--ink` → ~7:1 ✓ (usar solo en texto ≥14px)
- Nunca texto `--indigo` sobre `--ink` (contraste insuficiente) — el índigo es para glows/figuras.

---

## 4. Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| **Nombre (script)** | `Pinyon Script` | Caligrafía formal copperplate. Grande, con halo/glow suave sobre fondo oscuro. |
| **Títulos (serif alto contraste)** | `Cormorant Garamond` | NO usar Playfair (vetado por las skills). Pesos 400/500/600. |
| **Cuerpo / labels** | `Jost` | Geométrica ligera. Labels en UPPERCASE con tracking amplio. |

Tokens de fuente (en `globals.css`): `--font-script`, `--font-serif`, `--font-sans`.

### Escala tipográfica (fluida, `clamp`)
| Token | clamp | Uso |
|---|---|---|
| `--text-name` | `clamp(3.5rem, 14vw, 7rem)` | Nombre en script (portada) |
| `--text-h1` | `clamp(2rem, 7vw, 3.25rem)` | Títulos de sección |
| `--text-h2` | `clamp(1.5rem, 5vw, 2.25rem)` | Subtítulos |
| `--text-body` | `clamp(1rem, 4vw, 1.125rem)` | Cuerpo |
| `--text-label` | `0.75rem` | Labels uppercase (tracking 0.2em) |

---

## 5. Espaciado y layout

- **Ancho de columna:** `--measure: min(92vw, 38rem)` centrado. Una sola columna full-width.
- **Ritmo vertical de sección:** `--section-y: clamp(4rem, 14vw, 8rem)` (padding top/bottom).
- **Gap interno:** escala de 8px → tokens `--space-1`..`--space-12` (multiplos de 0.25rem).
- Sin overflow horizontal nunca. Tap targets ≥ 44px.

---

## 6. Motion (emil-design-eng)

Animar **solo `transform` y `opacity`**. Respetar `prefers-reduced-motion` en TODA animación.

### Curvas custom (no usar `ease`/`linear`)
```
--ease-out:    cubic-bezier(.22, 1, .36, 1);   /* entradas, reveals */
--ease-in-out: cubic-bezier(.65, 0, .35, 1);   /* transformaciones bidireccionales */
--ease-overshoot: cubic-bezier(.34, 1.56, .64, 1); /* micro-overshoot solapa del sobre */
```

### Duraciones
| Token | ms | Uso |
|---|---|---|
| `--dur-fast` | 200 | Micro-interacciones (button press, toggle) |
| `--dur-base` | 450 | Reveals de scroll |
| `--dur-slow` | 700 | Movimientos grandes (carta sube) |

### Reveals de scroll
- `opacity 0→1` + `translateY 16px→0`, `--dur-base`, `--ease-out`, stagger 60-90ms entre hijos.
- Trigger una sola vez (no re-animar al volver a entrar).

---

## 7. Intro — sobre con moño (máximo craft)

Secuencia orquestada única (~1.8–2.4s), no animaciones sueltas. Sobre, listón, lacre y tiara en
**SVG** (no imágenes). El sobre es un **overlay encima** del DOM real (SEO/preview de WhatsApp ven
el contenido; si el JS falla, la página igual carga).

**Idle (sellado):** sobre perla/platino sobre `--ink`, centrado, flotación leve (translateY ±3px,
~4s loop) + shimmer ocasional. Moño/listón cruzado (platino) con nudo central. Línea handwritten
genérica + slot `para` para nombre por invitado. Hint "Toca para abrir".

**Al click (timeline con stagger):**
1. Moño se desata: lazos se separan/rotan y desvanecen, nudo escala a 0 (~0.45s).
2. Solapa superior rota 3D: `rotateX(180deg)`, `transform-origin: top`, contenedor con
   `perspective: 1400px` + `transform-style: preserve-3d` (~0.6s, `--ease-overshoot`).
3. Carta asciende del bolsillo (`translateY` arriba), z-index: back-flap < carta < bolsillo-frontal
   < solapa (~0.7s).
4. **Handoff:** carta escala/expande → portada, o fade del overlay revela portada. Ideal: shared
   element / FLIP donde el nombre script de la carta cae exactamente donde va el de la portada.

**Reglas:**
- El click del sobre es el **gesto** que (a) arranca la música (resuelve autoplay bloqueado) y
  (b) dispara el reveal del contenido.
- `prefers-reduced-motion`: salta la coreografía, fade directo del overlay (sigue requiriendo el
  click para el gesto de audio).

---

## 8. Estructura de la landing (orden)

Una columna, ritmo vertical constante, cada bloque entra con reveal al scroll:

1. **Portada** — "Acompáñanos a celebrar los XV Años" · tiara · **Sol Angélica** (script + halo) ·
   "Suárez Osuna" · fecha · hint scroll · starfield.
2. **Frase** de bienvenida.
3. **Cuenta regresiva** en vivo.
4. **Padres y padrinos** (Mis Padres / Padrino de Velación / Padrinos de Brindis).
5. **Itinerario** (timeline vertical: misa, recepción, vals, cena, baile).
6. **Galería** (`next/image` + lightbox).
7. **Ubicación** — iglesia + salón, cada uno con "Cómo llegar" (Google Maps).
8. **Código de vestimenta** (+ color reservado para la quinceañera).
9. **Mesa de regalos.**
10. **Confirmación (RSVP)** — botón WhatsApp con mensaje prellenado.
11. **Cierre** — nombre + fecha, despedida.
- **Control de música flotante** (play/pause) siempre visible.

---

## 9. Anti-patrones (prohibidos)

gradient text · serif genérico (Playfair) · paleta beige+brass "premium" · em-dashes en el copy
visible · glassmorphism por default · bordes con franja lateral · tres feature-cards iguales ·
strings inventados (auditar cada texto contra `data/invitacion.ts`).

---

## 10. Criterios de aceptación (impeccable)

- Mobile-first impecable; sin overflow horizontal; tap targets ≥ 44px.
- Foco visible por teclado; `prefers-reduced-motion` respetado en TODA animación; contraste AA.
- Animar solo `transform`/`opacity`; `next/image` en toda imagen; LCP bajo; sin layout shift;
  consola limpia.
- Música nunca autoplay con sonido sin gesto; botón mute/unmute siempre accesible.
- Copy auditado contra datos reales (cero inventado; sin em-dashes).

---

## 11. Arquitectura técnica

- **Next.js 16 (App Router) + TypeScript + Tailwind v4 (CSS-first `@theme`) + Framer Motion 12.**
- `next/image` para portada y galería (formato moderno, lazy, sizes responsivos).
- Todos los datos del evento en `data/invitacion.ts` (editar sin tocar componentes).
- Server Components por defecto; `"use client"` solo en lo interactivo (sobre, countdown, música,
  galería/lightbox, RSVP).
- OG dinámico con `next/og` (`app/opengraph-image.tsx`): fondo índigo, tiara, "Sol Angélica · XV
  Años", fecha.
- Personalización preparada para ambos modos: `generico` | `porInvitado` (ruta `app/i/[id]`).
