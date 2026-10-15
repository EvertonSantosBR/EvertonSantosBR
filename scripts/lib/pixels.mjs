// Pixel art desenhada à mão como bitmaps de texto: cada caractere é um "pixel".
// '.' = transparente. As cores vêm da paleta do portfólio.
import { C } from "./theme.mjs";

const PALETTE = {
  k: C.ink, y: C.yellow, Y: C.yellowDeep, w: C.paper, d: C.paperDeep,
  p: C.plum, b: C.blue, n: C.night3, m: C.muted, o: C.onNight,
};

/**
 * Converte um bitmap em <rect>s, juntando pixels vizinhos da mesma cor numa linha só.
 * `colors` sobrescreve a paleta (ex.: { k: C.onNight } para usar o ícone sobre fundo escuro).
 */
export function bitmap(rows, x, y, px, colors = {}, attrs = "") {
  const pal = { ...PALETTE, ...colors };
  let out = "";
  rows.forEach((row, j) => {
    let i = 0;
    while (i < row.length) {
      const ch = row[i];
      let n = 1;
      while (row[i + n] === ch) n++;
      if (ch !== "." && pal[ch]) out += `<rect x="${x + i * px}" y="${y + j * px}" width="${n * px}" height="${px}" fill="${pal[ch]}"/>`;
      i += n;
    }
  });
  return `<g shape-rendering="crispEdges" ${attrs}>${out}</g>`;
}

export const size = (rows) => ({ w: Math.max(...rows.map((r) => r.length)), h: rows.length });

export const ART = {
  cursor: [
    "k....",
    "kk...",
    "kyk..",
    "kyyk.",
    "kyyyk",
    "kyyk.",
    "kyk..",
    "kk...",
    "k....",
  ],
  arrowDown: [
    "kkkkkkkkk",
    "kyyyyyyyk",
    ".kyyyyyk.",
    "..kyyyk..",
    "...kyk...",
    "....k....",
  ],
  star: [
    "...y...",
    "...y...",
    "..yyy..",
    "yyyyyyy",
    "..yyy..",
    "...y...",
    "...y...",
  ],
  sparkle: [
    "..y..",
    "..y..",
    "yyyyy",
    "..y..",
    "..y..",
  ],
  starFull: [
    "....Y....",
    "...YYY...",
    "YYYYYYYYY",
    ".YYYYYYY.",
    "..YYYYY..",
    ".YYY.YYY.",
    ".YY...YY.",
  ],
  coin: [
    "...kkkk...",
    ".kkyyyykk.",
    ".kwyyyyYk.",
    "kywyyyyyYk",
    "kywyYYyyYk",
    "kyyyYYyyYk",
    "kyyyyyyyYk",
    ".kyyyyyYk.",
    ".kkYYYYkk.",
    "...kkkk...",
  ],

  // Botões de contato (monocromáticos: herdam a cor via `colors`)
  calendar: [
    "..k....k...",
    "kkkkkkkkkkk",
    "k.........k",
    "kkkkkkkkkkk",
    "k.........k",
    "k.k..k..k.k",
    "k.........k",
    "k.k..k..k.k",
    "k.........k",
    "kkkkkkkkkkk",
  ],
  mail: [
    "kkkkkkkkkkkkk",
    "kk.........kk",
    "k.k.......k.k",
    "k..k.....k..k",
    "k...k...k...k",
    "k....kkk....k",
    "k...........k",
    "k...........k",
    "kkkkkkkkkkkkk",
  ],
  linkedin: [
    "kkkkkkkkkkk",
    "k.kkkkkkkkk",
    "kkkkkkkkkkk",
    "k.kk...kkkk",
    "k.kk.kk.kkk",
    "k.kk.kk.kkk",
    "k.kk.kk.kkk",
    "k.kk.kk.kkk",
    "kkkkkkkkkkk",
  ],
  globe: [
    "...kkkkk...",
    "..k..k..k..",
    ".k..k.k..k.",
    "kkkkkkkkkkk",
    "k...k.k...k",
    "k...k.k...k",
    "k...k.k...k",
    "kkkkkkkkkkk",
    ".k..k.k..k.",
    "..k..k..k..",
    "...kkkkk...",
  ],

  // Conquistas
  briefcase: [
    "....kkkk....",
    "...k....k...",
    "kkkkkkkkkkkk",
    "kyyyyyyyyyyk",
    "kyyyyyyyyyyk",
    "kkkkkkkkkkkk",
    "kyyyykkyyyyk",
    "kyyyykkyyyyk",
    "kyyyyyyyyyyk",
    "kyyyyyyyyyyk",
    "kkkkkkkkkkkk",
  ],
  blocks: [
    "kkkk.kkkk.kkkk",
    "kyyk.kyyk.kyyk",
    "kyykkkyykkkyyk",
    "kyyk.kyyk.kyyk",
    "kkkk.kkkk.kkkk",
  ],
  flag: [
    "kk..........",
    "kkkkkkkk....",
    "kkyyyyyykk..",
    "kkyyyyyyyykk",
    "kkyyyyyykk..",
    "kkkkkkkk....",
    "kk..........",
    "kk..........",
    "kk..........",
    "kk..........",
    "kkkk........",
    "kkkkkk......",
  ],
  book: [
    ".kkkk..kkkk.",
    "kwwwwkkwwwwk",
    "kwkkwkkwkkwk",
    "kwwwwkkwwwwk",
    "kwkkwkkwkkwk",
    "kwwwwkkwwwwk",
    "kwkkwkkwkkwk",
    "kwwwwkkwwwwk",
    "kkkkkkkkkkkk",
    ".....kk.....",
  ],
  pointer: [
    "k..........",
    "kk.........",
    "kwk........",
    "kwwk.......",
    "kwwwk......",
    "kwwwwk.....",
    "kwwwwwk....",
    "kwwwwwwk...",
    "kwwwwwwwk..",
    "kwwwwkkkkk.",
    "kwwkwwk....",
    "kwk.kwwk...",
    "kk...kwwk..",
    "k.....kk...",
  ],
  diploma: [
    ".kkkkkkkkkk.",
    "kwwwwwwwwwwk",
    "kwkkkkkkkkwk",
    "kwwwwwwwwwwk",
    "kwkkkkkkwwwk",
    "kwwwwwwwwwwk",
    "kwkkkkwwyywk",
    "kwwwwwwyyyyk",
    ".kkkkkkkyykk",
    ".......y..y.",
  ],

  // Ilustrações das missões (16×16)
  hand: [
    "....k.k.k.k.....",
    "...kykykykyk....",
    "...kykykykyk..b.",
    "...kykykykyk.b..",
    "...kykykykyk....",
    ".k.kyyyyyyyk.bb.",
    "kykkyyyyyyyk....",
    "kyykyyyyyyyk.b..",
    ".kyyyyyyyyyk..b.",
    "..kyyyyyyyyk....",
    "..kyyyyyyyyk....",
    "...kyyyyyyk.....",
    "...kyyyyyyk.....",
    "...kkkkkkkk.....",
  ],
  bin: [
    "..........kkkk..",
    ".........kyyyyk.",
    ".........kyYyyk.",
    ".........kyYyyk.",
    ".........kyyyyk.",
    "....kkkk..kkkk..",
    ".kkkkkkkkkkk....",
    ".kbbbbbbbbbk....",
    ".kkkkkkkkkkk....",
    "..kddkddkddk....",
    "..kddkddkddk....",
    "..kddkddkddk....",
    "..kddkddkddk....",
    "..kddkddkddk....",
    "...kkkkkkkk.....",
  ],
  books: [
    "y...............",
    "................",
    "....kkkkkkkkkk..",
    "....kppppppppk..",
    "....kkkkkkkkkk..",
    "..kkkkkkkkkkkk..",
    "..kyyyyyyyyyyk..",
    "..kyykkkkkkyyk..",
    "..kkkkkkkkkkkk..",
    "...kkkkkkkkkkkk.",
    "...kbbbbbbbbbbk.",
    "...kbbbbbbbbbbk.",
    "...kkkkkkkkkkkk.",
  ],
  form: [
    ".kkkkkkkkkkkkkk.",
    ".kwwwwwwwwwwwwk.",
    ".kwkkkkwwwwwwwk.",
    ".kwwwwwwwwwwwwk.",
    ".kwbbbbbbbbbbwk.",
    ".kwwwwwwwwwwwwk.",
    ".kwkkwwwwwwwwwk.",
    ".kwbbbbbbbbbbwk.",
    ".kwwwwwwwwwwwwk.",
    ".kwwwwwwwyyyywk.",
    ".kwwwwwwwyyyywk.",
    ".kwwwwwwwwwwwwk.",
    ".kkkkkkkkkkkkkk.",
  ],

  // Itens do inventário sem ícone oficial no skillicons
  hardhat: [
    "................",
    "................",
    "................",
    "................",
    ".....kkkkkk.....",
    "....kyyyyyyk....",
    "...kyyykkyyyk...",
    "..kyyyykkyyyyk..",
    "..kyyyykkyyyyk..",
    ".kkkkkkkkkkkkkk.",
    "kyyyyyyyyyyyyyyk",
    "kkkkkkkkkkkkkkkk",
  ],
  gem: [
    ".......kk.......",
    "......kbbk......",
    ".....kbbbbk.....",
    "....kbbbbbbk....",
    "...kbbbbbbbbk...",
    "..kkkbbbbbbkkk..",
    "...kkkkkkkkkk...",
    "....kbbbbbbk....",
    ".....kbbbbk.....",
    "......kbbk......",
    ".......kk.......",
  ],
};
