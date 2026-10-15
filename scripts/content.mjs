// Todo o conteúdo dos SVGs fica aqui, em português e inglês.
// Para atualizar o perfil (novo projeto, nova conquista, nova tecnologia), edite só este arquivo
// e rode `npm run render` — o GitHub Action também roda sozinho a cada push em scripts/.
// Textos com **negrito** viram destaque dentro dos cards.

export const USER = "EvertonSantosBR";

export const LINKS = {
  portfolio: "https://evertonsantos-pied.vercel.app/",
  linkedin: "https://www.linkedin.com/in/evertonferreira7/",
  email: "mailto:evertnsantos.work@gmail.com",
  agenda: "https://cal.com/evertnnsantts/evortonsantts",
};

// Seções: cada uma vira um banner (número + título + subtítulo) e um botão do menu.
export const SECTIONS = [
  { id: { pt: "personagem", en: "character" }, pt: ["Personagem", "Quem está jogando este perfil."], en: ["Character", "Who's playing this profile."] },
  { id: { pt: "inventario", en: "inventory" }, pt: ["Inventário", "Itens equipados, consumíveis e em treinamento."], en: ["Inventory", "Gear equipped, consumables and in training."] },
  { id: { pt: "missoes", en: "missions" }, pt: ["Missões", "Projetos contados como missões. Clique numa missão para abrir."], en: ["Missions", "Projects told as missions. Click one to open it."] },
  { id: { pt: "status", en: "status" }, pt: ["Status", "Números reais da API do GitHub, atualizados todo dia."], en: ["Status", "Real numbers from the GitHub API, refreshed daily."] },
  { id: { pt: "conquistas", en: "achievements" }, pt: ["Conquistas", "Marcos profissionais, acadêmicos e de comunidade."], en: ["Achievements", "Career, academic and community milestones."] },
  { id: { pt: "contato", en: "contact" }, pt: ["Contato", "Escolha uma opção para continuar."], en: ["Contact", "Pick an option to continue."] },
];

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

// Caixa de diálogo "sobre mim"
export const ABOUT = {
  pt: [
    "Sou desenvolvedor **back-end** em Salvador/BA e, desde junho de 2026, desenvolvedor na **QCA — Queiroz Cavalcanti Advocacia**. Comecei em 2021 pelo front-end, passei pelo React e hoje trabalho principalmente com **Node.js/Express** e **C#/.NET** sobre bancos relacionais.",
    "Gosto de sistemas com regra de negócio de verdade — cálculo de folha, controle de acesso, auditoria — e de deixar tudo coberto por testes.",
    "Formado em Desenvolvimento Web e cursando **Sistemas de Informação na UNIFACS**.",
  ],
  en: [
    "I'm a **back-end** developer based in Salvador, Brazil, and since June 2026 a developer at **QCA — Queiroz Cavalcanti Advocacia**. I started in 2021 with front-end, moved through React, and today I work mainly with **Node.js/Express** and **C#/.NET** on relational databases.",
    "I enjoy systems with real business rules — payroll calculation, access control, auditing — and keeping them covered by tests.",
    "Web Development graduate, studying **Information Systems at UNIFACS**.",
  ],
};

export const SKILLS = [
  { art: "terminal", pt: ["APIs & back-end", "APIs REST em camadas com Express e ASP.NET, autenticação JWT, controle de acesso por perfil e validação de entrada."], en: ["APIs & back-end", "Layered REST APIs with Express and ASP.NET, JWT authentication, role-based access control and input validation."] },
  { art: "db", pt: ["Dados", "Modelagem relacional em MySQL e SQL Server, migrations versionadas, transações e ORMs (EF Core, Sequelize)."], en: ["Data", "Relational modeling in MySQL and SQL Server, versioned migrations, transactions and ORMs (EF Core, Sequelize)."] },
  { art: "check", pt: ["Qualidade", "Testes automatizados com node:test, regressão para cálculos, Conventional Commits e fluxo com pull requests."], en: ["Quality", "Automated tests with node:test, regression tests for calculations, Conventional Commits and a pull request workflow."] },
];

// Inventário: mesma divisão do portfólio. Ids = ícones do skillicons.dev (cache em scripts/icons);
// "art:" usa um ícone em pixel art de lib/pixels.mjs.
export const INVENTORY = [
  { pt: "Principal", en: "Main", items: [["nodejs", "Node.js"], ["express", "Express"], ["cs", "C#"], ["dotnet", ".NET"], ["mysql", "MySQL"], ["sqlserver", "SQL Server"]] },
  { pt: "Suporte", en: "Support", items: [["react", "React"], ["nextjs", "Next.js"], ["ts", "TypeScript"], ["py", "Python"], ["java", "Java"]] },
  { pt: "Exploração", en: "Exploring", items: [["solidity", "Solidity"], ["art:hardhat", "Hardhat"], ["art:gem", "Ethers.js"], ["electron", "Electron"]] },
  { pt: "Ferramentas", en: "Tools", items: [["git", "Git"], ["github", "GitHub"], ["vscode", "VS Code"], ["vercel", "Vercel"]] },
  { pt: "Treinando", en: "Training", training: true, items: [["aws", "AWS"], ["docker", "Docker"], ["linux", "Linux"]] },
];
export const LIBS = { pt: "Consumíveis", en: "Consumables", items: ["JWT", "bcrypt", "PDFKit", "EF Core", "Sequelize", "EJS", "Axios", "node:test"] };

export const FEATURED = {
  file: "peopleos",
  n: "M01",
  title: "PeopleOS",
  pt: {
    tag: "Missão principal",
    kind: "RH & folha de pagamento · ago — set 2026",
    desc: "Motor de cálculo de folha que trata **13º em parcelas**, **salário proporcional** e **pensão alimentícia** — e gera o holerite em PDF. Acesso por perfil e por unidade, trilha de auditoria e migrations.",
    status: "Em desenvolvimento · repositório privado",
    open: "Ver estudo de caso",
    stats: [["11", "módulos de API REST"], ["6", "middlewares de segurança"], ["20+", "suítes de teste"]],
    slip: { title: "HOLERITE", rows: ["SALÁRIO BASE", "PROPORCIONAL", "13º — 1/2", "PENSÃO ALIM.", "DESCONTOS"], net: "LÍQUIDO" },
  },
  en: {
    tag: "Main quest",
    kind: "HR & payroll · Aug — Sep 2026",
    desc: "A payroll engine that handles **13th-salary installments**, **prorated pay** and **child support** — and generates the payslip as a PDF. Role- and unit-based access, audit trail and migrations.",
    status: "In development · private repository",
    open: "Read the case study",
    stats: [["11", "REST API modules"], ["6", "security middlewares"], ["20+", "test suites"]],
    slip: { title: "PAYSLIP", rows: ["BASE SALARY", "PRORATED", "13TH — 1/2", "CHILD SUPPORT", "DEDUCTIONS"], net: "NET PAY" },
  },
  stack: ["Node.js", "Express 5", "MySQL", "JWT", "bcrypt", "PDFKit", "React 19", "node:test"],
};

export const QUESTS = [
  {
    file: "libras-bridge", repo: "LIBRAS-Bridge", n: "M02", title: "LIBRAS Bridge", art: "hand",
    pt: { kind: "Jun 2026 · visão computacional · acessibilidade", credit: "Autoria · Yasmin Santana", desc: "Sinais em LIBRAS viram texto e voz (MediaPipe + classificador de ML) e o texto do médico vira LIBRAS pelo VLibras." },
    en: { kind: "Jun 2026 · computer vision · accessibility", credit: "Author · Yasmin Santana", desc: "LIBRAS signs become text and speech (MediaPipe + ML classifier), and the doctor's text becomes LIBRAS through VLibras." },
    stack: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
  },
  {
    file: "greenchain", repo: "GreenChain", n: "M03", title: "GreenChain", art: "bin",
    pt: { kind: "Jun 2026 · web3 · sustentabilidade", desc: "Recycle-to-Earn: lixeiras inteligentes (simulador IoT) recompensam a reciclagem com tokens **$GREEN** na rede Celo." },
    en: { kind: "Jun 2026 · web3 · sustainability", desc: "Recycle-to-Earn: smart bins (IoT simulator) reward recycling with **$GREEN** tokens on Celo." },
    stack: ["Next.js", "TypeScript", "Solidity", "Hardhat", "Tailwind"],
  },
  {
    file: "bibliocontrole", repo: "BiblioControle", n: "M04", title: "BiblioControle", art: "books",
    pt: { kind: "Nov 2024 · gestão de bibliotecas", desc: "Meu **primeiro sistema completo**: leitores, livros, empréstimos, devoluções e histórico — com versão desktop em Electron." },
    en: { kind: "Nov 2024 · library management", desc: "My **first complete system**: readers, books, loans, returns and history — with a desktop version on Electron." },
    stack: ["Node.js", "Express", "MySQL", "Sequelize", "Electron"],
  },
  {
    file: "appweb-iel", repo: "APPWEB---IEL", n: "M05", title: { pt: "Gestão de Alunos — IEL", en: "Student Management — IEL" }, art: "form",
    pt: { kind: "Out 2025 · full stack · .NET", desc: "CRUD de alunos com busca por CPF: API em **ASP.NET + EF Core** sobre SQL Server, consumida por uma interface em React." },
    en: { kind: "Oct 2025 · full stack · .NET", desc: "Student CRUD with search by CPF: an **ASP.NET + EF Core** API on SQL Server, consumed by a React interface." },
    stack: ["C#", "ASP.NET", "EF Core", "SQL Server", "React"],
  },
];

// Arquivo: projetos menores (cartuchos no fim das missões)
export const ARCHIVE = [
  { file: "cadastroapp", repo: "CadastroApp", year: "2025", stack: "C# · .NET", pt: "CRUD de usuários em console com validação de entrada.", en: "Console user CRUD with input validation." },
  { file: "storemanagement", repo: "StoreManagement", year: "2025", stack: "Java", pt: "Gestão de mercado (produtos, funcionários e caixa), feito em equipe na faculdade.", en: "Store management (products, staff and cash register), a university team project." },
  { file: "usurport", repo: "Usurport", year: "2025", stack: "Python", pt: "Processamento de dados das rodovias federais da Bahia — em desenvolvimento.", en: "Data processing for federal highways in Bahia — in development." },
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

// Botões de ação (links no README)
export const BUTTONS = {
  milestones: { art: "diploma", pt: "Marcos acadêmicos", en: "Academic milestones" },
  ghAchievements: { art: "starFull", pt: "Conquistas no GitHub", en: "GitHub achievements" },
};

// Textos soltos dos painéis
export const T = {
  pt: {
    locale: "pt-BR",
    hero: {
      title: "Everton Santos — desenvolvedor back-end",
      desc: "Tela de título em pixel art: o nome Everton Santos em letras grandes, ao lado do personagem sobre um círculo amarelo. Desenvolvedor back-end: escrevo as regras que ninguém vê — cálculo de folha, permissões, auditoria — e os testes que provam que elas funcionam.",
      p1: "P1 · Everton Santos", xp: "XP · 5 anos de código", coords: "12°58'S 38°30'W — Salvador, BA",
      tagline: "**Desenvolvedor back-end.** Escrevo as regras que ninguém vê — cálculo de folha, permissões, auditoria — e os testes que provam que elas funcionam.",
      press: "Press start", scroll: "clique para começar",
    },
    character: { title: ["Um personagem, ", "três", " modos."], mode: "Modo", name: "everton", auto: "troca sozinho" },
    dialog: { name: "Everton", title: "Sobre mim" },
    skills: { title: "Habilidades de classe" },
    inventory: { title: "Inventário", count: (n) => `${n} itens equipados`, training: "estudando" },
    quest: { open: "Abrir missão" },
    flow: { title: "Mapa da missão · como uma requisição percorre o PeopleOS", client: "Cliente React", audit: "Auditoria + log", pdf: "Holerite PDF", note: "auth · perfil · escopo · validação" },
    status: {
      title: "Status do jogador", updated: "atualizado em",
      rows: { repos: "Repositórios públicos", stars: "Estrelas recebidas", followers: "Seguidores", commits: (y) => `Commits em ${y}`, prs: (y) => `Pull requests em ${y}`, total: "Contribuições (12 meses)" },
      langs: "Linguagens por repositório", note: "peso igual por repositório · sem forks · dados da API do GitHub",
    },
    achievements: { title: "Conquistas desbloqueadas" },
    contact: { title: "Continue?", line1: "Tem um sistema com regra de negócio", line2: "complicada? Vamos conversar.", pick: "Escolha uma opção" },
    footer: { title: "Obrigado por jogar", sub: "Everton Santos — desenvolvedor back-end em Salvador, BA", back: "Voltar ao início" },
    lang: { pt: "Português", en: "English" },
  },
  en: {
    locale: "en-US",
    hero: {
      title: "Everton Santos — back-end developer",
      desc: "Pixel art title screen: the name Everton Santos in large letters, next to the character over a yellow circle. Back-end developer: I write the rules nobody sees — payroll math, permissions, audit trails — and the tests that prove they work.",
      p1: "P1 · Everton Santos", xp: "XP · 5 years of code", coords: "12°58'S 38°30'W — Salvador, Brazil",
      tagline: "**Back-end developer.** I write the rules nobody sees — payroll math, permissions, audit trails — and the tests that prove they work.",
      press: "Press start", scroll: "click to begin",
    },
    character: { title: ["One character, ", "three", " modes."], mode: "Mode", name: "everton", auto: "switches by itself" },
    dialog: { name: "Everton", title: "About me" },
    skills: { title: "Class skills" },
    inventory: { title: "Inventory", count: (n) => `${n} items equipped`, training: "learning" },
    quest: { open: "Open mission" },
    flow: { title: "Mission map · how a request flows through PeopleOS", client: "React client", audit: "Audit + log", pdf: "PDF payslip", note: "auth · role · scope · validation" },
    status: {
      title: "Player status", updated: "updated on",
      rows: { repos: "Public repositories", stars: "Stars earned", followers: "Followers", commits: (y) => `Commits in ${y}`, prs: (y) => `Pull requests in ${y}`, total: "Contributions (12 months)" },
      langs: "Languages by repository", note: "equal weight per repository · no forks · GitHub API data",
    },
    achievements: { title: "Achievements unlocked" },
    contact: { title: "Continue?", line1: "Got a system with tricky", line2: "business rules? Let's talk.", pick: "Pick an option" },
    footer: { title: "Thanks for playing", sub: "Everton Santos — back-end developer in Salvador, Brazil", back: "Back to start" },
    lang: { pt: "Português", en: "English" },
  },
};
