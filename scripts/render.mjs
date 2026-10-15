// Gera todos os SVGs do README de perfil — português em assets/pt/ e inglês em assets/en/.
// Cada painel sai em duas versões: desktop (1000px) e celular (assets/<lang>/m/, 600px).
// Uso: npm run render   (GITHUB_TOKEN opcional — habilita commits/PRs/contribuições)
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { loadFonts } from "./lib/fonts.mjs";
import { loadGithub } from "./lib/github.mjs";
import { loadSprites } from "./lib/sprites.mjs";
import { USER, SECTIONS, QUESTS, ARCHIVE, CONTACTS, BUTTONS, T } from "./content.mjs";
import * as P from "./panels.mjs";

const ROOT = join(import.meta.dirname, "..");
const ASSETS = join(ROOT, "assets");
const ICONS = join(import.meta.dirname, "icons");

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
for (const lang of ["pt", "en"]) {
  await out(`ui/lang-${lang}-on.svg`, P.langButton(lang.toUpperCase(), T.pt.lang[lang], true));
  await out(`ui/lang-${lang}-off.svg`, P.langButton(lang.toUpperCase(), T.pt.lang[lang], false));
}

for (const lang of ["pt", "en"]) {
  for (const m of [false, true]) {
    const dir = m ? `${lang}/m` : lang;
    await out(`${dir}/hero.svg`, P.hero(lang, sprites, m));
    for (const i of SECTIONS.keys()) await out(`${dir}/banners/${String(i + 1).padStart(2, "0")}.svg`, P.banner(lang, i, m));
    await out(`${dir}/character.svg`, P.character(lang, sprites, m));
    await out(`${dir}/dialog.svg`, P.dialog(lang, sprites, m));
    await out(`${dir}/skills.svg`, P.skills(lang, m));
    await out(`${dir}/inventory.svg`, P.inventory(lang, ICONS, m));
    await out(`${dir}/missions/peopleos.svg`, P.featured(lang, m));
    await out(`${dir}/missions/flow.svg`, P.flow(lang, m));
    for (const q of QUESTS) await out(`${dir}/missions/${q.file}.svg`, P.quest(q, lang, data?.repoMeta?.[q.repo], m));
    for (const a of ARCHIVE) await out(`${dir}/archive/${a.file}.svg`, P.archiveCard(a, lang, m));
    if (data) await out(`${dir}/status.svg`, P.status(lang, data, m));
    await out(`${dir}/achievements.svg`, P.achievements(lang, m));
    await out(`${dir}/continue.svg`, P.continueScreen(lang, m));
    await out(`${dir}/footer.svg`, P.footer(lang, sprites, m));
  }
  // Botões (mesma imagem no desktop e no celular)
  for (const [i, s] of SECTIONS.entries()) await out(`${lang}/buttons/menu-${String(i + 1).padStart(2, "0")}.svg`, P.menuButton(i, s[lang][0]));
  for (const [key, b] of Object.entries(BUTTONS)) await out(`${lang}/buttons/${key}.svg`, P.actionButton(b[lang], b.art));
  for (const c of CONTACTS) await out(`${lang}/contact/${c.file}.svg`, P.contactButton(c, lang));
}
