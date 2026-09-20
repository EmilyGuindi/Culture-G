/**
 * Mise à jour de l'app installée (APK sideloadée).
 *
 * Deux niveaux complémentaires :
 *  - OTA silencieux (contenu web) : géré nativement par le plugin Capgo
 *    (@capgo/capacitor-updater, autoUpdate). Ici on se contente d'appeler
 *    notifyAppReady() pour valider le bundle courant.
 *  - Bandeau « Mettre à jour » (changements NATIFS) : on compare la version
 *    native de l'app (versionCode) à la dernière publiée sur GitHub, et si
 *    une nouvelle APK existe on propose de l'installer en un tap.
 *
 * Tout est sans effet hors application native (web / GitHub Pages) et
 * entièrement défensif : aucune erreur ne doit remonter à l'utilisateur.
 */

const VERSION_URL =
  "https://github.com/EmilyGuindi/Culture-G/releases/download/android-latest/app-version.json";

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

/** Valide le bundle OTA courant (sinon Capgo ferait un rollback). */
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
    const url = remote.apkUrl || VERSION_URL.replace("app-version.json", "culture-g.apk");
    const browser = plugin("Browser");
    if (browser && typeof browser.open === "function") browser.open({ url });
    else window.open(url, "_blank");
  };
  bar.querySelector("#ub-go").addEventListener("click", openApk);
  bar.querySelector("#ub-x").addEventListener("click", () => bar.remove());
}

/** Vérifie s'il existe une APK plus récente et propose de l'installer. */
async function checkNativeUpdate() {
  try {
    const local = await nativeVersionCode();
    if (local == null) return;
    const remote = await fetchJson(VERSION_URL);
    if (remote && Number(remote.versionCode) > local) showBanner(remote);
  } catch (_) {
    /* hors-ligne ou pas encore de version.json : on ignore silencieusement */
  }
}

export function initUpdateCheck() {
  if (!isNative()) return; // aucun effet sur le web
  notifyReady();
  // petit délai pour ne pas gêner le premier rendu
  setTimeout(checkNativeUpdate, 2500);
}
