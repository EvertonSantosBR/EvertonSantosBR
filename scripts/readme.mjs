// Gera README.md (pt) e README.en.md (en) a partir de content.mjs — assim o Markdown
// nunca fica dessincronizado dos SVGs. Uso: npm run readme
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SECTIONS, QUESTS, ARCHIVE, CONTACTS, BUTTONS, LINKS, FEATURED, ABOUT, T } from "./content.mjs";

const ROOT = join(import.meta.dirname, "..");
const n2 = (i) => String(i + 1).padStart(2, "0");
const plain = (s) => s.replace(/\*\*/g, "");
const attr = (s) => plain(s).replace(/"/g, "&quot;");

/** Imagem com versão de celular (<picture> + media query). */
const pic = (lang, path, alt) =>
  `<picture><source media="(max-width: 600px)" srcset="./assets/${lang}/m/${path}"/><img src="./assets/${lang}/${path}" width="100%" alt="${attr(alt)}"/></picture>`;
const btn = (lang, name, alt, h = 44) => `<img src="./assets/${lang}/buttons/${name}.svg" height="${h}" alt="${attr(alt)}"/>`;
const back = (lang) => `<p align="right"><a href="#menu">${btn(lang, "menu", lang === "pt" ? "Voltar ao menu" : "Back to menu", 40)}</a></p>`;

function build(lang) {
  const t = T[lang], other = lang === "pt" ? "en" : "pt";
  const id = (i) => SECTIONS[i].id[lang];
  const portfolio = lang === "pt" ? LINKS.portfolio : `${LINKS.portfolio}en/`;
  const caseStudy = lang === "pt" ? `${LINKS.portfolio}projetos/peopleos` : `${LINKS.portfolio}en/projects/peopleos`;
  const milestones = lang === "pt" ? `${LINKS.portfolio}marcos-academicos` : `${LINKS.portfolio}en/academic-milestones`;
  const contactHref = { agenda: LINKS.agenda, linkedin: LINKS.linkedin, email: LINKS.email, portfolio };
  const s = [];
  const sec = (i, body) => s.push(`<a name="${id(i)}"></a>\n\n${pic(lang, `banners/${n2(i)}.svg`, `${n2(i)} — ${SECTIONS[i][lang][0]}. ${SECTIONS[i][lang][1]}`)}\n\n${body}\n\n${back(lang)}\n`);

  s.push(`<a name="topo"></a>

<div align="center">

<a href="./README.md"><img src="./assets/ui/lang-pt-${lang === "pt" ? "on" : "off"}.svg" height="40" alt="${lang === "pt" ? "Português (atual)" : "Ler em português"}"/></a>
<a href="./README.en.md"><img src="./assets/ui/lang-en-${lang === "en" ? "on" : "off"}.svg" height="40" alt="${lang === "en" ? "English (current)" : "Read in English"}"/></a>

<a href="#${id(0)}">${pic(lang, "hero.svg", `${t.hero.title}. ${plain(t.hero.tagline)} ${t.hero.press}.`)}</a>

<a name="menu"></a>

${SECTIONS.map((x, i) => `<a href="#${id(i)}">${btn(lang, `menu-${n2(i)}`, `${n2(i)} ${x[lang][0]}`, 40)}</a>`).join("\n")}

</div>
`);

  sec(0, [
    pic(lang, "character.svg", `${t.character.title.join("")}`),
    pic(lang, "dialog.svg", `${t.dialog.title}: ${ABOUT[lang].map(plain).join(" ")}`),
    pic(lang, "skills.svg", t.skills.title),
  ].join("\n\n"));

  sec(1, pic(lang, "inventory.svg", t.inventory.title));

  const f = FEATURED[lang];
  sec(2, [
    `<a href="${caseStudy}">${pic(lang, "missions/peopleos.svg", `${FEATURED.n} · ${FEATURED.title} — ${f.kind}. ${plain(f.desc)} ${f.status}. ${f.open}.`)}</a>`,
    `<details>\n<summary>${btn(lang, "map", BUTTONS.map[lang])}</summary>\n<br/>\n\n${pic(lang, "missions/flow.svg", t.flow.title)}\n\n</details>`,
    ...QUESTS.map((q) => {
      const title = typeof q.title === "object" ? q.title[lang] : q.title;
      return `<a href="https://github.com/${"EvertonSantosBR"}/${q.repo}">${pic(lang, `missions/${q.file}.svg`, `${q.n} · ${title} — ${q[lang].kind}. ${plain(q[lang].desc)}${q[lang].credit ? ` ${q[lang].credit}.` : ""}`)}</a>`;
    }),
    `<details>\n<summary>${btn(lang, "archive", BUTTONS.archive[lang])}</summary>\n<br/>\n\n${ARCHIVE.map((a) => `<a href="https://github.com/EvertonSantosBR/${a.repo}">${pic(lang, `archive/${a.file}.svg`, `${a.repo} — ${a[lang]}`)}</a>`).join("\n\n")}\n\n</details>`,
  ].join("\n\n"));

  sec(3, [
    pic(lang, "status.svg", t.status.title),
    `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="./assets/generated/snake-dark.svg"/>\n  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/snake-light.svg"/>\n  <img src="./assets/generated/snake-dark.svg" width="100%" alt="${lang === "pt" ? "Gráfico de contribuições do último ano sendo percorrido por uma cobrinha" : "Contribution graph for the last year being eaten by a snake"}"/>\n</picture>`,
  ].join("\n\n"));

  sec(4, [
    pic(lang, "achievements.svg", t.achievements.title),
    `<p align="center">\n<a href="${milestones}">${btn(lang, "milestones", BUTTONS.milestones[lang])}</a>\n<a href="https://github.com/EvertonSantosBR?tab=achievements">${btn(lang, "ghAchievements", BUTTONS.ghAchievements[lang])}</a>\n</p>`,
  ].join("\n\n"));

  s.push(`<a name="${id(5)}"></a>

${pic(lang, `banners/06.svg`, `06 — ${SECTIONS[5][lang][0]}. ${SECTIONS[5][lang][1]}`)}

${pic(lang, "continue.svg", `${t.contact.title} ${t.contact.line1} ${t.contact.line2}`)}

<p align="center">
${CONTACTS.map((c) => `<a href="${contactHref[c.file]}"><img src="./assets/${lang}/contact/${c.file}.svg" width="200" alt="${attr(c[lang])}"/></a>`).join("\n")}
</p>

<a href="#topo">${pic(lang, "footer.svg", `${t.footer.title} — ${t.footer.sub}. ${t.footer.back}.`)}</a>
`);
  return s.join("\n");
}

await writeFile(join(ROOT, "README.md"), build("pt"));
await writeFile(join(ROOT, "README.en.md"), build("en"));
console.log("✓ README.md, README.en.md");
