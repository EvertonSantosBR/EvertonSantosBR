// Fontes do portfólio embutidas nos SVGs.
// O GitHub exibe os SVGs como <img>, que não carrega fontes externas — por isso cada SVG
// leva só os glifos que usa (subset em woff2, alguns KB), e o texto sai igual ao do site.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import subsetFont from "subset-font";
import * as fontkit from "fontkit";

const DIR = join(import.meta.dirname, "..", "fonts");

// Cada "face" é uma instância fixa (eixos variáveis travados) de um arquivo-fonte.
export const FACES = {
  display: { file: "bricolage-grotesque.woff2", axes: { wght: 800, wdth: 80, opsz: 96 }, fallback: "'Arial Narrow','Helvetica Neue',Arial,sans-serif" },
  body: { file: "bricolage-grotesque.woff2", axes: { wght: 500, wdth: 100, opsz: 14 }, fallback: "'Segoe UI',system-ui,Arial,sans-serif" },
  bodyBold: { file: "bricolage-grotesque.woff2", axes: { wght: 700, wdth: 100, opsz: 24 }, fallback: "'Segoe UI',system-ui,Arial,sans-serif" },
  mono: { file: "jetbrains-mono-400.woff2", fallback: "ui-monospace,Consolas,'Liberation Mono',monospace" },
  monoBold: { file: "jetbrains-mono-700.woff2", fallback: "ui-monospace,Consolas,'Liberation Mono',monospace" },
  pixel: { file: "pixelify-sans-500.woff2", fallback: "ui-monospace,Consolas,monospace" },
  pixelBold: { file: "pixelify-sans-700.woff2", fallback: "ui-monospace,Consolas,monospace" },
};

// Latin-1 + Latin Extended-A + pontuação usada nos textos
const CHARSET =
  Array.from({ length: 0x17f - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i)).join("") + "—–·•°“”‘’…";

const sources = new Map();
const metrics = new Map();

async function source(file) {
  if (!sources.has(file)) sources.set(file, await readFile(join(DIR, file)));
  return sources.get(file);
}

const opts = (face, targetFormat) => ({ targetFormat, ...(face.axes && { variationAxes: face.axes }) });

/** Carrega uma instância estática de cada face para medir texto (larguras reais, não estimadas). */
export async function loadFonts() {
  for (const [key, face] of Object.entries(FACES)) {
    const ttf = await subsetFont(await source(face.file), CHARSET, opts(face, "truetype"));
    metrics.set(key, fontkit.create(ttf));
  }
}

/** Largura do texto em px para a face, tamanho e espaçamento entre letras dados. */
export function measure(key, text, size, letterSpacing = 0) {
  const font = metrics.get(key);
  if (!font) throw new Error(`fonte não carregada: ${key}`);
  const run = font.layout(String(text));
  return (run.advanceWidth / font.unitsPerEm) * size + letterSpacing * Math.max(0, [...String(text)].length - 1);
}

/** Bloco <style> com @font-face só dos glifos usados em cada face. */
export async function fontCss(used) {
  let css = "";
  for (const [key, chars] of used) {
    const face = FACES[key];
    const text = [...chars].join("") || " ";
    const woff2 = await subsetFont(await source(face.file), text, opts(face, "woff2"));
    css += `@font-face{font-family:es-${key};src:url(data:font/woff2;base64,${Buffer.from(woff2).toString("base64")}) format("woff2")}`;
    css += `.f-${key}{font-family:es-${key},${face.fallback}}`;
  }
  return css;
}

/**
 * Quebra texto com trechos em **negrito** em linhas de "runs" [{t, face}], medindo cada palavra
 * na face certa. `bold` é a face usada dentro dos **...**.
 */
export function richLines(text, face, bold, size, maxWidth) {
  const words = [];
  String(text).split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    const isBold = part.startsWith("**");
    const clean = isBold ? part.slice(2, -2) : part;
    clean.split(/(\s+)/).forEach((w) => {
      if (w === "") return;
      if (/^\s+$/.test(w)) words.push({ space: true });
      else words.push({ t: w, face: isBold ? bold : face });
    });
  });
  const lines = [];
  let line = [], width = 0, pendingSpace = false;
  const spaceW = measure(face, " ", size);
  for (const w of words) {
    if (w.space) { pendingSpace = line.length > 0; continue; }
    const ww = measure(w.face, w.t, size);
    const add = (pendingSpace ? spaceW : 0) + ww;
    if (line.length && width + add > maxWidth) {
      lines.push(line);
      line = [{ t: w.t, face: w.face }];
      width = ww;
    } else {
      if (pendingSpace) line.push({ t: " ", face });
      line.push({ t: w.t, face: w.face });
      width += add;
    }
    pendingSpace = false;
  }
  if (line.length) lines.push(line);
  // junta runs vizinhos da mesma face
  return lines.map((l) => l.reduce((acc, r) => {
    const last = acc[acc.length - 1];
    if (last && last.face === r.face) last.t += r.t; else acc.push({ ...r });
    return acc;
  }, []));
}

/** Quebra um texto em linhas que caibam em `maxWidth`. */
export function wrap(key, text, size, maxWidth, letterSpacing = 0) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(key, next, size, letterSpacing) > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
