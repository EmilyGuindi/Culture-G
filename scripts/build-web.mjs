/**
 * Assemble le dossier `www/` que Capacitor embarque dans l'APK.
 *
 * On copie uniquement les fichiers de l'app web (pas node_modules, .git,
 * android, etc.). Les chemins sont relatifs, donc l'app tourne telle quelle
 * depuis le système de fichiers local du téléphone — 100 % hors-ligne.
 */
import { cp, rm, mkdir, access } from "node:fs/promises";

const OUT = "www";

// Fichiers/dossiers de l'app web à embarquer.
const INCLUDE = [
  "index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "css",
  "js",
  "assets",
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const item of INCLUDE) {
  try {
    await access(item);
  } catch {
    console.warn(`⚠️  ignoré (absent) : ${item}`);
    continue;
  }
  await cp(item, `${OUT}/${item}`, { recursive: true });
}

console.log(`✅ www/ assemblé (${INCLUDE.join(", ")})`);
