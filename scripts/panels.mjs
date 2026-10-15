// Painéis do README. Cada função devolve um SVG pronto (string).
// Regra de legibilidade: o README exibe os painéis com width="100%", então num celular
// (~360px) tudo encolhe ~3×. Por isso o texto dentro dos SVGs é grande e curto;
// frases longas ficam no Markdown, que quebra linha sozinho.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { C } from "./lib/theme.mjs";
import { Doc, frame, panel, chip, chipRow, image, stepPath } from "./lib/svg.mjs";
import { measure, wrap } from "./lib/fonts.mjs";
import { ART, bitmap, size } from "./lib/pixels.mjs";
import { fit } from "./lib/sprites.mjs";
import { MODES, SHEET, INVENTORY, FEATURED, QUESTS, ACHIEVEMENTS, T } from "./content.mjs";

const W = 1000;
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

// ─── Tela de título ─────────────────────────────────────────────────
export function hero(lang, sprites) {
  const t = T[lang].hero;
  const doc = new Doc(W, 600, { title: t.title, desc: t.desc });
  const b = panel(doc, "paper");
  doc.def(`<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="10" y="10" width="3" height="3" fill="${C.line}"/></pattern>`);
  doc.add(`<path d="${stepPath(8, 8, W - 24, 600 - 24)}" fill="url(#dots)"/>`);

  doc.text("mono", b.x, 80, 17, t.p1, { upper: true, fill: C.inkSoft, ls: 1.5 });
  doc.text("mono", b.right, 80, 17, t.xp, { upper: true, fill: C.inkSoft, ls: 1.5, anchor: "end" });
  doc.add(`<rect x="${b.x}" y="98" width="${b.right - b.x}" height="2" fill="${C.line}"/>`);

  const cx = 712, cy = 300, R = 168;
  doc.add(pixelCircle(cx, cy, R, 12, C.yellow));
  const s = sprites["everton-dev"];
  if (s) {
    const f = fit(s, cx, cy - 6, 392, 392);
    doc.add(image(s.href, f.x, f.y, f.w, f.h));
  } else {
    doc.text("pixelBold", cx, cy + 66, 200, "ES", { anchor: "middle" });
  }
  doc.add(`<g class="bob">${bitmap(ART.coin, 862, 120, 5)}</g>`);
  doc.add(`<g class="twinkle">${bitmap(ART.sparkle, 548, 170, 5)}</g>`);
  doc.add(`<g class="twinkle" style="animation-delay:.8s">${bitmap(ART.sparkle, 890, 352, 4)}</g>`);
  doc.add(`<g class="twinkle" style="animation-delay:1.6s">${bitmap(ART.star, 452, 150, 6)}</g>`);

  doc.text("display", b.x - 6, 270, 172, "Everton", { ls: -5 });
  doc.text("display", b.x + 84, 426, 172, "Santos", { ls: -5 });
  doc.text("mono", b.x, 474, 17, t.coords, { upper: true, fill: C.muted, ls: 1 });

  doc.add(`<rect x="${b.x}" y="496" width="${b.right - b.x}" height="2" fill="${C.line}"/>`);
  const pw = doc.text("pixel", b.x, 540, 28, t.press, { upper: true, ls: 1 });
  doc.add(`<g class="blink">${bitmap(ART.arrowDown, b.x + pw + 16, 523, 3)}</g>`);
  doc.text("mono", b.x + pw + 60, 538, 16, t.scroll, { upper: true, fill: C.muted, ls: 1.5 });
  return doc.render();
}

// ─── Ficha do personagem ────────────────────────────────────────────
export function character(lang, sprites) {
  const t = T[lang].character;
  const H = 620;
  const modes = MODES.map((m) => m[lang]);
  const doc = new Doc(W, H, {
    title: `${t.title.join("")} ${modes.map((m) => m.title).join(", ")}`,
    desc: `${modes.map((m) => `${m.title}: ${m.text}`).join(" ")} ${SHEET[lang].map(([k, v]) => `${k}: ${v}`).join(". ")}.`,
  });
  doc.style(`.mode{opacity:0;animation:mode 9s step-end infinite}.mode-1{animation-delay:-6s}.mode-2{animation-delay:-3s}
@keyframes mode{0%{opacity:1}33.333%{opacity:0}}
@media (prefers-reduced-motion:reduce){.mode-0{opacity:1}}`);
  const b = panel(doc, "night");

  // Título com "três" em amarelo e inclinado, como no portfólio
  let x = b.x;
  x += doc.text("display", x, 112, 56, t.title[0], { fill: C.onNight, ls: -1.5 });
  doc.add(`<g transform="translate(${x + 4} 112) skewX(-10)">`);
  const w2 = doc.text("display", 0, 0, 56, t.title[1], { fill: C.yellow, ls: -1.5 });
  doc.add(`</g>`);
  doc.text("display", x + w2 + 8, 112, 56, t.title[2], { fill: C.onNight, ls: -1.5 });

  // Palco com o sprite de cada modo
  const st = { x: b.x, y: 148, w: 372, h: 416 };
  doc.add(frame(st.x, st.y, st.w, st.h, { fill: C.night2, border: C.night3, shadow: C.plum, sh: 6 }));
  doc.add(`<rect x="${st.x + 20}" y="190" width="8" height="8" fill="${C.yellow}" class="blink"/>`);
  doc.text("mono", st.x + 38, 199, 15, t.name, { fill: C.onNightMuted, ls: 1 });
  doc.add(`<rect x="${st.x + 20}" y="466" width="${st.w - 40}" height="4" fill="${C.night3}"/>`);
  const tabW = (st.w - 40 - 16) / 3;
  MODES.forEach((m, i) => {
    const sp = sprites[m.sprite] ?? sprites["everton-dev"];
    const tx = st.x + 20 + i * (tabW + 8);
    doc.add(frame(tx, 488, tabW, 54, { fill: C.night3, border: null, shadow: null, s: 3 }));
    doc.text("mono", tx + tabW / 2, 521, 17, modes[i].tab, { fill: C.onNightMuted, anchor: "middle" });
    doc.add(`<g class="mode mode-${i}">`);
    if (sp) {
      const f = fit(sp, st.x + st.w / 2, 330, 300, 268);
      doc.add(image(sp.href, f.x, f.y, f.w, f.h));
    } else {
      doc.add(bitmap(ART[["briefcase", "blocks", "book"][i]], st.x + st.w / 2 - 48, 280, 8));
    }
    doc.add(frame(tx, 488, tabW, 54, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 3 }));
    doc.text("monoBold", tx + tabW / 2, 521, 17, modes[i].tab, { fill: C.ink, anchor: "middle" });
    doc.add(`</g>`);
  });

  // Coluna da direita: modo atual + atributos
  const rx = 460, rw = b.right - rx;
  modes.forEach((m, i) => {
    doc.add(`<g class="mode mode-${i}">`);
    doc.text("mono", rx, 186, 16, `${t.mode} 0${i + 1}`, { upper: true, fill: C.yellow, ls: 2 });
    doc.text("display", rx, 236, 42, m.title, { fill: C.onNight, ls: -1 });
    wrap("body", m.text, 21, rw).forEach((line, j) => doc.text("body", rx, 280 + j * 30, 21, line, { fill: C.onNightMuted }));
    doc.add(`</g>`);
  });
  const gy = 404, cw = rw / 2, ch = 80;
  doc.add(`<g fill="${C.lineNight}"><rect x="${rx}" y="${gy}" width="${rw}" height="2"/><rect x="${rx}" y="${gy + ch}" width="${rw}" height="2"/><rect x="${rx}" y="${gy + 2 * ch}" width="${rw}" height="2"/><rect x="${rx + cw}" y="${gy}" width="2" height="${2 * ch}"/></g>`);
  SHEET[lang].forEach(([k, v], i) => {
    const cx = rx + (i % 2) * cw + (i % 2 ? 24 : 0), cy = gy + Math.floor(i / 2) * ch;
    doc.text("mono", cx, cy + 30, 14, k, { upper: true, fill: C.onNightMuted, ls: 2 });
    doc.text("bodyBold", cx, cy + 66, 28, v, { fill: C.onNight });
  });
  return doc.render();
}

// ─── Inventário de tecnologias ──────────────────────────────────────
export async function inventory(lang, iconDir) {
  const t = T[lang].inventory;
  const slot = 84, gap = 22, rowH = 128, top = 168, x0 = 248;
  const H = top + INVENTORY.length * rowH + 40;
  const total = INVENTORY.reduce((a, c) => a + c.items.length, 0);
  const doc = new Doc(W, H, {
    title: `${t.title}: ${INVENTORY.map((c) => `${c[lang]} — ${c.items.map((i) => i[1]).join(", ")}`).join("; ")}`,
  });
  const b = panel(doc, "paper");
  doc.text("display", b.x, 112, 56, t.title, { ls: -1.5 });
  doc.text("mono", b.right, 110, 16, t.count(total), { upper: true, fill: C.muted, ls: 1.5, anchor: "end" });
  doc.add(`<rect x="${b.x}" y="134" width="${b.right - b.x}" height="2" fill="${C.line}"/>`);

  for (const [r, cat] of INVENTORY.entries()) {
    const y = top + r * rowH;
    doc.add(bitmap(ART.cursor, b.x, y + 24, 3));
    doc.text("monoBold", b.x + 26, y + 46, 17, cat[lang], { upper: true, ls: 1 });
    if (cat.training) doc.text("mono", b.x + 26, y + 70, 14, t.training, { fill: C.muted, ls: 1 });
    for (const [i, [id, label]] of cat.items.entries()) {
      const x = x0 + i * (slot + gap);
      doc.add(cat.training
        ? frame(x, y, slot, slot, { fill: C.paperDeep, border: C.muted, bw: 3, shadow: null, dashed: true })
        : frame(x, y, slot, slot, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: C.ink, sh: 5 }));
      const op = cat.training ? ` opacity=".55"` : "";
      if (id.startsWith("art:")) {
        const art = ART[id.slice(4)], sz = size(art), px = 4;
        doc.add(`<g${op}>${bitmap(art, x + (slot - sz.w * px) / 2, y + (slot - sz.h * px) / 2, px)}</g>`);
      } else {
        const svg = await readFile(join(iconDir, `${id}.svg`), "utf8");
        // ids prefixados: vários ícones convivem no mesmo SVG
        const inner = svg.replace(/id="([^"]+)"/g, `id="${id}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`).replace(/href="#([^"]+)"/g, `href="#${id}-$1"`);
        doc.add(`<svg x="${x + 15}" y="${y + 15}" width="${slot - 30}" height="${slot - 30}" viewBox="0 0 256 256"${op}>${inner}</svg>`);
      }
      doc.text("mono", x + slot / 2, y + slot + 28, 15, label, { anchor: "middle", fill: C.inkSoft });
    }
  }
  return doc.render();
}

// ─── Missão principal (PeopleOS) ────────────────────────────────────
export function featured(lang) {
  const p = FEATURED, t = p[lang];
  const H = 600;
  const doc = new Doc(W, H, {
    title: `${p.n} · ${p.title} — ${t.kind}`,
    desc: `${t.stats.map(([n, l]) => `${n} ${l}`).join(", ")}. Stack: ${p.stack.join(", ")}. ${t.status}.`,
  });
  const b = panel(doc, "night");

  const nw = measure("pixelBold", p.n, 20) + 24;
  doc.add(frame(b.x, 70, nw, 36, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
  doc.text("pixelBold", b.x + 12, 95, 20, p.n);
  doc.text("mono", b.x + nw + 16, 94, 16, t.tag, { upper: true, fill: C.yellow, ls: 2 });
  doc.text("display", b.x - 4, 200, 92, p.title, { fill: C.onNight, ls: -2.5 });
  doc.text("body", b.x, 242, 22, t.kind, { fill: C.onNightMuted });

  t.stats.forEach(([n, label], i) => {
    const x = b.x + i * 190;
    doc.text("pixelBold", x, 336, 54, n, { fill: C.yellow });
    wrap("body", label, 18, 160).forEach((l, j) => doc.text("body", x, 368 + j * 24, 18, l, { fill: C.onNightMuted }));
  });
  chipRow(doc, b.x, 428, p.stack, 590, { night: true, size: 15 });
  doc.add(`<rect x="${b.x}" y="${H - 80}" width="10" height="10" fill="${C.yellow}" class="blink"/>`);
  doc.text("mono", b.x + 22, H - 70, 15, t.status, { upper: true, fill: C.onNightMuted, ls: 1.5 });

  // Holerite em pixel art (valores em barras: nada de números inventados)
  const sx = 652, sy = 76, sw = 268, sh = 452;
  doc.add(frame(sx, sy, sw, sh, { fill: C.paper, border: C.ink, bw: 4, shadow: C.yellow, sh: 10 }));
  doc.text("pixelBold", sx + 24, sy + 50, 26, t.slip.title);
  doc.add(frame(sx + sw - 72, sy + 26, 48, 28, { fill: C.ink, border: null, shadow: null, s: 2 }));
  doc.text("monoBold", sx + sw - 48, sy + 46, 13, "PDF", { fill: C.yellow, anchor: "middle" });
  doc.add(`<rect x="${sx + 24}" y="${sy + 72}" width="${sw - 48}" height="2" fill="${C.ink}" stroke-dasharray="4 4"/>`);
  const bars = [84, 60, 46, 38, 52];
  t.slip.rows.forEach((label, i) => {
    const y = sy + 112 + i * 46;
    doc.text("mono", sx + 24, y, 13, label, { fill: C.inkSoft });
    const neg = i >= 3;
    doc.add(`<rect x="${sx + sw - 24 - bars[i]}" y="${y - 10}" width="${bars[i]}" height="10" fill="${neg ? C.muted : C.ink}"/>`);
    if (neg) doc.add(`<rect x="${sx + sw - 38 - bars[i]}" y="${y - 6}" width="8" height="3" fill="${C.muted}"/>`);
  });
  const ny = sy + 112 + 5 * 46;
  doc.add(`<rect x="${sx + 24}" y="${ny - 26}" width="${sw - 48}" height="3" fill="${C.ink}"/><rect x="${sx + 24}" y="${ny - 20}" width="${sw - 48}" height="3" fill="${C.ink}"/>`);
  doc.add(`<rect x="${sx + 20}" y="${ny - 4}" width="${sw - 40}" height="34" fill="${C.yellow}"/>`);
  doc.text("monoBold", sx + 30, ny + 19, 14, t.slip.net);
  doc.add(`<rect x="${sx + sw - 130}" y="${ny + 8}" width="96" height="12" fill="${C.ink}"/>`);
  let bx = sx + 24;
  [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2].forEach((wd, i) => {
    if (i % 2 === 0) doc.add(`<rect x="${bx}" y="${sy + sh - 66}" width="${wd * 3}" height="34" fill="${C.ink}"/>`);
    bx += wd * 3 + 2;
  });
  return doc.render();
}

// ─── Missões secundárias ────────────────────────────────────────────
export function quest(q, lang, meta) {
  const t = q[lang], title = pick(q.title, lang), labels = T[lang].quest;
  const H = 240;
  const doc = new Doc(W, H, { title: `${q.n} · ${title} — ${t.kind}`, desc: `Stack: ${q.stack.join(", ")}.${t.credit ? ` ${t.credit}.` : ""}` });
  doc.add(frame(4, 4, W - 16, H - 16, { fill: C.paper, border: C.ink, shadow: C.ink }));
  const right = W - 12 - 40;

  doc.add(frame(36, 36, 152, 152, { fill: C.paperDeep, border: C.ink, bw: 3, shadow: null }));
  const art = ART[q.art], sz = size(art), px = 7;
  doc.add(bitmap(art, 36 + (152 - sz.w * px) / 2, 36 + (152 - sz.h * px) / 2, px));

  const x = 220;
  const nw = measure("pixelBold", q.n, 17) + 20;
  doc.add(frame(x, 48, nw, 30, { fill: C.yellow, border: C.ink, bw: 2, shadow: null, s: 2 }));
  doc.text("pixelBold", x + 10, 69, 17, q.n);
  doc.text("mono", x + nw + 14, 69, 15, t.kind, { upper: true, fill: C.inkSoft, ls: 1 });
  doc.text("display", x - 2, 140, 54, title, { ls: -1.5 });

  // Canto direito: crédito de autoria (quando o projeto não é meu) ou "abrir missão"
  let tagW;
  if (t.credit) {
    tagW = measure("mono", t.credit, 14, 1) + 28;
    doc.add(frame(right - tagW, 164, tagW, 34, { fill: C.plum, border: null, shadow: null, s: 2 }));
    doc.text("mono", right - tagW + 14, 186, 14, t.credit, { upper: true, fill: C.onNight, ls: 1 });
  } else {
    const ow = measure("mono", labels.open, 15, 1);
    tagW = ow + 22;
    doc.text("mono", right - 18, 186, 15, labels.open, { upper: true, ls: 1, anchor: "end" });
    doc.add(bitmap(ART.cursor, right - 10, 170, 2));
  }
  chipRow(doc, x, 164, q.stack, right - tagW - 24, { size: 15 });

  if (meta?.stars) {
    const sw = doc.text("pixelBold", right, 70, 20, String(meta.stars), { anchor: "end" });
    doc.add(bitmap(ART.starFull, right - sw - 36, 52, 3));
  }
  return doc.render();
}

// ─── Mapa da missão: fluxo de uma requisição no PeopleOS ────────────
export function flow(lang) {
  const f = T[lang].flow;
  const H = 330;
  const nodes = [f.client, "Routes", "Middlewares", "Controllers", "Services", "Repositories", "MySQL"];
  const doc = new Doc(W, H, { title: `${f.title}: ${nodes.join(" → ")}; Services → ${f.audit}, ${f.pdf}` });
  const b = panel(doc, "night");
  doc.text("mono", b.x, 96, 15, f.title, { upper: true, fill: C.yellow, ls: 1.5 });

  const nh = 52, ny = 128, gapX = 18, nw = (b.right - b.x - gapX * (nodes.length - 1)) / nodes.length;
  const cxOf = (i) => b.x + i * (nw + gapX) + nw / 2;
  nodes.forEach((label, i) => {
    const x = b.x + i * (nw + gapX);
    const accent = i === 0 || i === nodes.length - 1;
    doc.add(frame(x, ny, nw, nh, { fill: accent ? C.yellow : C.night2, border: accent ? C.ink : C.night3, bw: 3, shadow: null, s: 3 }));
    const lines = wrap("mono", label, 12, nw - 18);
    lines.forEach((l, j) => doc.text("mono", x + nw / 2, ny + nh / 2 + 5 + (j - (lines.length - 1) / 2) * 14, 12, l, { anchor: "middle", fill: accent ? C.ink : C.onNight }));
    if (i < nodes.length - 1) doc.add(bitmap(ART.cursor, x + nw + 6, ny + nh / 2 - 7, 1.6, { k: C.onNightMuted, y: C.onNightMuted }));
  });
  doc.text("mono", (cxOf(1) + cxOf(3)) / 2, ny + nh + 28, 13, f.note, { anchor: "middle", fill: C.onNightMuted });

  // Ramificação: Services → auditoria e holerite
  const sv = cxOf(4), by = 248, bw = 190, ax = sv - bw - 20, px = sv + 20;
  doc.add(`<g fill="${C.onNightMuted}"><rect x="${sv - 1}" y="${ny + nh}" width="3" height="${by - ny - nh - 18}"/><rect x="${ax + bw / 2}" y="${by - 21}" width="${px + bw / 2 - ax - bw / 2}" height="3"/><rect x="${ax + bw / 2 - 1}" y="${by - 21}" width="3" height="21"/><rect x="${px + bw / 2 - 1}" y="${by - 21}" width="3" height="21"/></g>`);
  [[ax, f.audit], [px, f.pdf]].forEach(([x, label]) => {
    doc.add(frame(x, by, bw, 44, { fill: C.plum, border: C.night3, bw: 3, shadow: null, s: 3 }));
    doc.text("mono", x + bw / 2, by + 28, 14, label, { anchor: "middle", fill: C.onNight });
  });

  // Pacote (moeda) percorrendo o fluxo
  const path = `M${cxOf(0) - 10} ${ny - 26}H${cxOf(6) - 10}`;
  doc.add(`<g>${bitmap(ART.coin, 0, 0, 2)}<animateMotion path="${path}" dur="5s" repeatCount="indefinite" calcMode="linear"/></g>`);
  return doc.render();
}

// ─── Status (dados reais da API do GitHub) ──────────────────────────
export function status(lang, data) {
  const t = T[lang].status;
  const H = 584;
  const year = data.contrib?.year ?? new Date(data.generatedAt).getUTCFullYear();
  const rows = [
    [t.rows.repos, data.repos],
    [t.rows.stars, data.stars],
    [t.rows.followers, data.followers],
    ...(data.contrib ? [[t.rows.commits(year), data.contrib.commits], [t.rows.prs(year), data.contrib.prs], [t.rows.total, data.contrib.total]] : []),
  ];
  const langs = data.languages.slice(0, 6);
  const updated = new Date(data.generatedAt).toLocaleDateString(T[lang].locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Bahia" });
  const doc = new Doc(W, H, {
    title: t.title,
    desc: `${rows.map(([k, v]) => `${k}: ${v}`).join(". ")}. ${t.langs}: ${langs.map((l) => `${l.name} ${l.pct}%`).join(", ")}. ${t.updated} ${updated}.`,
  });
  const b = panel(doc, "night");
  doc.text("display", b.x, 110, 52, t.title, { fill: C.onNight, ls: -1.5 });
  doc.text("mono", b.right, 108, 14, `${t.updated} ${updated}`, { upper: true, fill: C.onNightMuted, ls: 1.5, anchor: "end" });
  doc.add(`<rect x="${b.x}" y="134" width="${b.right - b.x}" height="2" fill="${C.lineNight}"/>`);

  const lx = b.x, lr = 462;
  rows.forEach(([label, value], i) => {
    const y = 196 + i * 56;
    doc.add(bitmap(ART.cursor, lx, y - 22, 3));
    doc.text("body", lx + 26, y, 21, label, { fill: C.onNightMuted });
    doc.text("pixelBold", lr, y + 2, 32, String(value), { fill: C.yellow, anchor: "end" });
    if (i < rows.length - 1) doc.add(`<rect x="${lx + 26}" y="${y + 20}" width="${lr - lx - 26}" height="2" fill="${C.lineNight}"/>`);
  });

  const rx = 530, rr = b.right, segs = 20, sg = 4;
  const sw = (rr - rx - sg * (segs - 1)) / segs;
  doc.text("mono", rx, 180, 14, t.langs, { upper: true, fill: C.onNightMuted, ls: 1.5 });
  langs.forEach((l, i) => {
    const y = 224 + i * 48;
    doc.text("body", rx, y, 20, l.name, { fill: C.onNight });
    doc.text("mono", rr, y, 17, `${l.pct.toFixed(1)}%`, { fill: C.onNightMuted, anchor: "end" });
    const filled = l.pct > 0 ? Math.max(1, Math.round(l.pct / (100 / segs))) : 0;
    let bars = "";
    for (let k = 0; k < segs; k++) bars += `<rect x="${(rx + k * (sw + sg)).toFixed(1)}" y="${y + 13}" width="${sw.toFixed(1)}" height="12" fill="${k < filled ? C.yellow : C.night3}"/>`;
    doc.add(`<g shape-rendering="crispEdges">${bars}</g>`);
  });
  doc.text("mono", rx, H - 62, 13, t.note, { fill: C.onNightMuted });
  return doc.render();
}

// ─── Conquistas ─────────────────────────────────────────────────────
export function achievements(lang) {
  const t = T[lang].achievements;
  const tw = 436, th = 128, gx = 24, gy = 24, top = 164;
  const H = top + 3 * th + 2 * gy + 60;
  const doc = new Doc(W, H, { title: `${t.title}: ${ACHIEVEMENTS.map((a) => `${a[lang][1]} (${a[lang][0]})`).join("; ")}` });
  const b = panel(doc, "paper");
  doc.text("display", b.x, 112, 56, t.title, { ls: -1.5 });
  doc.add(bitmap(ART.coin, b.right - 96, 84, 3));
  doc.text("pixelBold", b.right, 110, 30, `×${ACHIEVEMENTS.length}`, { anchor: "end" });
  doc.add(`<rect x="${b.x}" y="134" width="${b.right - b.x}" height="2" fill="${C.line}"/>`);

  ACHIEVEMENTS.forEach((a, i) => {
    const x = b.x + (i % 2) * (tw + gx), y = top + Math.floor(i / 2) * (th + gy);
    const [cat, title] = a[lang];
    doc.add(frame(x, y, tw, th, { fill: C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
    doc.add(frame(x + 18, y + 18, 92, 92, { fill: C.paperDeep, border: C.ink, bw: 2, shadow: null }));
    const art = ART[a.art], sz = size(art), px = 6;
    doc.add(bitmap(art, x + 18 + (92 - sz.w * px) / 2, y + 18 + (92 - sz.h * px) / 2, px));
    doc.text("mono", x + 132, y + 40, 13, cat, { upper: true, fill: C.inkSoft, ls: 1.2 });
    const lines = wrap("bodyBold", title, 24, tw - 150);
    lines.slice(0, 2).forEach((l, j) => doc.text("bodyBold", x + 132, y + 76 + j * 30, 24, l));
  });
  return doc.render();
}

// ─── Contato: tela de "Continue?" ───────────────────────────────────
export function continueScreen(lang) {
  const t = T[lang].contact;
  const H = 320;
  const doc = new Doc(W, H, { title: `${t.title} ${t.line1} ${t.line2}` });
  doc.style(`.cd{opacity:0;animation:cd 10s step-end infinite}@keyframes cd{0%{opacity:1}10%{opacity:0}}
@media (prefers-reduced-motion:reduce){.cd-9{opacity:1}}`);
  const b = panel(doc, "night");
  const cw = doc.text("pixelBold", b.x, 136, 80, t.title, { fill: C.yellow, upper: true });
  for (let n = 9; n >= 0; n--) {
    doc.add(`<g class="cd cd-${n}" style="animation-delay:${9 - n}s">`);
    doc.text("pixelBold", b.x + cw + 28, 136, 80, String(n), { fill: C.onNight });
    doc.add(`</g>`);
  }
  doc.text("display", b.x, 206, 46, t.line1, { fill: C.onNight, ls: -1 });
  doc.text("display", b.x, 258, 46, t.line2, { fill: C.onNight, ls: -1 });
  doc.add(`<g class="bob">${bitmap(ART.coin, 846, 80, 7)}</g>`);
  doc.add(`<g class="twinkle">${bitmap(ART.sparkle, 812, 184, 4)}</g>`);
  return doc.render();
}

export function contactButton(c, lang) {
  const label = c[lang];
  const doc = new Doc(300, 76, { title: label });
  doc.add(frame(2, 2, 288, 64, { fill: c.primary ? C.yellow : C.paper, border: C.ink, bw: 3, shadow: C.ink, sh: 6 }));
  const art = ART[c.art], sz = size(art);
  doc.add(bitmap(art, 24, 34 - (sz.h * 3) / 2, 3));
  doc.text("bodyBold", 70, 42, 21, label);
  doc.add(bitmap(ART.cursor, 262, 25, 2, { y: c.primary ? C.ink : C.yellow }));
  return doc.render();
}

// ─── Peças de interface ─────────────────────────────────────────────
export function langButton(code, name, active) {
  const doc = new Doc(176, 52, { title: name });
  const o = active ? 4 : 0;
  doc.add(frame(2 + o, 2 + o, 164, 42, { fill: active ? C.yellow : C.paper, border: C.ink, bw: 3, shadow: active ? null : C.ink, sh: 4 }));
  doc.text("monoBold", 20 + o, 29 + o, 14, code, { fill: active ? C.ink : C.muted });
  doc.text("bodyBold", 52 + o, 30 + o, 17, name, { fill: active ? C.ink : C.inkSoft });
  return doc.render();
}

export function cursorIcon() {
  const doc = new Doc(18, 28);
  doc.add(bitmap(ART.cursor, 0, 0, 3));
  return doc.render();
}

export function divider() {
  const doc = new Doc(W, 24);
  let dots = "";
  for (let x = 0; x < W; x += 16) if (Math.abs(x + 4 - W / 2) > 40) dots += `<rect x="${x}" y="10" width="8" height="4" fill="${C.muted}" opacity=".55"/>`;
  doc.add(`<g shape-rendering="crispEdges">${dots}</g>`);
  doc.add(bitmap(ART.coin, W / 2 - 10, 2, 2));
  return doc.render();
}

export function footer(lang, sprites) {
  const t = T[lang].footer;
  const H = 280;
  const doc = new Doc(W, H, { title: `${t.title} — ${t.sub}` });
  doc.def(`<clipPath id="inside"><path d="${stepPath(8, 8, W - 24, H - 24)}"/></clipPath>`);
  doc.style(`.walk{animation:walk 14s linear infinite}@keyframes walk{from{transform:translateX(-120px)}to{transform:translateX(1040px)}}
.hop{animation:hop .5s steps(2) infinite}@keyframes hop{50%{transform:translateY(-3px)}}`);
  panel(doc, "night");
  doc.text("pixelBold", W / 2, 106, 46, t.title, { fill: C.yellow, anchor: "middle", upper: true });
  doc.text("body", W / 2, 146, 19, t.sub, { fill: C.onNightMuted, anchor: "middle" });

  // Chão de blocos
  const gy = 212;
  let ground = `<rect x="0" y="${gy}" width="${W}" height="6" fill="${C.yellow}"/>`;
  for (let x = 0, k = 0; x < W; x += 40, k++) {
    ground += `<rect x="${x}" y="${gy + 6}" width="38" height="20" fill="${C.night3}"/><rect x="${x + (k % 2 ? 20 : 0) - 20}" y="${gy + 28}" width="38" height="20" fill="${C.night2}"/>`;
  }
  [180, 420, 640, 860].forEach((x, i) => (ground += `<g class="bob" style="animation-delay:${i * 0.3}s">${bitmap(ART.coin, x, gy - 58, 3)}</g>`));

  const s = sprites["modo-estudo"];
  const walker = s
    ? (() => { const f = fit(s, 0, 0, 96, 96); return image(s.href, f.x, gy - 92, f.w, f.h); })()
    : bitmap(ART.coin, -15, gy - 34, 3);
  doc.add(`<g clip-path="url(#inside)">${ground}<g class="walk"><g class="hop">${walker}</g></g></g>`);
  return doc.render();
}
