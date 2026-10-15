// Sprites do personagem (os mesmos do portfólio), lidos de assets/pixel/.
// São opcionais: se um arquivo faltar, os painéis usam um substituto em pixel art.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const TYPES = { png: "image/png", webp: "image/webp", gif: "image/gif" };

/** Lê largura/altura do cabeçalho (PNG ou WebP) sem dependências. */
function dimensions(buf, ext) {
  if (ext === "png") return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (ext === "webp") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

export async function loadSprites(dir, names) {
  const sprites = {};
  for (const name of names) {
    for (const ext of Object.keys(TYPES)) {
      try {
        const buf = await readFile(join(dir, `${name}.${ext}`));
        const dim = dimensions(buf, ext);
        if (!dim) continue;
        sprites[name] = { href: `data:${TYPES[ext]};base64,${buf.toString("base64")}`, ...dim };
        break;
      } catch {
        /* tenta a próxima extensão */
      }
    }
  }
  return sprites;
}

/** Encaixa o sprite numa caixa preservando a proporção; devolve x, y, w, h. */
export function fit(sprite, cx, cy, maxW, maxH) {
  const k = Math.min(maxW / sprite.w, maxH / sprite.h);
  const w = sprite.w * k, h = sprite.h * k;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
