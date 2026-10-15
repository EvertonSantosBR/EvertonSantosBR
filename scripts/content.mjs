// Todo o conteúdo dos SVGs fica aqui, em português e inglês.
// Para atualizar o perfil (novo projeto, nova conquista, nova tecnologia), edite só este arquivo
// e rode `npm run render` — o GitHub Action também roda sozinho a cada push em scripts/.

export const USER = "EvertonSantosBR";

export const LINKS = {
  portfolio: "https://evertonsantos-pied.vercel.app/",
  linkedin: "https://www.linkedin.com/in/evertonferreira7/",
  email: "mailto:evertnsantos.work@gmail.com",
  agenda: "https://cal.com/evertnnsantts/evortonsantts",
};

// Modos do personagem (mesmos sprites e textos da seção "Personagem" do portfólio)
export const MODES = [
  {
    sprite: "modo-dev",
    pt: { tab: "Dev", title: "Modo desenvolvedor", text: "Desenvolvedor na QCA desde junho de 2026. Node.js, Express e C#/.NET no dia a dia; React e Next.js quando o projeto precisa de interface." },
    en: { tab: "Dev", title: "Developer mode", text: "Developer at QCA since June 2026. Node.js, Express and C#/.NET day to day; React and Next.js when the project needs an interface." },
  },
  {
    sprite: "modo-backend",
    pt: { tab: "Back-end", title: "Modo back-end", text: "Primeiro eu penso no fluxo, depois escrevo o código: camadas bem separadas, JWT, permissão por perfil, auditoria e migrations versionadas." },
    en: { tab: "Back-end", title: "Back-end mode", text: "First I think through the flow, then I write the code: well-separated layers, JWT, role-based permissions, audit trails and versioned migrations." },
  },
  {
    sprite: "modo-estudo",
    pt: { tab: "Estudo", title: "Modo estudo", text: "Cursando Sistemas de Informação na UNIFACS. Nas horas vagas: AWS, Docker e Linux — e protótipos para testar ideias." },
    en: { tab: "Study", title: "Study mode", text: "Studying Information Systems at UNIFACS. In my spare time: AWS, Docker and Linux — plus prototypes to test ideas." },
  },
];

export const SHEET = {
  pt: [["Atual", "Dev na QCA"], ["Base", "Salvador, BA"], ["Início", "2021"], ["Guilda", "UNIFACS"]],
  en: [["Current", "Dev at QCA"], ["Base", "Salvador, Brazil"], ["Started", "2021"], ["Guild", "UNIFACS"]],
};

// Inventário: mesma divisão do portfólio. Ids = ícones do skillicons.dev (cache em scripts/icons);
// "art:" usa um ícone em pixel art de lib/pixels.mjs.
export const INVENTORY = [
  { pt: "Principal", en: "Main", items: [["nodejs", "Node.js"], ["express", "Express"], ["cs", "C#"], ["dotnet", ".NET"], ["mysql", "MySQL"], ["sqlserver", "SQL Server"]] },
  { pt: "Suporte", en: "Support", items: [["react", "React"], ["nextjs", "Next.js"], ["ts", "TypeScript"], ["py", "Python"], ["java", "Java"]] },
  { pt: "Exploração", en: "Exploring", items: [["solidity", "Solidity"], ["art:hardhat", "Hardhat"], ["art:gem", "Ethers.js"], ["electron", "Electron"]] },
  { pt: "Ferramentas", en: "Tools", items: [["git", "Git"], ["github", "GitHub"], ["vscode", "VS Code"], ["vercel", "Vercel"]] },
  { pt: "Treinando", en: "Training", training: true, items: [["aws", "AWS"], ["docker", "Docker"], ["linux", "Linux"]] },
];

export const FEATURED = {
  file: "peopleos",
  n: "M01",
  title: "PeopleOS",
  pt: {
    tag: "Missão principal",
    kind: "RH & folha de pagamento · ago — set 2026",
    status: "Em desenvolvimento · repositório privado",
    stats: [["11", "módulos de API REST"], ["6", "middlewares de segurança"], ["20+", "suítes de teste"]],
    slip: { title: "HOLERITE", rows: ["SALÁRIO BASE", "PROPORCIONAL", "13º — 1/2", "PENSÃO ALIM.", "DESCONTOS"], net: "LÍQUIDO" },
  },
  en: {
    tag: "Main quest",
    kind: "HR & payroll · Aug — Sep 2026",
    status: "In development · private repository",
    stats: [["11", "REST API modules"], ["6", "security middlewares"], ["20+", "test suites"]],
    slip: { title: "PAYSLIP", rows: ["BASE SALARY", "PRORATED", "13TH — 1/2", "CHILD SUPPORT", "DEDUCTIONS"], net: "NET PAY" },
  },
  stack: ["Node.js", "Express 5", "MySQL", "JWT", "bcrypt", "PDFKit", "React 19", "node:test"],
};

export const QUESTS = [
  {
    file: "libras-bridge", repo: "LIBRAS-Bridge", n: "M02", title: "LIBRAS Bridge", art: "hand",
    pt: { kind: "Jun 2026 · visão computacional · acessibilidade", credit: "Autoria · Yasmin Santana" },
    en: { kind: "Jun 2026 · computer vision · accessibility", credit: "Author · Yasmin Santana" },
    stack: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
  },
  {
    file: "greenchain", repo: "GreenChain", n: "M03", title: "GreenChain", art: "bin",
    pt: { kind: "Jun 2026 · web3 · sustentabilidade" },
    en: { kind: "Jun 2026 · web3 · sustainability" },
    stack: ["Next.js", "TypeScript", "Solidity", "Hardhat", "Tailwind"],
  },
  {
    file: "bibliocontrole", repo: "BiblioControle", n: "M04", title: "BiblioControle", art: "books",
    pt: { kind: "Nov 2024 · gestão de bibliotecas" },
    en: { kind: "Nov 2024 · library management" },
    stack: ["Node.js", "Express", "MySQL", "Sequelize", "Electron"],
  },
  {
    file: "appweb-iel", repo: "APPWEB---IEL", n: "M05", title: { pt: "Gestão de Alunos — IEL", en: "Student Management — IEL" }, art: "form",
    pt: { kind: "Out 2025 · full stack · .NET" },
    en: { kind: "Oct 2025 · full stack · .NET" },
    stack: ["C#", "ASP.NET", "EF Core", "SQL Server", "React"],
  },
];

export const ACHIEVEMENTS = [
  { art: "briefcase", pt: ["Marco profissional · jun 2026", "Dev na QCA"], en: ["Career milestone · Jun 2026", "Dev at QCA"] },
  { art: "blocks", pt: ["Pesquisa", "Iniciação Científica em Blockchain"], en: ["Research", "Undergraduate research in Blockchain"] },
  { art: "flag", pt: ["Comunidade", "Tech Lead · Club AWS SBG UNIFACS"], en: ["Community", "Tech Lead · Club AWS SBG UNIFACS"] },
  { art: "book", pt: ["Monitoria", "Letramento Digital"], en: ["Teaching assistant", "Digital Literacy"] },
  { art: "pointer", pt: ["Monitoria", "IHC, UX/UI e Design"], en: ["Teaching assistant", "HCI, UX/UI and Design"] },
  { art: "diploma", pt: ["Formação", "Desenvolvimento Web (concluído)"], en: ["Education", "Web Development (completed)"] },
];

export const CONTACTS = [
  { file: "agenda", art: "calendar", primary: true, pt: "Agendar conversa", en: "Book a call" },
  { file: "linkedin", art: "linkedin", pt: "LinkedIn", en: "LinkedIn" },
  { file: "email", art: "mail", pt: "E-mail", en: "Email" },
  { file: "portfolio", art: "globe", pt: "Portfólio", en: "Portfolio" },
];

// Textos soltos dos painéis
export const T = {
  pt: {
    locale: "pt-BR",
    hero: {
      title: "Everton Santos — desenvolvedor back-end",
      desc: "Tela de título em pixel art: o nome Everton Santos em letras grandes, ao lado do personagem em pixel art de moletom com um notebook e um teclado flutuando sobre um círculo amarelo.",
      p1: "P1 · Everton Santos", xp: "XP · 5 anos de código", coords: "12°58'S 38°30'W — Salvador, BA",
      press: "Press start", scroll: "role para começar",
    },
    character: { title: ["Um personagem, ", "três", " modos."], mode: "Modo", name: "everton" },
    inventory: { title: "Inventário", count: (n) => `${n} itens equipados`, training: "estudando" },
    quest: { open: "Abrir missão", updated: "atualizado" },
    flow: { title: "Mapa da missão · como uma requisição percorre o PeopleOS", client: "Cliente React", audit: "Auditoria + log", pdf: "Holerite PDF", note: "auth · perfil · escopo · validação" },
    status: {
      title: "Status do jogador", updated: "atualizado em",
      rows: { repos: "Repositórios públicos", stars: "Estrelas recebidas", followers: "Seguidores", commits: (y) => `Commits em ${y}`, prs: (y) => `Pull requests em ${y}`, total: "Contribuições (12 meses)" },
      langs: "Linguagens por repositório", note: "peso igual por repositório · sem forks",
    },
    achievements: { title: "Conquistas desbloqueadas" },
    contact: { title: "Continue?", line1: "Tem um sistema com regra de negócio", line2: "complicada? Vamos conversar." },
    footer: { title: "Obrigado por jogar", sub: "Everton Santos — desenvolvedor back-end em Salvador, BA" },
    lang: { pt: "Português", en: "English" },
  },
  en: {
    locale: "en-US",
    hero: {
      title: "Everton Santos — back-end developer",
      desc: "Pixel art title screen: the name Everton Santos in large letters, next to the pixel art character in a hoodie with a laptop and a keyboard floating over a yellow circle.",
      p1: "P1 · Everton Santos", xp: "XP · 5 years of code", coords: "12°58'S 38°30'W — Salvador, Brazil",
      press: "Press start", scroll: "scroll to begin",
    },
    character: { title: ["One character, ", "three", " modes."], mode: "Mode", name: "everton" },
    inventory: { title: "Inventory", count: (n) => `${n} items equipped`, training: "learning" },
    quest: { open: "Open mission", updated: "updated" },
    flow: { title: "Mission map · how a request flows through PeopleOS", client: "React client", audit: "Audit + log", pdf: "PDF payslip", note: "auth · role · scope · validation" },
    status: {
      title: "Player status", updated: "updated on",
      rows: { repos: "Public repositories", stars: "Stars earned", followers: "Followers", commits: (y) => `Commits in ${y}`, prs: (y) => `Pull requests in ${y}`, total: "Contributions (12 months)" },
      langs: "Languages by repository", note: "equal weight per repository · no forks",
    },
    achievements: { title: "Achievements unlocked" },
    contact: { title: "Continue?", line1: "Got a system with tricky", line2: "business rules? Let's talk." },
    footer: { title: "Thanks for playing", sub: "Everton Santos — back-end developer in Salvador, Brazil" },
    lang: { pt: "Português", en: "English" },
  },
};
