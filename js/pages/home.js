import { lessons } from "../data/provider.js";
import { store, todayStr } from "../store.js";
import { navigate } from "../router.js";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bel après-midi";
  return "Bonsoir";
}

export async function renderHome() {
  const daily = await lessons.getDailyLesson(todayStr());
  const cat = lessons.getCategories().find((c) => c.id === daily.category);
  const week = store.getWeek();
  const weekDone = week.filter((d) => d.done).length;
  const status = store.getStatus(daily.id);

  const el = document.createElement("div");
  el.className = "stagger";
  el.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">${new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span>
      <h1>${greeting()} 👋</h1>
      <p>5 minutes aujourd'hui pour muscler votre culture générale.</p>
    </header>

    <section class="hero-card">
      <span class="eyebrow">Leçon du jour</span>
      <h2>${daily.title}</h2>
      <div class="hero-cat">${cat.icon} ${cat.label} · ${daily.minutes} min${status === "mastered" ? " · ✓ maîtrisée" : ""}</div>
      <p class="hero-preview">${daily.summary}</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="start">Commencer ma leçon</button>
      </div>
    </section>

    <div class="stat-grid">
      <div class="stat">
        <div class="stat-value"><span class="flame">🔥</span> ${store.state.streak}</div>
        <div class="stat-label">Jours d'affilée</div>
      </div>
      <div class="stat">
        <div class="stat-value">${store.completedCount}</div>
        <div class="stat-label">Leçons terminées</div>
      </div>
    </div>

    <h3 class="section-title">Ma semaine</h3>
    <section class="card">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <strong>${weekDone}/7 jours actifs</strong>
        <span class="muted" style="font-size:.85rem;">Objectif : chaque jour</span>
      </div>
      <div class="week">
        ${week
          .map(
            (d) => `
          <div class="day ${d.done ? "done" : ""} ${d.today ? "today" : ""}">
            <div class="dot">${d.done ? "✓" : d.label}</div>
            <div>${d.label}</div>
          </div>`
          )
          .join("")}
      </div>
    </section>

    <h3 class="section-title">Explorer</h3>
    <section class="card" id="go-library" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <strong>Bibliothèque</strong>
        <div class="muted" style="font-size:.88rem;">7 thèmes, des dizaines de sujets à découvrir</div>
      </div>
      <span style="font-size:1.4rem;">→</span>
    </section>
  `;

  el.querySelector("#start").addEventListener("click", () =>
    navigate("lesson", { id: daily.id })
  );
  el.querySelector("#go-library").addEventListener("click", () => navigate("library"));

  return el;
}
