// Gera todos os SVGs do README de perfil — português em assets/pt/ e inglês em assets/en/.
// Uso: npm run render   (GITHUB_TOKEN opcional — habilita commits/PRs/contribuições)
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { loadFonts } from "./lib/fonts.mjs";
import { loadGithub } from "./lib/github.mjs";
import { loadSprites } from "./lib/sprites.mjs";
import { USER, QUESTS, CONTACTS, T } from "./content.mjs";
import * as P from "./panels.mjs";
import * as M from "./panels-mobile.mjs";

const ROOT = join(import.meta.dirname, "..");
const ASSETS = join(ROOT, "assets");

async function out(rel, svg) {
  const file = join(ASSETS, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, (await svg).replace(/\n\s*\n/g, "\n"));
  console.log("✓", rel);
}

await loadFonts();
const sprites = await loadSprites(join(ASSETS, "pixel"), ["everton-dev", "modo-dev", "modo-backend", "modo-estudo"]);
console.log("sprites:", Object.keys(sprites).join(", ") || "nenhum (usando substitutos em pixel art)");
const { data, fresh } = await loadGithub(USER, join(ASSETS, "generated", "data.json"));
console.log(`dados do GitHub: ${data ? (fresh ? "atualizados" : "do cache") : "indisponíveis"}`);

// Peças sem idioma
await out("ui/cursor.svg", P.cursorIcon());
await out("ui/divider.svg", P.divider());
for (const lang of ["pt", "en"]) {
  await out(`ui/lang-${lang}-on.svg`, P.langButton(lang.toUpperCase(), T.pt.lang[lang], true));
  await out(`ui/lang-${lang}-off.svg`, P.langButton(lang.toUpperCase(), T.pt.lang[lang], false));
}

for (const lang of ["pt", "en"]) {
  await out(`${lang}/hero.svg`, P.hero(lang, sprites));
  await out(`${lang}/character.svg`, P.character(lang, sprites));
  await out(`${lang}/inventory.svg`, P.inventory(lang, join(import.meta.dirname, "icons")));
  await out(`${lang}/missions/peopleos.svg`, P.featured(lang));
  await out(`${lang}/missions/flow.svg`, P.flow(lang));
  for (const q of QUESTS) await out(`${lang}/missions/${q.file}.svg`, P.quest(q, lang, data?.repoMeta?.[q.repo]));
  if (data) await out(`${lang}/status.svg`, P.status(lang, data));
  await out(`${lang}/achievements.svg`, P.achievements(lang));
  await out(`${lang}/continue.svg`, P.continueScreen(lang));
  for (const c of CONTACTS) await out(`${lang}/contact/${c.file}.svg`, P.contactButton(c, lang));
  await out(`${lang}/footer.svg`, P.footer(lang, sprites));

  // Versões para celular (README: <source media="(max-width: 600px)">)
  await out(`${lang}/m/hero.svg`, M.hero(lang, sprites));
  await out(`${lang}/m/character.svg`, M.character(lang, sprites));
  await out(`${lang}/m/inventory.svg`, M.inventory(lang, join(import.meta.dirname, "icons")));
  await out(`${lang}/m/missions/peopleos.svg`, M.featured(lang));
  for (const q of QUESTS) await out(`${lang}/m/missions/${q.file}.svg`, M.quest(q, lang, data?.repoMeta?.[q.repo]));
  if (data) await out(`${lang}/m/status.svg`, M.status(lang, data));
  await out(`${lang}/m/achievements.svg`, M.achievements(lang));
  await out(`${lang}/m/continue.svg`, M.continueScreen(lang));
}
