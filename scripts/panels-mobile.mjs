// Versões para celular dos painéis (viewBox de 600px em vez de 1000px).
// O README entrega estas imagens via <picture><source media="(max-width: 600px)">:
// num celular o texto fica ~1,7× maior que na versão de desktop reduzida.
// Se o navegador ignorar o <source>, aparece a versão de desktop — nada quebra.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { C } from "./lib/theme.mjs";
import { Doc, frame, panel, chipRow, image, stepPath } from "./lib/svg.mjs";
import { measure, wrap } from "./lib/fonts.mjs";
import { ART, bitmap, size } from "./lib/pixels.mjs";
import { fit } from "./lib/sprites.mjs";
import { MODES, SHEET, INVENTORY, FEATURED, ACHIEVEMENTS, T } from "./content.mjs";

const W = 600;
const pick = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v);

function pixelCircle(cx, cy, R, step, fill) {
  let out = "";
  for (let y = -R; y < R; y += step) {
    const yc = y + step / 2;
    const half = Math.round(Math.sqrt(R * R - yc * yc) / step) * step;
    if (half > 0) out += `<rect x="${cx - half}" y="${cy + y}" width="${2 * half}" height="${step}" fill="${fill}"/>`;
  }
  return `<g shape-rendering="crispEdges">${out}</g>`;
}

const rule = (doc, x, y, w, color) => doc.add(`<rect x="${x}" y="${y}" width="${w}" height="2" fill="${color}"/>`);

export function hero(lang, sprites) {
  const t = T[lang].hero;
  const H = 820;
  const doc = new Doc(W, H, { title: t.title, desc: t.desc });
  const b = panel(doc, "paper");
  doc.def(`<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="10" y="10" width="3" height="3" fill="${C.line}"/></pattern>`);
  doc.add(`<path d="${stepPath(8, 8, W - 24, H - 24)}" fill="url(#dots)"/>`);
  doc.text("mono", b.x, 80, 15, t.p1, { upper: true, fill: C.inkSoft, ls: 1 });
  doc.text("mono", b.right, 80, 15, t.xp, { upper: true, fill: C.inkSoft, ls: 1, anchor: "end" });
  rule(doc, b.x, 98, b.right - b.x, C.line);

  const cx = W / 2 - 4, cy = 276, R = 156;
  doc.add(pixelCircle(cx, cy, R, 12, C.yellow));
  const s = sprites["everton-dev"];
  if (s) {
    const f = fit(s, cx, cy - 6, 360, 360);
    doc.add(image(s.href, f.x, f.y, f.w, f.h));
  } else doc.text("pixelBold", cx, cy + 60, 180, "ES", { anchor: "middle" });
  doc.add(`<g class="bob">${bitmap(ART.coin, 452, 120, 5)}</g>`);
  doc.add(`<g class="twinkle">${bitmap(ART.sparkle, 120, 170, 5)}</g>`);
  doc.add(`<g class="twinkle" style="animation-delay:1s">${bitmap(ART.star, 470, 380, 5)}</g>`);

  doc.text("display", b.x - 4, 556, 140, "Everton", { ls: -4 });
  doc.text("display", b.x + 72, 680, 140, "Santos", { ls: -4 });
  doc.text("mono", b.x, 722, 15, t.coords, { upper: true, fill: C.muted, ls: 0.5 });
  rule(doc, b.x, 738, b.right - b.x, C.line);
  const pw = doc.text("pixel", b.x, 778, 26, t.press, { upper: true, ls: 1 });
  doc.add(`<g class="blink">${bitmap(ART.arrowDown, b.x + pw + 14, 762, 3)}</g>`);
  return doc.render();
}

export function character(lang, sprites) {
  const t = T[lang].character;
  const modes = MODES.map((m) => m[lang]);
  const textLines = modes.map((m) => wrap("body", m.text, 24, 504));
  const maxLines = Math.max(...textLines.map((l) => l.length));
  const modeTop = 650, gridTop = modeTop + 112 + maxLines * 34 + 10;
  const H = gridTop + 2 * 92 + 64;
  const doc = new Doc(W, H, {
    title: `${t.title.join("")} ${modes.map((m) => m.title).join(", ")}`,
    desc: `${modes.map((m) => `${m.title}: ${m.text}`).join(" ")} ${SHEET[lang].map(([k, v]) => `${k}: ${v}`).join(". ")}.`,
  });
  doc.style(`.mode{opacity:0;animation:mode 9s step-end infinite}.mode-1{animation-delay:-6s}.mode-2{animation-delay:-3s}
@keyframes mode{0%{opacity:1}33.333%{opacity:0}}
@media (prefers-reduced-motion:reduce){.mode-0{opacity:1}}`);
  const b = panel(doc, "night");

  doc.text("display", b.x, 106, 56, t.title[0].trim(), { fill: C.onNight, ls: -1.5 });
  doc.add(`<g transform="translate(${b.x + 4} 166) skewX(-10)">`);
  const w2 = doc.text("display", 0, 0, 56, t.title[1], { fill: C.yellow, ls: -1.5 });
  doc.add(`</g>`);
  doc.text("display", b.x + w2 + 12, 166, 56, t.title[2], { fill: C.onNight, ls: -1.5 });

  const st = { x: b.x, y: 200, w: b.right - b.x, h: 404 };
  doc.add(frame(st.x, st.y, st.w, st.h, { fill: C.night2, border: C.night3, shadow: C.plum, sh: 6 }));
  doc.add(`<rect x="${st.x + 20}" y="${st.y + 26}" width="8" height="8" fill="${C.yellow}" class="blink"/>`);
  doc.text("mono", st.x + 38, st.y + 35, 16, t.name, { fill: C.onNightMuted, ls: 1 });
  doc.add(`<rect x="${st.x + 20}" y="${st.y + 314}" width="${st.w - 40}" height="4" fill="${C.night3}"/>`);
  const tabW = (st.w - 40 - 16) / 3, tabY = st.y + 332;
  MODES.forEach((m, i) => {
    const sp = sprites[m.sprite] ?? sprites["everton-dev"];
    const tx = st.x + 20 + i * (tabW + 8);
    doc.add(frame(tx, tabY, tabW, 52, { fill: C.night3, border: null, shadow: null, s: 3 }));
    doc.text("mono", tx + tabW / 2, tabY + 33, 19, modes[i].tab, { fill: C.onNightMuted, anchor: "middle" });
    doc.add(`<g class="mode mode-${i}">`);
    if (sp) {
      const f = fit(sp, st.x + st.w / 2, st.y + 170, 300, 260);
      doc.add(image(sp.href, f.x, f.y, f.w, f.h));
    } else doc.add(bitmap(ART[["briefcase", "blocks", "book"][i]], st.x + st.w / 2 - 48, st.y + 120, 8));
    doc.add(frame(tx, tabY, tabW, 52, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 3 }));
    doc.text("monoBold", tx + tabW / 2, tabY + 33, 19, modes[i].tab, { fill: C.ink, anchor: "middle" });
    doc.add(`</g>`);
  });

  modes.forEach((m, i) => {
    doc.add(`<g class="mode mode-${i}">`);
    doc.text("mono", b.x, modeTop + 4, 17, `${t.mode} 0${i + 1}`, { upper: true, fill: C.yellow, ls: 2 });
    doc.text("display", b.x, modeTop + 56, 44, m.title, { fill: C.onNight, ls: -1 });
    textLines[i].forEach((line, j) => doc.text("body", b.x, modeTop + 102 + j * 34, 24, line, { fill: C.onNightMuted }));
    doc.add(`</g>`);
  });

  const rw = b.right - b.x, cw = rw / 2, ch = 92;
  doc.add(`<g fill="${C.lineNight}"><rect x="${b.x}" y="${gridTop}" width="${rw}" height="2"/><rect x="${b.x}" y="${gridTop + ch}" width="${rw}" height="2"/><rect x="${b.x}" y="${gridTop + 2 * ch}" width="${rw}" height="2"/><rect x="${b.x + cw}" y="${gridTop}" width="2" height="${2 * ch}"/></g>`);
  SHEET[lang].forEach(([k, v], i) => {
    const cx = b.x + (i % 2) * cw + (i % 2 ? 22 : 0), cy = gridTop + Math.floor(i / 2) * ch;
    doc.text("mono", cx, cy + 32, 15, k, { upper: true, fill: C.onNightMuted, ls: 2 });
    doc.text("bodyBold", cx, cy + 72, 29, v, { fill: C.onNight });
  });
  return doc.render();
}

export async function inventory(lang, iconDir) {
  const t = T[lang].inventory;
  const slot = 72, gap = 14, rowH = 168, top = 160;
  const H = top + INVENTORY.length * rowH + 30;
  const total = INVENTORY.reduce((a, c) => a + c.items.length, 0);
  const doc = new Doc(W, H, { title: `${t.title}: ${INVENTORY.map((c) => `${c[lang]} — ${c.items.map((i) => i[1]).join(", ")}`).join("; ")}` });
  const b = panel(doc, "paper");
  doc.text("display", b.x, 108, 54, t.title, { ls: -1.5 });
  doc.text("mono", b.right, 106, 15, t.count(total), { upper: true, fill: C.muted, ls: 1, anchor: "end" });
  rule(doc, b.x, 130, b.right - b.x, C.line);

  for (const [r, cat] of INVENTORY.entries()) {
    const y = top + r * rowH;
    doc.add(bitmap(ART.cursor, b.x, y + 4, 3));
    const lw = doc.text("monoBold", b.x + 26, y + 26, 19, cat[lang], { upper: true, ls: 1 });
    if (cat.training) doc.text("mono", b.x + 40 + lw, y + 26, 16, `· ${t.training}`, { fill: C.muted });
    const sy = y + 46;
    for (const [i, [id, label]] of cat.items.entries()) {
      const x = b.x + i * (slot + gap);
      doc.add(cat.training
        ? frame(x, sy, slot, slot, { fill: C.paperDeep, border: C.muted, bw: 3, shadow: null, dashed: true })
        : frame(x, sy, slot, slot, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: C.ink, sh: 4 }));
      const op = cat.training ? ` opacity=".55"` : "";
      if (id.startsWith("art:")) {
        const art = ART[id.slice(4)], sz = size(art), px = 3;
        doc.add(`<g${op}>${bitmap(art, x + (slot - sz.w * px) / 2, sy + (slot - sz.h * px) / 2, px)}</g>`);
      } else {
        const svg = await readFile(join(iconDir, `${id}.svg`), "utf8");
        const inner = svg.replace(/id="([^"]+)"/g, `id="${id}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`).replace(/href="#([^"]+)"/g, `href="#${id}-$1"`);
        doc.add(`<svg x="${x + 12}" y="${sy + 12}" width="${slot - 24}" height="${slot - 24}" viewBox="0 0 256 256"${op}>${inner}</svg>`);
      }
      doc.text("mono", x + slot / 2, sy + slot + 26, 13, label, { anchor: "middle", fill: C.inkSoft });
    }
  }
  return doc.render();
}

export function featured(lang) {
  const p = FEATURED, t = p[lang];
  const doc = new Doc(W, 0, {
    title: `${p.n} · ${p.title} — ${t.kind}`,
    desc: `${t.stats.map(([n, l]) => `${n} ${l}`).join(", ")}. Stack: ${p.stack.join(", ")}. ${t.status}.`,
  });
  // altura calculada depois de posicionar tudo
  const x = 48, right = W - 56;
  const nw = measure("pixelBold", p.n, 20) + 24;
  let y = 70;
  const body = new Doc(W, 0);
  body.used = doc.used;
  body.add(frame(x, y, nw, 36, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
  body.text("pixelBold", x + 12, y + 25, 20, p.n);
  body.text("mono", x + nw + 14, y + 24, 16, t.tag, { upper: true, fill: C.yellow, ls: 2 });
  y += 128;
  body.text("display", x - 4, y, 92, p.title, { fill: C.onNight, ls: -2.5 });
  y += 10;
  for (const l of wrap("body", t.kind, 24, right - x)) body.text("body", x, (y += 36), 24, l, { fill: C.onNightMuted });
  y += 70;
  const colW = (right - x) / 3;
  t.stats.forEach(([n, label], i) => {
    body.text("pixelBold", x + i * colW, y, 52, n, { fill: C.yellow });
    wrap("body", label, 19, colW - 16).forEach((l, j) => body.text("body", x + i * colW, y + 34 + j * 25, 19, l, { fill: C.onNightMuted }));
  });
  y += 110;
  y = chipRow(body, x, y, p.stack, right, { night: true, size: 17 }) + 44;
  body.add(`<rect x="${x}" y="${y - 10}" width="10" height="10" fill="${C.yellow}" class="blink"/>`);
  wrap("mono", t.status.toUpperCase(), 15, right - x - 24, 1).forEach((l, j) => body.text("mono", x + 22, y + j * 24, 15, l, { fill: C.onNightMuted, ls: 1 }));
  const H = y + 70;
  doc.h = H;
  panel(doc, "night");
  doc.add(...body.parts);
  return doc.render();
}

export function quest(q, lang, meta) {
  const t = q[lang], title = pick(q.title, lang), labels = T[lang].quest;
  const doc = new Doc(W, 0, { title: `${q.n} · ${title} — ${t.kind}`, desc: `Stack: ${q.stack.join(", ")}.${t.credit ? ` ${t.credit}.` : ""}` });
  const body = new Doc(W, 0);
  body.used = doc.used;
  const x = 40, right = W - 52;

  body.add(frame(x - 4, 36, 132, 132, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: null }));
  const art = ART[q.art], sz = size(art), px = 6;
  body.add(bitmap(art, x - 4 + (132 - sz.w * px) / 2, 36 + (132 - sz.h * px) / 2, px));
  const tx = x + 152;
  const nw = measure("pixelBold", q.n, 19) + 20;
  body.add(frame(tx, 44, nw, 32, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
  body.text("pixelBold", tx + 10, 67, 19, q.n);
  if (meta?.stars) {
    const sw = body.text("pixelBold", right, 70, 22, String(meta.stars), { anchor: "end" });
    body.add(bitmap(ART.starFull, right - sw - 34, 54, 3));
  }
  wrap("mono", t.kind.toUpperCase(), 16, right - tx, 0.5).forEach((l, j) => body.text("mono", tx, 112 + j * 26, 16, l, { fill: C.inkSoft, ls: 0.5 }));

  let y = 236;
  for (const l of wrap("display", title, 56, right - x, -1.5)) { body.text("display", x - 2, y, 56, l, { ls: -1.5 }); y += 56; }
  y = chipRow(body, x, y - 22, q.stack, right, { size: 17 }) + 22;
  if (t.credit) {
    const tagW = measure("mono", t.credit.toUpperCase(), 15, 1) + 28;
    body.add(frame(x, y, tagW, 36, { fill: C.plum, border: null, shadow: null, s: 2 }));
    body.text("mono", x + 14, y + 24, 15, t.credit, { upper: true, fill: C.onNight, ls: 1 });
  } else {
    const ow = body.text("mono", x, y + 24, 16, labels.open, { upper: true, ls: 1 });
    body.add(bitmap(ART.cursor, x + ow + 10, y + 8, 2));
  }
  const H = y + 36 + 44;
  doc.h = H;
  doc.add(frame(4, 4, W - 16, H - 16, { fill: C.paper, border: C.ink, shadow: C.ink }));
  doc.add(...body.parts);
  return doc.render();
}

export function status(lang, data) {
  const t = T[lang].status;
  const year = data.contrib?.year ?? new Date(data.generatedAt).getUTCFullYear();
  const rows = [
    [t.rows.repos, data.repos],
    [t.rows.stars, data.stars],
    [t.rows.followers, data.followers],
    ...(data.contrib ? [[t.rows.commits(year), data.contrib.commits], [t.rows.prs(year), data.contrib.prs], [t.rows.total, data.contrib.total]] : []),
  ];
  const langs = data.languages.slice(0, 6);
  const updated = new Date(data.generatedAt).toLocaleDateString(T[lang].locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Bahia" });
  const langTop = 196 + rows.length * 60 + 50;
  const H = langTop + 40 + langs.length * 60 + 80;
  const doc = new Doc(W, H, {
    title: t.title,
    desc: `${rows.map(([k, v]) => `${k}: ${v}`).join(". ")}. ${t.langs}: ${langs.map((l) => `${l.name} ${l.pct}%`).join(", ")}. ${t.updated} ${updated}.`,
  });
  const b = panel(doc, "night");
  doc.text("display", b.x, 106, 50, t.title, { fill: C.onNight, ls: -1.5 });
  doc.text("mono", b.x, 140, 15, `${t.updated} ${updated}`, { upper: true, fill: C.onNightMuted, ls: 1.5 });
  rule(doc, b.x, 160, b.right - b.x, C.lineNight);
  rows.forEach(([label, value], i) => {
    const y = 214 + i * 60;
    doc.add(bitmap(ART.cursor, b.x, y - 24, 3));
    doc.text("body", b.x + 26, y, 24, label, { fill: C.onNightMuted });
    doc.text("pixelBold", b.right, y + 2, 34, String(value), { fill: C.yellow, anchor: "end" });
    if (i < rows.length - 1) rule(doc, b.x + 26, y + 22, b.right - b.x - 26, C.lineNight);
  });
  doc.text("mono", b.x, langTop, 15, t.langs, { upper: true, fill: C.onNightMuted, ls: 1.5 });
  const segs = 20, sg = 4, sw = (b.right - b.x - sg * (segs - 1)) / segs;
  langs.forEach((l, i) => {
    const y = langTop + 48 + i * 60;
    doc.text("body", b.x, y, 23, l.name, { fill: C.onNight });
    doc.text("mono", b.right, y, 19, `${l.pct.toFixed(1)}%`, { fill: C.onNightMuted, anchor: "end" });
    const filled = l.pct > 0 ? Math.max(1, Math.round(l.pct / (100 / segs))) : 0;
    let bars = "";
    for (let k = 0; k < segs; k++) bars += `<rect x="${(b.x + k * (sw + sg)).toFixed(1)}" y="${y + 14}" width="${sw.toFixed(1)}" height="14" fill="${k < filled ? C.yellow : C.night3}"/>`;
    doc.add(`<g shape-rendering="crispEdges">${bars}</g>`);
  });
  doc.text("mono", b.x, H - 62, 14, t.note, { fill: C.onNightMuted });
  return doc.render();
}

export function achievements(lang) {
  const t = T[lang].achievements;
  const th = 128, gy = 20;
  const titleLines = wrap("display", t.title, 50, 504, -1.5);
  const top = 70 + titleLines.length * 52 + 30;
  const H = top + ACHIEVEMENTS.length * (th + gy) + 40;
  const doc = new Doc(W, H, { title: `${t.title}: ${ACHIEVEMENTS.map((a) => `${a[lang][1]} (${a[lang][0]})`).join("; ")}` });
  const b = panel(doc, "paper");
  titleLines.forEach((l, i) => doc.text("display", b.x, 106 + i * 52, 50, l, { ls: -1.5 }));
  rule(doc, b.x, top - 22, b.right - b.x, C.line);
  ACHIEVEMENTS.forEach((a, i) => {
    const x = b.x, y = top + i * (th + gy), tw = b.right - b.x - 6;
    const [cat, title] = a[lang];
    doc.add(frame(x, y, tw, th, { fill: C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
    doc.add(frame(x + 18, y + 18, 92, 92, { fill: C.paperDeep, border: C.ink, bw: 2, shadow: null }));
    const art = ART[a.art], sz = size(art), px = 6;
    doc.add(bitmap(art, x + 18 + (92 - sz.w * px) / 2, y + 18 + (92 - sz.h * px) / 2, px));
    doc.text("mono", x + 130, y + 42, 15, cat, { upper: true, fill: C.inkSoft, ls: 1 });
    wrap("bodyBold", title, 26, tw - 150).slice(0, 2).forEach((l, j) => doc.text("bodyBold", x + 130, y + 80 + j * 32, 26, l));
  });
  return doc.render();
}

export function continueScreen(lang) {
  const t = T[lang].contact;
  const lines = wrap("display", `${t.line1} ${t.line2}`, 44, 504, -1);
  const H = 190 + lines.length * 48 + 50;
  const doc = new Doc(W, H, { title: `${t.title} ${t.line1} ${t.line2}` });
  doc.style(`.cd{opacity:0;animation:cd 10s step-end infinite}@keyframes cd{0%{opacity:1}10%{opacity:0}}
@media (prefers-reduced-motion:reduce){.cd-9{opacity:1}}`);
  const b = panel(doc, "night");
  const cw = doc.text("pixelBold", b.x, 136, 66, t.title, { fill: C.yellow, upper: true });
  for (let n = 9; n >= 0; n--) {
    doc.add(`<g class="cd cd-${n}" style="animation-delay:${9 - n}s">`);
    doc.text("pixelBold", b.x + cw + 22, 136, 66, String(n), { fill: C.onNight });
    doc.add(`</g>`);
  }
  lines.forEach((l, i) => doc.text("display", b.x, 210 + i * 48, 44, l, { fill: C.onNight, ls: -1 }));
  return doc.render();
}
