import { lessons } from "../data/provider.js";
import { store } from "../store.js";
import { navigate } from "../router.js";
import { aiConfig, generateLesson } from "../ai/generator.js";

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
  const aiOn = aiConfig.isEnabled();

  el.innerHTML = `
    <header class="page-head" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
      <div>
        <span class="eyebrow">Explorer</span>
        <h1>Bibliothèque</h1>
        <p>${all.length} sujets · choisis un thème et progresse.</p>
      </div>
      <button class="icon-btn" id="settings" title="Réglages IA">⚙️</button>
    </header>

    <section class="ai-banner ${aiOn ? "on" : ""}">
      <div class="ai-banner-txt">
        <strong>✨ Leçons par IA</strong>
        <span class="muted">${aiOn ? "Génère une nouvelle leçon quand tu veux." : "Active l'IA pour des leçons illimitées."}</span>
      </div>
      <button class="btn btn-primary small" id="generate">${aiOn ? "Générer une leçon" : "Activer l'IA"}</button>
    </section>

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
          <div class="topic" data-id="${l.id}" style="--accent:${c.color};">
            <div class="ic">${c.icon}</div>
            <div class="t-main">
              <div class="t-title">${l.title} ${l.generated ? '<span class="ia-tag">IA</span>' : ""}</div>
              <div class="t-cat">${c.label} · ${l.minutes} min</div>
            </div>
            <span class="status ${st.cls}">${st.txt}</span>
          </div>`;
        })
        .join("")}
      ${filtered.length === 0 ? `<p class="muted center">Aucun sujet dans ce thème pour le moment.</p>` : ""}
    </div>
  `;

  el.querySelector("#settings").addEventListener("click", () => navigate("settings"));

  el.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => navigate("library", { cat: btn.dataset.cat }));
  });
  el.querySelectorAll(".topic").forEach((t) => {
    t.addEventListener("click", () => navigate("lesson", { id: t.dataset.id }));
  });

  el.querySelector("#generate").addEventListener("click", async () => {
    if (!aiConfig.isEnabled()) {
      navigate("settings");
      return;
    }
    // thème : filtre actif, sinon aléatoire
    const catId = active !== "all" ? active : cats[Math.floor(Math.random() * cats.length)].id;
    const btn = el.querySelector("#generate");
    const banner = el.querySelector(".ai-banner");
    btn.disabled = true;
    btn.textContent = "Génération…";
    banner.classList.add("loading");
    try {
      const lesson = await generateLesson(catId);
      navigate("lesson", { id: lesson.id });
    } catch (e) {
      banner.classList.remove("loading");
      btn.disabled = false;
      btn.textContent = "Réessayer";
      alert("Génération impossible.\n\n" + (e.message || e));
    }
  });

  return el;
}
