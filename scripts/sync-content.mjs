#!/usr/bin/env node
/**
 * Synchronise le contenu du portfolio entre `src/data/portfolio.json`
 * et le site en ligne (Supabase), via l'API admin protégée par mot de passe.
 *
 *   npm run content:pull   # site en ligne  →  src/data/portfolio.json
 *   npm run content:push   # src/data/portfolio.json  →  site en ligne
 *
 * Variables d'environnement (optionnelles) :
 *   SITE_URL        — défaut : https://fortuneassouan.vercel.app
 *   ADMIN_PASSWORD  — sinon demandé à l'écran (saisie masquée)
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";

const SITE_URL = (process.env.SITE_URL || "https://fortuneassouan.vercel.app").replace(/\/$/, "");
const JSON_PATH = path.resolve("src", "data", "portfolio.json");
const command = process.argv[2];

if (command !== "pull" && command !== "push") {
  console.error("Usage : node scripts/sync-content.mjs <pull|push>");
  process.exit(1);
}

function askPassword() {
  return new Promise((resolve) => {
    const muted = new Writable({ write: (_chunk, _enc, cb) => cb() });
    const rl = createInterface({ input: process.stdin, output: muted, terminal: true });
    process.stdout.write(`Mot de passe admin (${SITE_URL}) : `);
    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function login(password) {
  const res = await fetch(`${SITE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `Connexion refusée (HTTP ${res.status}).`);
  }
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error("Pas de cookie de session dans la réponse.");
  return cookie;
}

async function fetchRemote(cookie) {
  const res = await fetch(`${SITE_URL}/api/portfolio`, { headers: { Cookie: cookie } });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `Lecture impossible (HTTP ${res.status}).`);
  }
  return res.json();
}

function summary(data) {
  return (
    `${data.projects.length} projets, ${data.timeline.length} étapes, ` +
    `${data.skillGroups.length} groupes de compétences, ` +
    `CV : ${data.profile.cvUrl || "aucun"}`
  );
}

const password = process.env.ADMIN_PASSWORD || (await askPassword());
if (!password) {
  console.error("Mot de passe vide.");
  process.exit(1);
}

const cookie = await login(password);
const { data: remote, meta } = await fetchRemote(cookie);
if (!meta.supabaseConnected) {
  console.warn(`⚠ Supabase non connecté côté serveur${meta.supabaseError ? ` : ${meta.supabaseError}` : ""}.`);
}

if (command === "pull") {
  await writeFile(JSON_PATH, JSON.stringify(remote, null, 2) + "\n", "utf-8");
  console.log(`✓ Contenu récupéré depuis ${SITE_URL} → ${path.relative(process.cwd(), JSON_PATH)}`);
  console.log(`  ${summary(remote)}`);
} else {
  const local = JSON.parse(await readFile(JSON_PATH, "utf-8"));
  console.log(`En ligne : ${summary(remote)}`);
  console.log(`Local    : ${summary(local)}`);

  const res = await fetch(`${SITE_URL}/api/portfolio`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(local),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `Enregistrement refusé (HTTP ${res.status}).`);
  }

  // Relecture pour confirmer ce qui est réellement stocké.
  const { data: after } = await fetchRemote(cookie);
  const same = JSON.stringify(after) === JSON.stringify(local);
  console.log(same ? `✓ Contenu publié sur ${SITE_URL}` : "⚠ Le contenu relu diffère du JSON local.");
  console.log(`  ${summary(after)}`);
}
