/** Barre de navigation (tab bar) avec icônes SVG en ligne. */

import { navigate, getCurrentPath } from "../router.js";

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  library: '<path d="M4 5v14"/><path d="M8 5v14"/><rect x="11" y="5" width="9" height="14" rx="1"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>',
};

const TABS = [
  { path: "home", label: "Accueil", icon: "home" },
  { path: "library", label: "Bibliothèque", icon: "library" },
  { path: "profile", label: "Profil", icon: "profile" },
];

function svg(paths) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

export function mountNav() {
  const nav = document.getElementById("tabbar");

  const paint = () => {
    const current = getCurrentPath() || "home";
    // les pages leçon/quiz restent rattachées à "accueil"
    const active = ["lesson", "quiz"].includes(current) ? "home" : current;

    nav.innerHTML = TABS.map(
      (t) => `
      <button class="tab ${t.path === active ? "active" : ""}" data-path="${t.path}">
        ${svg(ICONS[t.icon])}
        <span>${t.label}</span>
      </button>`
    ).join("");

    nav.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.dataset.path));
    });
  };

  paint();
  window.addEventListener("route:changed", paint);
}
