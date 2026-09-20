/**
 * Mises à jour de l'app installée (APK sideloadée), 100 % auto-hébergées.
 * Aucun service tiers, aucun compte : tout passe par la Release GitHub.
 *
 * Deux niveaux complémentaires :
 *  - OTA web (contenu/design) : on télécharge le bundle web publié par la CI
 *    (`www-bundle.zip` + manifeste `ota.json`) via le plugin Capgo en mode
 *    MANUEL (piloté ici), et on l'active pour le prochain lancement. Silencieux.
 *  - Bandeau « Mettre à jour » (changements NATIFS) : compare la versionCode
 *    native à `app-version.json` ; propose d'installer la nouvelle APK en un tap.
 *
 * Sans effet hors application native (web / GitHub Pages) et entièrement
 * défensif : aucune erreur ne remonte à l'utilisateur.
 */

const BASE = "https://github.com/EmilyGuindi/Culture-G/releases/download/android-latest";
const OTA_URL = BASE + "/ota.json"; // { version, url (zip) }
const VERSION_URL = BASE + "/app-version.json"; // { versionCode, versionName, apkUrl }

function isNative() {
  try {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  } catch (_) {
    return false;
  }
}

function plugin(name) {
  try {
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[name];
  } catch (_) {
    return null;
  }
}

/** Valide le bundle courant (sinon Capgo pourrait faire un rollback). */
function notifyReady() {
  const updater = plugin("CapacitorUpdater");
  if (updater && typeof updater.notifyAppReady === "function") {
    updater.notifyAppReady().catch(() => {});
  }
}

/** Récupère un JSON en contournant la CORS via le HTTP natif si dispo. */
async function fetchJson(url) {
  const http = plugin("CapacitorHttp");
  if (http && typeof http.get === "function") {
    const res = await http.get({ url, headers: { Accept: "application/json" } });
    return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  }
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

/* ----------------------- OTA web (silencieux) ----------------------- */

async function checkWebOTA() {
  const updater = plugin("CapacitorUpdater");
  if (!updater || typeof updater.download !== "function") return;
  try {
    const manifest = await fetchJson(OTA_URL);
    if (!manifest || !manifest.version || !manifest.url) return;

    let currentVersion = "";
    try {
      const cur = await updater.current();
      currentVersion = (cur && cur.bundle && cur.bundle.version) || "";
    } catch (_) {}

    // Déjà à jour (ou bundle intégré identique) → rien à faire.
    if (manifest.version === currentVersion) return;

    // Télécharge le nouveau bundle web…
    const bundle = await updater.download({ url: manifest.url, version: manifest.version });
    const id = bundle && (bundle.id || bundle.bundleId);
    if (!id) return;

    // …et l'active au PROCHAIN lancement (pas de reload brutal en pleine session).
    if (typeof updater.next === "function") await updater.next({ id });
    else if (typeof updater.set === "function") await updater.set({ id });
  } catch (_) {
    /* hors-ligne, pas encore de bundle, etc. : on ignore silencieusement */
  }
}

/* ------------------- Bandeau MAJ native (un tap) -------------------- */

async function nativeVersionCode() {
  const app = plugin("App");
  if (app && typeof app.getInfo === "function") {
    const info = await app.getInfo();
    return Number(info.build); // versionCode Android
  }
  return null;
}

function showBanner(remote) {
  if (document.getElementById("update-banner")) return;
  const bar = document.createElement("div");
  bar.id = "update-banner";
  bar.className = "update-banner";
  bar.innerHTML = `
    <div class="ub-txt">
      <strong>Nouvelle version dispo</strong>
      <span class="muted">${remote.versionName ? "v" + remote.versionName : "Mise à jour prête"} — installe en un tap</span>
    </div>
    <button class="btn btn-primary small" id="ub-go">Mettre à jour</button>
    <button class="ub-close" id="ub-x" aria-label="Plus tard">✕</button>
  `;
  document.body.appendChild(bar);
  requestAnimationFrame(() => bar.classList.add("show"));

  const openApk = () => {
    const url = remote.apkUrl || BASE + "/culture-g.apk";
    const browser = plugin("Browser");
    if (browser && typeof browser.open === "function") browser.open({ url });
    else window.open(url, "_blank");
  };
  bar.querySelector("#ub-go").addEventListener("click", openApk);
  bar.querySelector("#ub-x").addEventListener("click", () => bar.remove());
}

async function checkNativeUpdate() {
  try {
    const local = await nativeVersionCode();
    if (local == null) return;
    const remote = await fetchJson(VERSION_URL);
    if (remote && Number(remote.versionCode) > local) showBanner(remote);
  } catch (_) {
    /* hors-ligne ou pas de version.json : on ignore */
  }
}

export function initUpdateCheck() {
  if (!isNative()) return; // aucun effet sur le web
  notifyReady();
  // en tâche de fond, sans gêner le premier rendu
  setTimeout(() => {
    checkWebOTA();
    checkNativeUpdate();
  }, 2500);
}
