// Dados reais do GitHub. Sem token (ou com a API fora do ar) o gerador usa o último
// snapshot salvo em assets/generated/data.json, então os cards nunca ficam quebrados.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export async function loadGithub(user, cacheFile, token = process.env.GITHUB_TOKEN) {
  try {
    const data = await fetchGithub(user, token);
    await mkdir(dirname(cacheFile), { recursive: true });
    await writeFile(cacheFile, JSON.stringify(data, null, 2) + "\n");
    return { data, fresh: true };
  } catch (e) {
    console.warn(`API do GitHub indisponível (${e.message}) — usando ${cacheFile}`);
    try {
      return { data: JSON.parse(await readFile(cacheFile, "utf8")), fresh: false };
    } catch {
      return { data: null, fresh: false };
    }
  }
}

async function fetchGithub(user, token) {
  const gh = async (path) => {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": user, ...(token && { Authorization: `Bearer ${token}` }) },
    });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return res.json();
  };

  const [profile, repos] = await Promise.all([gh(`/users/${user}`), gh(`/users/${user}/repos?per_page=100&type=owner`)]);
  const own = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());

  // Cada repositório pesa igual: evita que um build commitado domine o gráfico.
  const share = {};
  for (const r of own) {
    const langs = await gh(`/repos/${user}/${r.name}/languages`);
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    if (!total) continue;
    for (const [lang, bytes] of Object.entries(langs)) share[lang] = (share[lang] ?? 0) + bytes / total;
  }
  const sum = Object.values(share).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(share)
    .map(([name, v]) => ({ name, pct: +((v / sum) * 100).toFixed(1) }))
    .sort((a, b) => b.pct - a.pct);

  return {
    generatedAt: new Date().toISOString(),
    repos: profile.public_repos,
    followers: profile.followers,
    stars: own.reduce((a, r) => a + r.stargazers_count, 0),
    languages,
    contrib: await contributions(user, token),
    repoMeta: Object.fromEntries(repos.map((r) => [r.name, { stars: r.stargazers_count, pushedAt: r.pushed_at }])),
  };
}

async function contributions(user, token) {
  if (!token) return null;
  const year = new Date().getUTCFullYear();
  const query = `query($login:String!,$from:DateTime!){user(login:$login){
    year: contributionsCollection(from:$from){totalCommitContributions totalPullRequestContributions restrictedContributionsCount}
    last: contributionsCollection{contributionCalendar{totalContributions}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": user },
    body: JSON.stringify({ query, variables: { login: user, from: `${year}-01-01T00:00:00Z` } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) return null;
  const u = json.data.user;
  return {
    year,
    commits: u.year.totalCommitContributions + u.year.restrictedContributionsCount,
    prs: u.year.totalPullRequestContributions,
    total: u.last.contributionCalendar.totalContributions,
  };
}
