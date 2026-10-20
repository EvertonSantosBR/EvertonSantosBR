// Primitivas de SVG: documento com fontes embutidas, texto medido, molduras em pixel art.
import { C, PX } from "./theme.mjs";
import { fontCss, measure } from "./fonts.mjs";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const r = (n) => Math.round(n * 100) / 100;

// Movimento reduzido (prefers-reduced-motion): no Windows isso fica ativo quando "Efeitos de
// animação" está desligado. Em vez de desligar tudo, trocamos só os deslocamentos (quicar,
// empurrar, girar) por versões de opacidade — brilho, piscar, trocas e contagens continuam.
// Movimento suave (ease) para entradas e flutuação; "steps" só onde o pixel pede (piscar).
const EASE = "cubic-bezier(.16,1,.3,1)";
const BASE_CSS = `
text{white-space:pre}
.blink{animation:blink 1.2s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.bob{animation:bob 2.2s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-8px)}}
.twinkle{animation:twinkle 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.6)}}
.spin{animation:spin 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes spin{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.12)}}
.fade{animation:fade .8s ${EASE} both}
@keyframes fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.pop{animation:pop .6s ${EASE} both;transform-box:fill-box;transform-origin:center}
@keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
.grow{animation:grow 1.2s ${EASE} both;transform-box:fill-box;transform-origin:left}
@keyframes grow{from{transform:scaleX(0)}}
.nudge{animation:nudge 1.4s ease-in-out infinite}
@keyframes nudge{50%{transform:translateX(6px)}}
.breathe{animation:breathe 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes breathe{50%{transform:scale(1.035)}}
@media (prefers-reduced-motion:reduce){
.bob,.nudge,.breathe{animation:none}
.spin{animation:glint 2.8s ease-in-out infinite}
@keyframes glint{50%{opacity:.45}}
.twinkle{animation:glow 2.6s ease-in-out infinite}
@keyframes glow{50%{opacity:.2}}
.fade{animation:show .8s ease both}.pop{animation:show .6s ease both}
@keyframes show{from{opacity:0}}
}`;

/** Atraso de animação (para entradas em sequência). */
export const delay = (s) => `style="animation-delay:${s.toFixed(2)}s"`;

export class Doc {
  /**
   * @param {number} w largura do viewBox
   * @param {number} h altura do viewBox
   * @param {{title:string, desc?:string}} a11y texto alternativo do SVG
   */
  constructor(w, h, { title, desc } = {}) {
    Object.assign(this, { w, h, title, desc, parts: [], defs: [], css: [], used: new Map() });
  }

  add(...svg) {
    this.parts.push(...svg);
    return this;
  }

  def(...svg) {
    this.defs.push(...svg);
    return this;
  }

  style(css) {
    this.css.push(css);
    return this;
  }

  use(face, text) {
    if (!this.used.has(face)) this.used.set(face, new Set());
    for (const ch of String(text)) this.used.get(face).add(ch);
  }

  /**
   * Texto numa face do portfólio. `runs` pode ser string ou [{t, fill?, face?}] para trechos coloridos.
   * Retorna a largura medida (útil para posicionar o próximo elemento).
   */
  text(face, x, y, size, runs, { fill = C.ink, anchor = "start", ls = 0, upper = false, attrs = "", opacity } = {}) {
    const list = (Array.isArray(runs) ? runs : [{ t: runs }]).map((p) => ({ ...p, t: upper ? String(p.t).toUpperCase() : String(p.t) }));
    let width = 0;
    const spans = list.map((p) => {
      const f = p.face ?? face;
      this.use(f, p.t);
      width += measure(f, p.t, size, ls);
      const cls = f !== face ? ` class="f-${f}"` : "";
      const fl = p.fill ? ` fill="${p.fill}"` : "";
      return list.length === 1 && !p.fill && f === face ? esc(p.t) : `<tspan${cls}${fl}>${esc(p.t)}</tspan>`;
    });
    const op = opacity !== undefined ? ` opacity="${opacity}"` : "";
    const lsAttr = ls ? ` letter-spacing="${ls}"` : "";
    const anchorAttr = anchor !== "start" ? ` text-anchor="${anchor}"` : "";
    this.parts.push(
      `<text x="${r(x)}" y="${r(y)}" class="f-${face}" font-size="${size}" fill="${fill}"${lsAttr}${anchorAttr}${op} ${attrs}>${spans.join("")}</text>`,
    );
    return width;
  }

  async render() {
    const fonts = await fontCss(this.used);
    const label = this.title ? ` role="img" aria-labelledby="t${this.desc ? " d" : ""}"` : ` role="presentation"`;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" viewBox="0 0 ${this.w} ${this.h}"${label}>`,
      this.title ? `<title id="t">${esc(this.title)}</title>` : "",
      this.desc ? `<desc id="d">${esc(this.desc)}</desc>` : "",
      `<style>${fonts}${BASE_CSS}${this.css.join("")}</style>`,
      this.defs.length ? `<defs>${this.defs.join("")}</defs>` : "",
      ...this.parts,
      `</svg>`,
    ]
      .filter(Boolean)
      .join("\n");
  }
}

/** Polígono de retângulo com cantos em escada (2 degraus de `s` px) — a moldura "de jogo". */
export function stepPath(x, y, w, h, s = PX) {
  const p = [
    [x + 2 * s, y], [x + w - 2 * s, y], [x + w - 2 * s, y + s], [x + w - s, y + s], [x + w - s, y + 2 * s], [x + w, y + 2 * s],
    [x + w, y + h - 2 * s], [x + w - s, y + h - 2 * s], [x + w - s, y + h - s], [x + w - 2 * s, y + h - s], [x + w - 2 * s, y + h],
    [x + 2 * s, y + h], [x + 2 * s, y + h - s], [x + s, y + h - s], [x + s, y + h - 2 * s], [x, y + h - 2 * s],
    [x, y + 2 * s], [x + s, y + 2 * s], [x + s, y + s], [x + 2 * s, y + s],
  ];
  return `M${p.map(([a, b]) => `${r(a)} ${r(b)}`).join("L")}Z`;
}

/**
 * Moldura pixelada: sombra dura deslocada + borda + preenchimento.
 * @returns {string}
 */
export function frame(x, y, w, h, { fill = C.paper, border = C.ink, bw = PX, shadow = C.ink, sh = 8, s = PX, dashed = false } = {}) {
  let out = "";
  if (shadow) out += `<path d="${stepPath(x + sh, y + sh, w, h, s)}" fill="${shadow}"/>`;
  if (dashed) {
    out += `<path d="${stepPath(x, y, w, h, s)}" fill="${fill}"/>`;
    out += `<path d="${stepPath(x + bw / 2, y + bw / 2, w - bw, h - bw, s)}" fill="none" stroke="${border}" stroke-width="${bw}" stroke-dasharray="${bw * 2} ${bw * 2}"/>`;
    return out;
  }
  if (border) out += `<path d="${stepPath(x, y, w, h, s)}" fill="${border}"/>`;
  out += `<path d="${stepPath(x + (border ? bw : 0), y + (border ? bw : 0), w - (border ? 2 * bw : 0), h - (border ? 2 * bw : 0), s)}" fill="${fill}"/>`;
  return out;
}

/** Painel de fundo ocupando o SVG inteiro (deixa espaço para a sombra). */
export function panel(doc, theme = "paper") {
  const night = theme === "night";
  doc.add(
    frame(4, 4, doc.w - 16, doc.h - 16, {
      fill: night ? C.night : C.paper,
      border: night ? C.night3 : C.ink,
      shadow: night ? C.plum : C.ink,
    }),
  );
  return { x: 4 + 44, y: 4 + 44, right: doc.w - 12 - 44, bottom: doc.h - 12 - 44, night };
}

/**
 * Etiqueta de tecnologia com borda pixelada. Retorna a largura ocupada.
 */
export function chip(doc, x, y, label, { night = false, size = 16, accent = false } = {}) {
  const padX = 12, h = size + 18;
  const w = measure("mono", label, size) + padX * 2;
  const fill = accent ? C.yellow : night ? C.night2 : C.paper;
  const border = accent ? C.ink : night ? C.night3 : C.ink;
  const color = accent ? C.ink : night ? C.onNight : C.ink;
  doc.add(frame(x, y, w, h, { fill, border, bw: 2, shadow: null, s: 2 }));
  doc.text("mono", x + padX, y + h / 2 + size * 0.36, size, label, { fill: color });
  return w;
}

/** Linha de chips com quebra automática. Retorna o y logo abaixo da última linha. */
export function chipRow(doc, x, y, labels, maxRight, opts = {}) {
  const size = opts.size ?? 16, gap = 10, h = size + 18;
  let cx = x, cy = y;
  for (const label of labels) {
    const w = measure("mono", label, size) + 24;
    if (cx > x && cx + w > maxRight) {
      cx = x;
      cy += h + gap;
    }
    cx += chip(doc, cx, cy, label, opts) + gap;
  }
  return cy + h;
}

/** Imagem raster embutida como data URI (o GitHub bloqueia referências externas dentro do SVG). */
export function image(href, x, y, w, h, extra = "") {
  return `<image href="${href}" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" preserveAspectRatio="xMidYMid meet" style="image-rendering:pixelated" ${extra}/>`;
}
