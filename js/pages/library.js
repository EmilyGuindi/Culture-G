import { lessons } from "../data/provider.js";
import { store } from "../store.js";
import { navigate } from "../router.js";

const STATUS_LABEL = {
  todo: { cls: "todo", txt: "Non commencé" },
  progress: { cls: "progress", txt: "En cours" },
  mastered: { cls: "mastered", txt: "Maîtrisé" },
};

export async function renderLibrary(params) {
  const all = await lessons.getAllLessons();
  const cats = lessons.getCategories();
  const active = params.cat || "all";

  const el = document.createElement("div");
  el.className = "stagger";

  const filtered = active === "all" ? all : all.filter((l) => l.category === active);

  const catById = Object.fromEntries(cats.map((c) => [c.id, c]));

  el.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">Explorer</span>
      <h1>Bibliothèque</h1>
      <p>Choisissez un thème et progressez à votre rythme.</p>
    </header>

    <div class="filter-row">
      <button class="filter ${active === "all" ? "active" : ""}" data-cat="all">Tous</button>
      ${cats
        .map(
          (c) => `<button class="filter ${active === c.id ? "active" : ""}" data-cat="${c.id}">${c.icon} ${c.label}</button>`
        )
        .join("")}
    </div>

    <div class="topic-list">
      ${filtered
        .map((l) => {
          const st = STATUS_LABEL[store.getStatus(l.id)];
          const c = catById[l.category];
          return `
          <div class="topic" data-id="${l.id}">
            <div class="ic">${c.icon}</div>
            <div class="t-main">
              <div class="t-title">${l.title}</div>
              <div class="t-cat">${c.label} · ${l.minutes} min</div>
            </div>
            <span class="status ${st.cls}">${st.txt}</span>
          </div>`;
        })
        .join("")}
      ${filtered.length === 0 ? `<p class="muted center">Aucun sujet dans ce thème pour le moment.</p>` : ""}
    </div>
  `;

  el.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => navigate("library", { cat: btn.dataset.cat }));
  });
  el.querySelectorAll(".topic").forEach((t) => {
    t.addEventListener("click", () => navigate("lesson", { id: t.dataset.id }));
  });

  return el;
}
