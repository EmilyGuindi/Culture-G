/**
 * Router minimaliste basé sur le hash (#/route).
 * Gère les animations légères de transition entre les pages.
 */

const routes = {};
let notFound = null;
let currentPath = null;

export function register(path, render) {
  routes[path] = render;
}

export function setNotFound(render) {
  notFound = render;
}

/** Navigue vers une route (ex: navigate("lesson", { id: "..." })). */
export function navigate(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  location.hash = `#/${path}${query ? "?" + query : ""}`;
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "") || "home";
  const [path, queryStr] = raw.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryStr || ""));
  return { path: path || "home", params };
}

async function resolve() {
  const { path, params } = parseHash();
  const render = routes[path] || notFound;
  if (!render) return;

  const view = document.getElementById("view");
  const isSamePath = path === currentPath;
  currentPath = path;

  // Rendu du contenu
  const content = await render(params);

  view.innerHTML = "";
  if (typeof content === "string") view.innerHTML = content;
  else if (content instanceof Node) view.appendChild(content);

  // Animation de transition (sauf reduced-motion géré en CSS)
  view.classList.remove("view-enter");
  // reflow pour rejouer l'animation
  void view.offsetWidth;
  view.classList.add("view-enter");

  if (!isSamePath) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  // notifie la tab bar
  window.dispatchEvent(new CustomEvent("route:changed", { detail: { path, params } }));
}

export function startRouter() {
  window.addEventListener("hashchange", resolve);
  resolve();
}

export function getCurrentPath() {
  return currentPath;
}
