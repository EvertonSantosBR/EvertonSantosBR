// Painéis do README. Cada função devolve um SVG pronto (string).
// Todas recebem `m` (celular): false → viewBox de 1000px, true → 600px. O README entrega a
// versão de celular via <picture><source media="(max-width: 600px)">, então o texto dentro
// dos cards continua legível na tela pequena.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { C } from "./lib/theme.mjs";
import { Doc, frame, panel, chip, chipRow, image, stepPath, delay } from "./lib/svg.mjs";
import { measure, wrap, richLines } from "./lib/fonts.mjs";
import { ART, bitmap, size } from "./lib/pixels.mjs";
import { fit } from "./lib/sprites.mjs";
import {
  SECTIONS, MODES, SHEET, ABOUT, SKILLS, INVENTORY, LIBS, FEATURED, ARCHIVE, ACHIEVEMENTS, T,
} from "./content.mjs";

const pick = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v);
const widthOf = (m) => (m ? 600 : 1000);
const rule = (d, x, y, w, color) => d.add(`<rect x="${x}" y="${y}" width="${w}" height="2" fill="${color}"/>`);

/**
 * Monta um painel de altura automática: `build(d, box)` desenha e devolve o y do fim do conteúdo.
 * A moldura (papel ou noite) é desenhada por baixo depois que a altura é conhecida.
 */
function sheet(W, a11y, theme, build, { dots = false } = {}) {
  const body = new Doc(W, 0);
  const box = { x: 48, right: W - 56, w: W - 104, night: theme === "night" };
  const bottom = build(body, box);
  const H = Math.ceil(bottom + 56);
  const doc = new Doc(W, H, a11y);
  Object.assign(doc, { used: body.used, css: body.css, defs: body.defs });
  if (theme) panel(doc, theme);
  if (dots) {
    doc.def(`<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="10" y="10" width="3" height="3" fill="${C.line}"/></pattern>`);
    doc.add(`<path d="${stepPath(8, 8, W - 24, H - 24)}" fill="url(#dots)"/>`);
  }
  doc.add(...body.parts);
  return doc.render();
}

function pixelCircle(cx, cy, R, step, fill) {
  let out = "";
  for (let y = -R; y < R; y += step) {
    const yc = y + step / 2;
    const half = Math.round(Math.sqrt(R * R - yc * yc) / step) * step;
    if (half > 0) out += `<rect x="${cx - half}" y="${cy + y}" width="${2 * half}" height="${step}" fill="${fill}"/>`;
  }
  return `<g shape-rendering="crispEdges">${out}</g>`;
}

/** Linhas com **destaques**, entrando uma após a outra. Devolve o y da última linha. */
function paragraph(d, x, y, text, { size = 22, lh = 32, width, fill, bold = "bodyBold", face = "body", boldFill, start = 0, step = 0.08 }) {
  const lines = richLines(text, face, bold, size, width);
  lines.forEach((runs, i) => {
    d.add(`<g class="fade" ${delay(start + i * step)}>`);
    d.text(face, x, y + i * lh, size, runs.map((r) => ({ t: r.t, face: r.face, fill: r.face === bold ? boldFill ?? fill : fill })), { fill });
    d.add(`</g>`);
  });
  return y + (lines.length - 1) * lh;
}

const artTile = (d, art, x, y, s, px, { fill = C.paperDeep, border = C.ink } = {}) => {
  d.add(frame(x, y, s, s, { fill, border, bw: 2, shadow: null }));
  const a = ART[art], sz = size(a);
  d.add(bitmap(a, x + (s - sz.w * px) / 2, y + (s - sz.h * px) / 2, px));
};

// ─── Tela de título (o README inteiro dela é um link para a 1ª seção) ──
export function hero(lang, sprites, m) {
  const t = T[lang].hero, W = widthOf(m);
  return sheet(W, { title: t.title, desc: t.desc }, "paper", (d, b) => {
    const meta = m ? 15 : 17;
    d.text("mono", b.x, 80, meta, t.p1, { upper: true, fill: C.inkSoft, ls: 1.5 });
    d.text("mono", b.right, 80, meta, t.xp, { upper: true, fill: C.inkSoft, ls: 1.5, anchor: "end" });
    rule(d, b.x, 98, b.w, C.line);

    const [cx, cy, R] = m ? [W / 2 - 4, 276, 156] : [712, 290, 168];
    d.add(`<g class="pop">${pixelCircle(cx, cy, R, 12, C.yellow)}</g>`);
    const s = sprites["everton-dev"];
    d.add(`<g class="bob">`);
    if (s) {
      const f = fit(s, cx, cy - 6, R * 2.3, R * 2.3);
      d.add(image(s.href, f.x, f.y, f.w, f.h));
    } else d.text("pixelBold", cx, cy + (m ? 60 : 66), m ? 180 : 200, "ES", { anchor: "middle" });
    d.add(`</g>`);
    d.add(`<g class="bob" style="animation-delay:-.6s"><g class="spin">${bitmap(ART.coin, cx + R - 20, cy - R - 16, 5)}</g></g>`);
    d.add(`<g class="twinkle">${bitmap(ART.sparkle, cx - R - 6, cy - R + 50, 5)}</g>`);
    d.add(`<g class="twinkle" style="animation-delay:.9s">${bitmap(ART.star, cx + R - 4, cy + 60, 5)}</g>`);

    const [size, y1, y2, x2] = m ? [140, 556, 680, 72] : [172, 262, 418, 84];
    d.add(`<g class="fade" ${delay(0.1)}>`);
    d.text("display", b.x - 6, y1, size, "Everton", { ls: -5 });
    d.add(`</g><g class="fade" ${delay(0.25)}>`);
    d.text("display", b.x + x2, y2, size, "Santos", { ls: -5 });
    d.add(`</g>`);
    let y = y2 + 46;
    d.text("mono", b.x, y, m ? 15 : 17, t.coords, { upper: true, fill: C.muted, ls: 1 });
    rule(d, b.x, y + 22, b.w, C.line);
    y = paragraph(d, b.x, y + 66, t.tagline, { size: m ? 26 : 24, lh: m ? 36 : 34, width: b.w - 10, fill: C.ink, start: 0.4 });

    // Botão "Press start" (a imagem toda leva à primeira seção)
    const by = y + 34, pw = measure("pixel", t.press.toUpperCase(), 26, 1);
    const bw = pw + 76;
    d.add(`<g class="breathe">`);
    d.add(frame(b.x, by, bw, 56, { fill: C.yellow, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
    d.text("pixel", b.x + 22, by + 37, 26, t.press, { upper: true, ls: 1 });
    d.add(`<g class="blink">${bitmap(ART.arrowDown, b.x + 34 + pw, by + 20, 3)}</g>`);
    d.add(`</g>`);
    d.text("mono", b.x + bw + 26, by + 35, m ? 15 : 16, t.scroll, { upper: true, fill: C.muted, ls: 1.5 });
    return by + 62;
  }, { dots: true });
}

// ─── Banner de seção (número + título + subtítulo) ──────────────────
export function banner(lang, i, m) {
  const W = widthOf(m), [title, sub] = SECTIONS[i][lang], n = String(i + 1).padStart(2, "0");
  return sheet(W, { title: `${n} — ${title}. ${sub}` }, "paper", (d, b) => {
    const [bs, ts] = m ? [80, 58] : [92, 66];
    d.add(`<g class="pop">${frame(b.x, 46, bs, bs, { fill: C.yellow, border: C.ink, bw: 3, shadow: C.ink, sh: 5 })}`);
    d.text("pixelBold", b.x + bs / 2, 46 + bs / 2 + (m ? 15 : 17), m ? 40 : 46, n, { anchor: "middle" });
    d.add(`</g>`);
    const tx = b.x + bs + 26;
    d.add(`<g class="fade" ${delay(0.1)}>`);
    d.text("display", tx, m ? 106 : 104, ts, title, { ls: -1.5 });
    d.add(`</g>`);
    if (!m) {
      d.text("mono", b.right, 66, 14, `save ${n}/${String(SECTIONS.length).padStart(2, "0")}`, { upper: true, fill: C.muted, ls: 1.5, anchor: "end" });
      d.add(`<g class="fade" ${delay(0.2)}>`);
      d.text("body", tx, 140, 22, sub, { fill: C.inkSoft });
      d.add(`</g>`);
      return 146;
    }
    return paragraph(d, b.x, 172, sub, { size: 24, lh: 34, width: b.w, fill: C.inkSoft, start: 0.2 }) + 6;
  });
}

// ─── Ficha do personagem ────────────────────────────────────────────
export function character(lang, sprites, m) {
  const t = T[lang].character, W = widthOf(m);
  const modes = MODES.map((x) => x[lang]);
  const a11y = {
    title: `${t.title.join("")} ${modes.map((x) => x.title).join(", ")}`,
    desc: `${modes.map((x) => `${x.title}: ${x.text}`).join(" ")} ${SHEET[lang].map(([k, v]) => `${k}: ${v}`).join(". ")}.`,
  };
  return sheet(W, a11y, "night", (d, b) => {
    // Crossfade entre os 3 modos (9s) + barra de progresso do modo atual
    d.style(`.mode{opacity:0;animation:mode 9s linear infinite}
.prog{animation:prog 9s linear infinite;transform-box:fill-box;transform-origin:left}
.k1{animation-delay:-6s}.k2{animation-delay:-3s}
@keyframes mode{0%{opacity:0}4%{opacity:1}30%{opacity:1}34%,100%{opacity:0}}
@keyframes prog{0%{transform:scaleX(0)}33.3%,100%{transform:scaleX(1)}}
.mode.k0{opacity:1}`);
    const ts = 56;
    if (m) {
      d.text("display", b.x, 106, ts, t.title[0].trim(), { fill: C.onNight, ls: -1.5 });
      d.add(`<g transform="translate(${b.x + 4} 166) skewX(-10)">`);
      const w2 = d.text("display", 0, 0, ts, t.title[1], { fill: C.yellow, ls: -1.5 });
      d.add(`</g>`);
      d.text("display", b.x + w2 + 12, 166, ts, t.title[2], { fill: C.onNight, ls: -1.5 });
    } else {
      let x = b.x;
      x += d.text("display", x, 112, ts, t.title[0], { fill: C.onNight, ls: -1.5 });
      d.add(`<g transform="translate(${x + 4} 112) skewX(-10)">`);
      const w2 = d.text("display", 0, 0, ts, t.title[1], { fill: C.yellow, ls: -1.5 });
      d.add(`</g>`);
      d.text("display", x + w2 + 8, 112, ts, t.title[2], { fill: C.onNight, ls: -1.5 });
    }

    // Palco
    const st = m ? { x: b.x, y: 200, w: b.w, h: 404 } : { x: b.x, y: 148, w: 372, h: 416 };
    d.add(frame(st.x, st.y, st.w, st.h, { fill: C.night2, border: C.night3, shadow: C.plum, sh: 6 }));
    d.add(`<rect x="${st.x + 20}" y="${st.y + 26}" width="8" height="8" fill="${C.yellow}" class="blink"/>`);
    d.text("mono", st.x + 38, st.y + 35, m ? 16 : 15, t.name, { fill: C.onNightMuted, ls: 1 });
    const floor = st.y + st.h - 112;
    MODES.forEach((mode, i) => {
      const sp = sprites[mode.sprite] ?? sprites["everton-dev"];
      d.add(`<g class="mode k${i}"><g class="bob" style="animation-delay:${-i * 0.7}s">`);
      if (sp) {
        const f = fit(sp, st.x + st.w / 2, (st.y + 48 + floor) / 2, 300, floor - st.y - 56);
        d.add(image(sp.href, f.x, f.y, f.w, f.h));
      } else d.add(bitmap(ART[["briefcase", "blocks", "book"][i]], st.x + st.w / 2 - (i === 1 ? 56 : 48), (st.y + floor) / 2 - 20, 8));
      d.add(`</g></g>`);
    });
    // Indicador de modo (não é botão: troca sozinho)
    const iy = floor + 34, slotW = (st.w - 40) / 3;
    rule(d, st.x + 20, floor, st.w - 40, C.night3);
    modes.forEach((mo, i) => {
      const x = st.x + 20 + i * slotW;
      d.add(`<rect x="${x}" y="${iy - 12}" width="12" height="12" fill="${C.night3}"/>`);
      d.text("mono", x + 20, iy, m ? 18 : 16, mo.tab, { fill: C.onNightMuted });
      d.add(`<g class="mode k${i}"><rect x="${x}" y="${iy - 12}" width="12" height="12" fill="${C.yellow}"/>`);
      d.text("monoBold", x + 20, iy, m ? 18 : 16, mo.tab, { fill: C.onNight });
      d.add(`</g>`);
    });
    d.add(`<rect x="${st.x + 20}" y="${iy + 22}" width="${st.w - 40}" height="6" fill="${C.night3}"/>`);
    MODES.forEach((_, i) => d.add(`<g class="mode k${i}"><rect class="prog k${i}" x="${st.x + 20}" y="${iy + 22}" width="${st.w - 40}" height="6" fill="${C.yellow}"/></g>`));
    d.text("mono", st.x + st.w - 20, iy + 56, 13, t.auto, { upper: true, fill: C.onNightMuted, ls: 1, anchor: "end" });

    // Texto do modo + atributos
    const rx = m ? b.x : 460, rw = b.right - rx;
    const top = m ? st.y + st.h + 56 : 186, size = m ? 24 : 21, lh = m ? 34 : 30;
    const lines = modes.map((mo) => wrap("body", mo.text, size, rw));
    modes.forEach((mo, i) => {
      d.add(`<g class="mode k${i}">`);
      d.text("mono", rx, top, m ? 17 : 16, `${t.mode} 0${i + 1}/03`, { upper: true, fill: C.yellow, ls: 2 });
      d.text("display", rx, top + 50, m ? 44 : 42, mo.title, { fill: C.onNight, ls: -1 });
      lines[i].forEach((l, j) => d.text("body", rx, top + 94 + j * lh, size, l, { fill: C.onNightMuted }));
      d.add(`</g>`);
    });
    const gy = m ? top + 94 + Math.max(...lines.map((l) => l.length)) * lh + 10 : 404;
    const ch = m ? 92 : 80, cw = rw / 2;
    d.add(`<g fill="${C.lineNight}"><rect x="${rx}" y="${gy}" width="${rw}" height="2"/><rect x="${rx}" y="${gy + ch}" width="${rw}" height="2"/><rect x="${rx}" y="${gy + 2 * ch}" width="${rw}" height="2"/><rect x="${rx + cw}" y="${gy}" width="2" height="${2 * ch}"/></g>`);
    SHEET[lang].forEach(([k, v], i) => {
      const cx = rx + (i % 2) * cw + (i % 2 ? 22 : 0), cy = gy + Math.floor(i / 2) * ch;
      d.add(`<g class="fade" ${delay(0.15 * i)}>`);
      d.text("mono", cx, cy + 30, m ? 15 : 14, k, { upper: true, fill: C.onNightMuted, ls: 2 });
      d.text("bodyBold", cx, cy + (m ? 72 : 66), m ? 29 : 28, v, { fill: C.onNight });
      d.add(`</g>`);
    });
    return Math.max(st.y + st.h, gy + 2 * ch);
  });
}

// ─── Caixa de diálogo "sobre mim" ───────────────────────────────────
export function dialog(lang, sprites, m) {
  const t = T[lang].dialog, W = widthOf(m);
  const plain = ABOUT[lang].map((p) => p.replace(/\*\*/g, "")).join(" ");
  return sheet(W, { title: `${t.title}: ${plain}` }, "paper", (d, b) => {
    const nw = measure("pixelBold", t.name.toUpperCase(), 22, 1) + 32;
    d.add(frame(b.x, 44, nw, 42, { fill: C.yellow, border: C.ink, bw: 3, shadow: null }));
    d.text("pixelBold", b.x + 16, 73, 22, t.name, { upper: true, ls: 1 });
    d.text("mono", b.right, 72, 14, t.title, { upper: true, fill: C.muted, ls: 1.5, anchor: "end" });
    rule(d, b.x, 98, b.w, C.line);

    const ps = m ? 132 : 168, py = 124;
    d.add(frame(b.x, py, ps, ps, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: C.ink, sh: 5 }));
    const s = sprites["modo-dev"] ?? sprites["everton-dev"];
    d.add(`<g class="bob">`);
    if (s) {
      const f = fit(s, b.x + ps / 2, py + ps / 2, ps - 16, ps - 16);
      d.add(image(s.href, f.x, f.y, f.w, f.h));
    } else d.text("pixelBold", b.x + ps / 2, py + ps / 2 + (m ? 22 : 28), m ? 64 : 80, "ES", { anchor: "middle" });
    d.add(`</g>`);

    const tx = m ? b.x : b.x + ps + 32, tw = b.right - tx;
    const size = m ? 24 : 22, lh = m ? 36 : 33;
    let y = m ? py + ps + 54 : py + 26, start = 0.1;
    for (const p of ABOUT[lang]) {
      const lines = richLines(p, "body", "bodyBold", size, tw).length;
      y = paragraph(d, tx, y, p, { size, lh, width: tw, fill: C.ink, start, step: 0.12 }) + lh + 10;
      start += lines * 0.12;
    }
    d.add(`<g class="blink">${bitmap(ART.arrowDown, b.right - 27, y - lh + 4, 3)}</g>`);
    return Math.max(y - lh + 22, py + ps + 6);
  });
}

// ─── Habilidades de classe ──────────────────────────────────────────
export function skills(lang, m) {
  const t = T[lang].skills, W = widthOf(m);
  return sheet(W, { title: `${t.title}: ${SKILLS.map((s) => `${s[lang][0]} — ${s[lang][1]}`).join(" ")}` }, "night", (d, b) => {
    d.text("display", b.x, 108, m ? 50 : 52, t.title, { fill: C.onNight, ls: -1.5 });
    rule(d, b.x, 134, b.w, C.lineNight);
    let y = 166;
    SKILLS.forEach((s, i) => {
      const [name, desc] = s[lang];
      const tile = 92, tx = b.x + tile + 28, size = m ? 22 : 20, lh = m ? 31 : 29;
      const lines = wrap("body", desc, size, b.right - tx);
      d.add(`<g class="fade" ${delay(0.15 * i)}>`);
      artTile(d, s.art, b.x, y, tile, 6, { fill: C.paperDeep, border: C.night3 });
      d.text("bodyBold", tx, y + 30, m ? 28 : 26, name, { fill: C.yellow });
      lines.forEach((l, j) => d.text("body", tx, y + 66 + j * lh, size, l, { fill: C.onNightMuted }));
      d.add(`</g>`);
      const h = Math.max(tile, 66 + (lines.length - 1) * lh + 8);
      y += h + 30;
      if (i < SKILLS.length - 1) rule(d, b.x, y - 16, b.w, C.lineNight);
    });
    return y - 30;
  });
}

// ─── Inventário ─────────────────────────────────────────────────────
export async function inventory(lang, iconDir, m) {
  const t = T[lang].inventory, W = widthOf(m);
  const total = INVENTORY.reduce((a, c) => a + c.items.length, 0);
  const a11y = { title: `${t.title}: ${INVENTORY.map((c) => `${c[lang]} — ${c.items.map((i) => i[1]).join(", ")}`).join("; ")}; ${LIBS[lang]} — ${LIBS.items.join(", ")}` };
  const icons = {};
  for (const c of INVENTORY) for (const [id] of c.items) if (!id.startsWith("art:")) {
    const svg = await readFile(join(iconDir, `${id}.svg`), "utf8");
    icons[id] = svg.replace(/id="([^"]+)"/g, `id="${id}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`).replace(/href="#([^"]+)"/g, `href="#${id}-$1"`);
  }
  return sheet(W, a11y, "paper", (d, b) => {
    d.text("display", b.x, 110, m ? 54 : 56, t.title, { ls: -1.5 });
    d.text("mono", b.right, 106, m ? 14 : 16, t.count(total), { upper: true, fill: C.muted, ls: 1.5, anchor: "end" });
    rule(d, b.x, 132, b.w, C.line);
    const slot = m ? 72 : 84, gap = m ? 14 : 22, x0 = m ? b.x : 248;
    let y = 164, k = 0;
    const label = (cat, yy) => {
      d.add(bitmap(ART.cursor, b.x, yy - 22, 3));
      const lw = d.text("monoBold", b.x + 26, yy, m ? 19 : 17, cat, { upper: true, ls: 1 });
      return lw;
    };
    for (const cat of INVENTORY) {
      let sy = y;
      if (m) {
        const lw = label(cat[lang], y + 22);
        if (cat.training) d.text("mono", b.x + 40 + lw, y + 22, 16, `· ${t.training}`, { fill: C.muted });
        sy = y + 46;
      } else {
        label(cat[lang], y + 46);
        if (cat.training) d.text("mono", b.x + 26, y + 70, 14, t.training, { fill: C.muted, ls: 1 });
      }
      cat.items.forEach(([id, name], i) => {
        const x = x0 + i * (slot + gap);
        d.add(`<g class="pop" ${delay(0.04 * k++)}>`);
        d.add(cat.training
          ? frame(x, sy, slot, slot, { fill: C.paperDeep, border: C.muted, bw: 3, shadow: null, dashed: true })
          : frame(x, sy, slot, slot, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: C.ink, sh: 5 }));
        const op = cat.training ? ` opacity=".55"` : "";
        if (id.startsWith("art:")) {
          const art = ART[id.slice(4)], sz = size(art), px = m ? 3 : 4;
          d.add(`<g${op}>${bitmap(art, x + (slot - sz.w * px) / 2, sy + (slot - sz.h * px) / 2, px)}</g>`);
        } else {
          const pad = m ? 12 : 15;
          d.add(`<svg x="${x + pad}" y="${sy + pad}" width="${slot - 2 * pad}" height="${slot - 2 * pad}" viewBox="0 0 256 256"${op}>${icons[id]}</svg>`);
        }
        d.text("mono", x + slot / 2, sy + slot + (m ? 26 : 28), m ? 13 : 15, name, { anchor: "middle", fill: C.inkSoft });
        d.add(`</g>`);
      });
      y = sy + slot + (m ? 56 : 44);
    }
    // Consumíveis (bibliotecas)
    rule(d, b.x, y - 6, b.w, C.line);
    y += 30;
    if (m) {
      label(LIBS[lang], y);
      return chipRow(d, b.x, y + 22, LIBS.items, b.right, { size: 16 });
    }
    label(LIBS[lang], y + 6);
    return chipRow(d, x0, y - 18, LIBS.items, b.right, { size: 15 });
  });
}

// ─── Missão principal (PeopleOS) ────────────────────────────────────
export function featured(lang, m) {
  const p = FEATURED, t = p[lang], W = widthOf(m);
  const a11y = {
    title: `${p.n} · ${p.title} — ${t.kind}`,
    desc: `${t.desc.replace(/\*\*/g, "")} ${t.stats.map(([n, l]) => `${n} ${l}`).join(", ")}. Stack: ${p.stack.join(", ")}. ${t.status}.`,
  };
  return sheet(W, a11y, "night", (d, b) => {
    const colR = m ? b.right : 612;
    const nw = measure("pixelBold", p.n, 20) + 24;
    d.add(frame(b.x, 46, nw, 36, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
    d.text("pixelBold", b.x + 12, 71, 20, p.n);
    d.text("mono", b.x + nw + 16, 70, 16, t.tag, { upper: true, fill: C.yellow, ls: 2 });
    d.add(`<g class="fade">`);
    d.text("display", b.x - 4, 172, 92, p.title, { fill: C.onNight, ls: -2.5 });
    d.add(`</g>`);
    let y = 172;
    for (const l of wrap("body", t.kind, m ? 24 : 22, colR - b.x)) d.text("body", b.x, (y += m ? 40 : 38), m ? 24 : 22, l, { fill: C.onNightMuted });
    y = paragraph(d, b.x, y + 50, t.desc, { size: m ? 23 : 20, lh: m ? 34 : 30, width: colR - b.x, fill: C.onNight, boldFill: C.yellow, start: 0.2 });

    y += 76;
    const colW = (colR - b.x) / 3;
    t.stats.forEach(([n, label], i) => {
      const x = b.x + i * colW;
      d.add(`<g class="pop" ${delay(0.3 + i * 0.12)}>`);
      d.text("pixelBold", x, y, m ? 52 : 50, n, { fill: C.yellow });
      wrap("body", label, m ? 19 : 17, colW - 18).forEach((l, j) => d.text("body", x, y + 32 + j * 23, m ? 19 : 17, l, { fill: C.onNightMuted }));
      d.add(`</g>`);
    });
    y = chipRow(d, b.x, y + 92, p.stack, colR, { night: true, size: m ? 16 : 15 }) + 40;
    d.add(`<rect x="${b.x}" y="${y - 10}" width="10" height="10" fill="${C.yellow}" class="blink"/>`);
    d.text("mono", b.x + 22, y, m ? 14 : 15, t.status, { upper: true, fill: C.onNightMuted, ls: 1 });

    // "Botão" interno: a imagem toda leva ao estudo de caso
    let cueY = y + 52;
    if (!m) {
      // Holerite em pixel art (valores em barras: nada de números inventados)
      const sx = 652, sy = 50, sw = 268, sh = 452;
      d.add(`<g class="fade" ${delay(0.3)}>`);
      d.add(frame(sx, sy, sw, sh, { fill: C.paper, border: C.ink, bw: 4, shadow: C.yellow, sh: 10 }));
      d.text("pixelBold", sx + 24, sy + 50, 26, t.slip.title);
      d.add(frame(sx + sw - 72, sy + 26, 48, 28, { fill: C.ink, border: null, shadow: null, s: 2 }));
      d.text("monoBold", sx + sw - 48, sy + 46, 13, "PDF", { fill: C.yellow, anchor: "middle" });
      d.add(`<rect x="${sx + 24}" y="${sy + 72}" width="${sw - 48}" height="2" fill="${C.ink}"/>`);
      const bars = [84, 60, 46, 38, 52];
      t.slip.rows.forEach((label, i) => {
        const ry = sy + 112 + i * 46, neg = i >= 3;
        d.text("mono", sx + 24, ry, 13, label, { fill: C.inkSoft });
        d.add(`<rect class="grow" ${delay(0.6 + i * 0.1)} x="${sx + sw - 24 - bars[i]}" y="${ry - 10}" width="${bars[i]}" height="10" fill="${neg ? C.muted : C.ink}"/>`);
        if (neg) d.add(`<rect x="${sx + sw - 38 - bars[i]}" y="${ry - 6}" width="8" height="3" fill="${C.muted}"/>`);
      });
      const ny = sy + 112 + 5 * 46;
      d.add(`<rect x="${sx + 24}" y="${ny - 26}" width="${sw - 48}" height="3" fill="${C.ink}"/><rect x="${sx + 24}" y="${ny - 20}" width="${sw - 48}" height="3" fill="${C.ink}"/>`);
      d.add(`<rect x="${sx + 20}" y="${ny - 4}" width="${sw - 40}" height="34" fill="${C.yellow}"/>`);
      d.text("monoBold", sx + 30, ny + 19, 14, t.slip.net);
      d.add(`<rect class="grow" ${delay(1.2)} x="${sx + sw - 130}" y="${ny + 8}" width="96" height="12" fill="${C.ink}"/>`);
      let bx = sx + 24;
      [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2].forEach((wd, i) => {
        if (i % 2 === 0) d.add(`<rect x="${bx}" y="${sy + sh - 66}" width="${wd * 3}" height="34" fill="${C.ink}"/>`);
        bx += wd * 3 + 2;
      });
      d.add(`</g>`);
      cueY = Math.max(y, sy + sh + 50);
    }
    const cx = m ? b.x : 652;
    const cw = d.text("monoBold", cx, cueY, m ? 16 : 16, t.open, { upper: true, fill: C.yellow, ls: 1 });
    d.add(`<g class="nudge">${bitmap(ART.cursor, cx + cw + 12, cueY - 17, 2)}</g>`);
    return cueY + 6;
  });
}

// ─── Missões secundárias ────────────────────────────────────────────
export function quest(q, lang, meta, m) {
  const t = q[lang], title = pick(q.title, lang), labels = T[lang].quest, W = widthOf(m);
  const a11y = { title: `${q.n} · ${title} — ${t.kind}`, desc: `${t.desc.replace(/\*\*/g, "")} Stack: ${q.stack.join(", ")}.${t.credit ? ` ${t.credit}.` : ""}` };
  return sheet(W, a11y, "paper", (d, b) => {
    const right = W - 52;
    const tile = m ? 132 : 152;
    d.add(`<g class="pop">`);
    artTile(d, q.art, 36, 36, tile, m ? 6 : 7, { border: C.ink });
    d.add(`</g>`);
    const x = m ? 40 : 220, hx = m ? 36 + tile + 20 : 220;
    const nw = measure("pixelBold", q.n, 18) + 20;
    d.add(frame(hx, 46, nw, 32, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
    d.text("pixelBold", hx + 10, 68, 18, q.n);
    if (meta?.stars) {
      const sw = d.text("pixelBold", right, 70, 22, String(meta.stars), { anchor: "end" });
      d.add(bitmap(ART.starFull, right - sw - 34, 54, 3));
    }
    let y;
    if (m) {
      wrap("mono", t.kind.toUpperCase(), 16, right - hx, 0.5).forEach((l, j) => d.text("mono", hx, 112 + j * 26, 16, l, { fill: C.inkSoft, ls: 0.5 }));
      y = 36 + tile + 64;
      for (const l of wrap("display", title, 56, right - x, -1.5)) { d.text("display", x - 2, y, 56, l, { ls: -1.5 }); y += 56; }
      y -= 56;
    } else {
      d.text("mono", hx + nw + 14, 68, 15, t.kind, { upper: true, fill: C.inkSoft, ls: 1 });
      y = 136;
      d.add(`<g class="fade">`);
      d.text("display", x - 2, y, 54, title, { ls: -1.5 });
      d.add(`</g>`);
    }
    y = paragraph(d, x, y + (m ? 46 : 40), t.desc, { size: m ? 23 : 20, lh: m ? 33 : 29, width: right - x, fill: C.inkSoft, boldFill: C.ink, start: 0.15 });
    y = chipRow(d, x, y + 22, q.stack, right, { size: m ? 17 : 15 }) + 20;
    // Rodapé do card: crédito de autoria (projeto de outra pessoa) ou "abrir missão"
    if (t.credit) {
      const tw = measure("mono", t.credit.toUpperCase(), 15, 1) + 28;
      d.add(frame(x, y, tw, 36, { fill: C.plum, border: null, shadow: null, s: 2 }));
      d.text("mono", x + 14, y + 24, 15, t.credit, { upper: true, fill: C.onNight, ls: 1 });
    }
    const ow = measure("monoBold", labels.open.toUpperCase(), 16, 1);
    const ox = t.credit ? right - ow - 24 : x;
    if (t.credit && m) {
      y += 52;
      d.text("monoBold", x, y + 24, 16, labels.open, { upper: true, ls: 1 });
      d.add(`<g class="nudge">${bitmap(ART.cursor, x + ow + 12, y + 7, 2)}</g>`);
    } else {
      d.text("monoBold", ox, y + 24, 16, labels.open, { upper: true, ls: 1 });
      d.add(`<g class="nudge">${bitmap(ART.cursor, ox + ow + 12, y + 7, 2)}</g>`);
    }
    return y + 36;
  });
}

// ─── Cartuchos do arquivo ───────────────────────────────────────────
export function archiveCard(a, lang, m) {
  const W = widthOf(m);
  return sheet(W, { title: `${a.repo} (${a.year}, ${a.stack}): ${a[lang]}` }, "paper", (d, b) => {
    const right = W - 52, tile = m ? 84 : 96;
    artTile(d, "cartridge", 36, 36, tile, m ? 5 : 6);
    const x = 36 + tile + 24;
    d.text("display", x, 84, m ? 40 : 42, a.repo, { ls: -1 });
    const meta = `${a.year} · ${a.stack}`;
    if (m) {
      d.text("mono", x, 116, 16, meta, { upper: true, fill: C.inkSoft, ls: 1 });
      return paragraph(d, 40, 36 + tile + 46, a[lang], { size: 22, lh: 32, width: right - 40, fill: C.inkSoft }) + 4;
    }
    d.text("mono", right, 60, 14, meta, { upper: true, fill: C.inkSoft, ls: 1, anchor: "end" });
    const end = paragraph(d, x, 122, a[lang], { size: 19, lh: 28, width: right - x, fill: C.inkSoft });
    return Math.max(end + 4, 36 + tile - 20);
  });
}

// ─── Mapa da missão: fluxo de uma requisição no PeopleOS ────────────
export function flow(lang, m) {
  const f = T[lang].flow, W = widthOf(m);
  const nodes = [f.client, "Routes", "Middlewares", "Controllers", "Services", "Repositories", "MySQL"];
  return sheet(W, { title: `${f.title}: ${nodes.join(" → ")}; Services → ${f.audit}, ${f.pdf}` }, "night", (d, b) => {
    const titleLines = wrap("mono", f.title.toUpperCase(), 15, b.w, 1.5);
    titleLines.forEach((l, i) => d.text("mono", b.x, 72 + i * 24, 15, l, { fill: C.yellow, ls: 1.5 }));
    const top = 72 + titleLines.length * 24 + 30;
    const node = (x, y, w, h, label, accent, size) => {
      d.add(frame(x, y, w, h, { fill: accent ? C.yellow : C.night2, border: accent ? C.ink : C.night3, bw: 3, shadow: null, s: 3 }));
      const lines = wrap("mono", label, size, w - 18);
      lines.forEach((l, j) => d.text("mono", x + w / 2, y + h / 2 + size * 0.38 + (j - (lines.length - 1) / 2) * (size + 2), size, l, { anchor: "middle", fill: accent ? C.ink : C.onNight }));
    };
    const side = (x, y, w, label, size) => {
      d.add(frame(x, y, w, 46, { fill: C.plum, border: C.night3, bw: 3, shadow: null, s: 3 }));
      d.text("mono", x + w / 2, y + 29, size, label, { anchor: "middle", fill: C.onNight });
    };
    if (m) {
      // Vertical: cadeia à esquerda, ramificação à direita de Services
      const nw = 250, nh = 50, gap = 30;
      nodes.forEach((label, i) => {
        const y = top + i * (nh + gap);
        d.add(`<g class="fade" ${delay(i * 0.08)}>`);
        node(b.x, y, nw, nh, label, i === 0 || i === nodes.length - 1, 16);
        d.add(`</g>`);
        if (i < nodes.length - 1) d.add(`<rect x="${b.x + nw / 2 - 1}" y="${y + nh}" width="3" height="${gap}" fill="${C.onNightMuted}"/>`);
      });
      d.text("mono", b.x + nw + 24, top + 2 * (nh + gap) + 31, 14, f.note.split(" · ").slice(0, 2).join(" · "), { fill: C.onNightMuted });
      const sy = top + 4 * (nh + gap), sx = b.x + nw + 40, sw = b.right - sx;
      d.add(`<g fill="${C.onNightMuted}"><rect x="${b.x + nw}" y="${sy + nh / 2 - 1}" width="${sx - b.x - nw}" height="3"/><rect x="${sx - 20}" y="${sy - 40}" width="3" height="${120}"/><rect x="${sx - 20}" y="${sy - 40}" width="20" height="3"/><rect x="${sx - 20}" y="${sy + 78}" width="20" height="3"/></g>`);
      side(sx, sy - 62, sw, f.audit, 15);
      side(sx, sy + 56, sw, f.pdf, 15);
      const path = `M${b.x + nw / 2 - 10} ${top - 4}V${top + 6 * (nh + gap)}`;
      d.add(`<g>${bitmap(ART.coin, 0, 0, 2)}<animateMotion path="M${b.x + nw + 8} ${top}V${top + 6 * (nh + gap) + 20}" dur="5s" repeatCount="indefinite"/></g>`);
      return top + 7 * (nh + gap) - gap;
    }
    const nh = 52, ny = top + 26, gapX = 18, nw = (b.w - gapX * (nodes.length - 1)) / nodes.length;
    const cxOf = (i) => b.x + i * (nw + gapX) + nw / 2;
    nodes.forEach((label, i) => {
      const x = b.x + i * (nw + gapX);
      d.add(`<g class="fade" ${delay(i * 0.08)}>`);
      node(x, ny, nw, nh, label, i === 0 || i === nodes.length - 1, 12);
      d.add(`</g>`);
      if (i < nodes.length - 1) d.add(bitmap(ART.cursor, x + nw + 6, ny + nh / 2 - 7, 1.6, { k: C.onNightMuted, y: C.onNightMuted }));
    });
    d.text("mono", (cxOf(1) + cxOf(3)) / 2, ny + nh + 28, 13, f.note, { anchor: "middle", fill: C.onNightMuted });
    const sv = cxOf(4), by = ny + nh + 66, bw = 190, ax = sv - bw - 20, px = sv + 20;
    d.add(`<g fill="${C.onNightMuted}"><rect x="${sv - 1}" y="${ny + nh}" width="3" height="${by - ny - nh - 18}"/><rect x="${ax + bw / 2}" y="${by - 21}" width="${px - ax}" height="3"/><rect x="${ax + bw / 2 - 1}" y="${by - 21}" width="3" height="21"/><rect x="${px + bw / 2 - 1}" y="${by - 21}" width="3" height="21"/></g>`);
    side(ax, by, bw, f.audit, 14);
    side(px, by, bw, f.pdf, 14);
    d.add(`<g>${bitmap(ART.coin, 0, 0, 2)}<animateMotion path="M${cxOf(0) - 10} ${ny - 26}H${cxOf(6) - 10}" dur="5s" repeatCount="indefinite"/></g>`);
    return by + 46;
  });
}

// ─── Status (dados reais da API do GitHub) ──────────────────────────
export function status(lang, data, m) {
  const t = T[lang].status, W = widthOf(m);
  const year = data.contrib?.year ?? new Date(data.generatedAt).getUTCFullYear();
  const rows = [
    [t.rows.repos, data.repos],
    [t.rows.stars, data.stars],
    [t.rows.followers, data.followers],
    ...(data.contrib ? [[t.rows.commits(year), data.contrib.commits], [t.rows.prs(year), data.contrib.prs], [t.rows.total, data.contrib.total]] : []),
  ];
  const langs = data.languages.slice(0, 6);
  const updated = new Date(data.generatedAt).toLocaleDateString(T[lang].locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Bahia" });
  const a11y = {
    title: t.title,
    desc: `${rows.map(([k, v]) => `${k}: ${v}`).join(". ")}. ${t.langs}: ${langs.map((l) => `${l.name} ${l.pct}%`).join(", ")}. ${t.updated} ${updated}.`,
  };
  return sheet(W, a11y, "night", (d, b) => {
    d.text("display", b.x, 106, m ? 50 : 52, t.title, { fill: C.onNight, ls: -1.5 });
    const upd = `${t.updated} ${updated}`;
    if (m) d.text("mono", b.x, 140, 15, upd, { upper: true, fill: C.onNightMuted, ls: 1.5 });
    else d.text("mono", b.right, 104, 14, upd, { upper: true, fill: C.onNightMuted, ls: 1.5, anchor: "end" });
    const top = m ? 160 : 132;
    rule(d, b.x, top, b.w, C.lineNight);

    const lr = m ? b.right : 462, step = m ? 60 : 56, ls = m ? 24 : 21;
    rows.forEach(([label, value], i) => {
      const y = top + 64 + i * step;
      d.add(`<g class="fade" ${delay(i * 0.08)}>`);
      d.add(bitmap(ART.cursor, b.x, y - 22, 3));
      d.text("body", b.x + 26, y, ls, label, { fill: C.onNightMuted });
      d.text("pixelBold", lr, y + 2, m ? 34 : 32, String(value), { fill: C.yellow, anchor: "end" });
      d.add(`</g>`);
      if (i < rows.length - 1) rule(d, b.x + 26, y + 20, lr - b.x - 26, C.lineNight);
    });

    const rx = m ? b.x : 530, rr = b.right, segs = 20, sg = 4;
    const ly = m ? top + 64 + rows.length * step + 30 : top + 48;
    const sw = (rr - rx - sg * (segs - 1)) / segs, lstep = m ? 60 : 48;
    d.text("mono", rx, ly, m ? 15 : 14, t.langs, { upper: true, fill: C.onNightMuted, ls: 1.5 });
    langs.forEach((l, i) => {
      const y = ly + (m ? 48 : 44) + i * lstep;
      d.text("body", rx, y, m ? 23 : 20, l.name, { fill: C.onNight });
      d.text("mono", rr, y, m ? 19 : 17, `${l.pct.toFixed(1)}%`, { fill: C.onNightMuted, anchor: "end" });
      const filled = l.pct > 0 ? Math.max(1, Math.round(l.pct / (100 / segs))) : 0;
      let track = "", fill = "";
      for (let k = 0; k < segs; k++) {
        const r = `<rect x="${(rx + k * (sw + sg)).toFixed(1)}" y="${y + 13}" width="${sw.toFixed(1)}" height="${m ? 14 : 12}"`;
        track += `${r} fill="${C.night3}"/>`;
        if (k < filled) fill += `${r} fill="${C.yellow}"/>`;
      }
      d.add(`<g shape-rendering="crispEdges">${track}</g><g shape-rendering="crispEdges" class="grow" ${delay(0.3 + i * 0.1)}>${fill}</g>`);
    });
    const end = Math.max(top + 64 + (rows.length - 1) * step + 20, ly + (m ? 48 : 44) + (langs.length - 1) * lstep + 30);
    return paragraph(d, b.x, end + 40, t.note, { face: "mono", bold: "monoBold", size: m ? 14 : 13, lh: 22, width: b.w, fill: C.onNightMuted });
  });
}

// ─── Conquistas ─────────────────────────────────────────────────────
export function achievements(lang, m) {
  const t = T[lang].achievements, W = widthOf(m);
  return sheet(W, { title: `${t.title}: ${ACHIEVEMENTS.map((a) => `${a[lang][1]} (${a[lang][0]})`).join("; ")}` }, "paper", (d, b) => {
    const tl = wrap("display", t.title, m ? 50 : 56, m ? b.w : b.w - 120, -1.5);
    tl.forEach((l, i) => d.text("display", b.x, 108 + i * 52, m ? 50 : 56, l, { ls: -1.5 }));
    if (!m) {
      d.add(`<g class="spin">${bitmap(ART.coin, b.right - 96, 82, 3)}</g>`);
      d.text("pixelBold", b.right, 108, 30, `×${ACHIEVEMENTS.length}`, { anchor: "end" });
    }
    const top = 108 + (tl.length - 1) * 52 + 26;
    rule(d, b.x, top, b.w, C.line);
    const cols = m ? 1 : 2, gx = 24, gy = m ? 20 : 24, th = 128;
    const tw = (b.w - (cols - 1) * gx - (m ? 6 : 0)) / cols;
    ACHIEVEMENTS.forEach((a, i) => {
      const x = b.x + (i % cols) * (tw + gx), y = top + 30 + Math.floor(i / cols) * (th + gy);
      const [cat, title] = a[lang];
      d.add(`<g class="pop" ${delay(0.1 * i)}>`);
      d.add(frame(x, y, tw, th, { fill: C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
      artTile(d, a.art, x + 18, y + 18, 92, 6);
      d.text("mono", x + 132, y + 40, m ? 15 : 13, cat, { upper: true, fill: C.inkSoft, ls: 1.2 });
      wrap("bodyBold", title, m ? 26 : 24, tw - 150).slice(0, 2).forEach((l, j) => d.text("bodyBold", x + 132, y + 78 + j * 30, m ? 26 : 24, l));
      d.add(`</g>`);
    });
    return top + 30 + Math.ceil(ACHIEVEMENTS.length / cols) * (th + gy) - gy + 6;
  });
}

// ─── Contato: tela de "Continue?" ───────────────────────────────────
export function continueScreen(lang, m) {
  const t = T[lang].contact, W = widthOf(m);
  return sheet(W, { title: `${t.title} ${t.line1} ${t.line2}` }, "night", (d, b) => {
    d.style(`.cd{opacity:0;animation:cd 10s step-end infinite}.cd-9{opacity:1}@keyframes cd{0%{opacity:1}10%,100%{opacity:0}}`);
    const ts = m ? 66 : 80;
    const cw = d.text("pixelBold", b.x, 136, ts, t.title, { fill: C.yellow, upper: true });
    for (let n = 9; n >= 0; n--) {
      d.add(`<g class="cd cd-${n}" style="animation-delay:${9 - n}s">`);
      d.text("pixelBold", b.x + cw + 24, 136, ts, String(n), { fill: C.onNight });
      d.add(`</g>`);
    }
    if (!m) d.add(`<g class="bob"><g class="spin">${bitmap(ART.coin, 846, 80, 7)}</g></g>`);
    const lines = wrap("display", `${t.line1} ${t.line2}`, m ? 44 : 46, m ? b.w : 720, -1);
    lines.forEach((l, i) => {
      d.add(`<g class="fade" ${delay(0.2 + i * 0.12)}>`);
      d.text("display", b.x, (m ? 210 : 206) + i * (m ? 48 : 52), m ? 44 : 46, l, { fill: C.onNight, ls: -1 });
      d.add(`</g>`);
    });
    const y = (m ? 210 : 206) + (lines.length - 1) * (m ? 48 : 52) + 64;
    const pw = d.text("mono", b.x, y, 16, t.pick, { upper: true, fill: C.yellow, ls: 2 });
    d.add(`<g class="blink">${bitmap(ART.arrowDown, b.x + pw + 14, y - 14, 2)}</g>`);
    return y + 4;
  });
}

// ─── Rodapé (a imagem é um link de volta ao topo) ───────────────────
export function footer(lang, sprites, m) {
  const t = T[lang].footer, W = widthOf(m);
  return sheet(W, { title: `${t.title} — ${t.sub}. ${t.back}.` }, "night", (d, b) => {
    d.def(`<clipPath id="inside"><rect x="12" y="12" width="${W - 32}" height="2000"/></clipPath>`);
    d.style(`.walk{animation:walk 14s linear infinite}@keyframes walk{from{transform:translateX(-120px)}to{transform:translateX(${W + 40}px)}}`);
    const tl = wrap("pixelBold", t.title.toUpperCase(), m ? 40 : 46, b.w);
    tl.forEach((l, i) => d.text("pixelBold", W / 2 - 4, 104 + i * 48, m ? 40 : 46, l, { fill: C.yellow, anchor: "middle" }));
    let y = 104 + (tl.length - 1) * 48;
    for (const l of wrap("body", t.sub, m ? 21 : 19, b.w)) d.text("body", W / 2 - 4, (y += 38), m ? 21 : 19, l, { fill: C.onNightMuted, anchor: "middle" });
    // Botão "voltar ao início"
    const bw = measure("monoBold", t.back.toUpperCase(), 16, 1) + 66, bx = W / 2 - 4 - bw / 2, by = y + 30;
    d.add(`<g class="breathe">${frame(bx, by, bw, 46, { fill: C.yellow, border: C.ink, bw: 3, shadow: C.ink, sh: 5 })}`);
    d.add(bitmap(ART.arrowUp, bx + 18, by + 17, 2));
    d.text("monoBold", bx + 46, by + 29, 16, t.back, { upper: true, ls: 1 });
    d.add(`</g>`);
    // Chão de blocos com moedas e o personagem caminhando
    const gy = by + 130;
    let ground = `<rect x="0" y="${gy}" width="${W}" height="6" fill="${C.yellow}"/>`;
    for (let x = 0, k = 0; x < W; x += 40, k++) ground += `<rect x="${x}" y="${gy + 6}" width="38" height="20" fill="${C.night3}"/>`;
    const coins = m ? [120, 300, 470] : [180, 420, 640, 860];
    coins.forEach((x, i) => (ground += `<g class="bob" style="animation-delay:${-i * 0.4}s"><g class="spin" style="animation-delay:${-i * 0.3}s">${bitmap(ART.coin, x, gy - 58, 3)}</g></g>`));
    const s = sprites["modo-estudo"];
    const walker = s ? (() => { const f = fit(s, 0, 0, 96, 96); return image(s.href, f.x, gy - 92, f.w, f.h); })() : `<g class="spin">${bitmap(ART.coin, -15, gy - 34, 3)}</g>`;
    d.add(`<g clip-path="url(#inside)">${ground}<g class="walk"><g class="bob">${walker}</g></g></g>`);
    return gy - 44 + 26;
  });
}

// ─── Botões ─────────────────────────────────────────────────────────
// Altura fixa (72), largura conforme o texto. No README usamos `height`, então todos
// ficam do mesmo tamanho e a largura acompanha o rótulo.
export function actionButton(label, art, { primary = false, face = "bodyBold" } = {}) {
  const a = ART[art], sz = size(a), px = 3;
  const iw = sz.w * px, lx = 22 + iw + 14;
  const W = Math.ceil(lx + measure(face, label, 22) + 30 + 8);
  const doc = new Doc(W, 72, { title: label });
  doc.add(frame(2, 2, W - 10, 62, { fill: primary ? C.yellow : C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
  doc.add(bitmap(a, 22, 33 - (sz.h * px) / 2, px));
  doc.text(face, lx, 41, 22, label);
  return doc.render();
}

export function menuButton(i, label) {
  const n = String(i + 1).padStart(2, "0");
  const W = 230;
  const doc = new Doc(W, 72, { title: `${n} ${label}` });
  doc.add(frame(2, 2, W - 10, 62, { fill: C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
  doc.add(frame(12, 13, 46, 40, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
  doc.text("pixelBold", 35, 40, 20, n, { anchor: "middle" });
  doc.text("bodyBold", 70, 41, 22, label);
  return doc.render();
}

export function contactButton(c, lang) {
  const label = c[lang];
  const doc = new Doc(300, 76, { title: label });
  doc.add(frame(2, 2, 288, 64, { fill: c.primary ? C.yellow : C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
  const art = ART[c.art], sz = size(art);
  doc.add(bitmap(art, 24, 34 - (sz.h * 3) / 2, 3));
  doc.text("bodyBold", 66, 42, 20, label);
  doc.add(`<g class="nudge">${bitmap(ART.cursor, 266, 25, 2, { y: c.primary ? C.ink : C.yellow })}</g>`);
  return doc.render();
}

export function langButton(code, name, active) {
  const doc = new Doc(176, 52, { title: name });
  const o = active ? 4 : 0;
  doc.add(frame(2 + o, 2 + o, 164, 42, { fill: active ? C.yellow : C.paper, border: C.ink, bw: 3, shadow: active ? null : C.ink, sh: 4 }));
  doc.text("monoBold", 20 + o, 29 + o, 14, code, { fill: active ? C.ink : C.muted });
  doc.text("bodyBold", 52 + o, 30 + o, 17, name, { fill: active ? C.ink : C.inkSoft });
  return doc.render();
}
