import { lessons } from "../data/provider.js";
import { store, todayStr } from "../store.js";
import { navigate } from "../router.js";

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Encore debout";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bel après-midi";
  if (h < 22) return "Bonsoir";
  return "Bonne nuit";
}

/** Petite phrase d'accroche qui change selon l'état du jour. */
function subline({ goalDone, streak }) {
  if (goalDone) {
    const done = [
      "Objectif du jour plié. Le cerveau te dit merci. 🧠",
      "C'est fait pour aujourd'hui — reviens demain garder la série. 🔥",
      "Bien joué. Une leçon de plus dans la besace.",
    ];
    return done[new Date().getDate() % done.length];
  }
  if (streak >= 2) return `Série de ${streak} jours en jeu. On ne lâche rien aujourd'hui.`;
  const fresh = [
    "5 minutes. Un truc que tu ressortiras au prochain dîner.",
    "Une idée par jour, et la culture G devient un réflexe.",
    "Aujourd'hui, tu vas comprendre quelque chose que la plupart des gens ignorent.",
    "Petit effort, grand effet : 5 minutes suffisent.",
  ];
  return fresh[new Date().getDate() % fresh.length];
}

/** Transforme le résumé en accroche « curiosité ». */
function hookLine(daily) {
  const s = (daily.summary || "").trim();
  return s;
}

export async function renderHome() {
  const daily = await lessons.getDailyLesson(todayStr());
  const cat = lessons.getCategories().find((c) => c.id === daily.category);
  const week = store.getWeek();
  const weekDone = week.filter((d) => d.done).length;
  const status = store.getStatus(daily.id);
  const lvl = store.levelInfo();
  const goalDone = store.dailyGoalDone();
  const streak = store.state.streak;

  const el = document.createElement("div");
  el.className = "stagger";
  el.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">${new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span>
      <h1>${greeting()} 👋</h1>
      <p>${subline({ goalDone, streak })}</p>
    </header>

    <section class="home-hero ${goalDone ? "is-done" : ""}" style="--accent:${cat.color};">
      <div class="hh-core">
        <div class="hh-glow" aria-hidden="true"></div>
        <span class="eyebrow badge">${goalDone ? "Déjà vue aujourd'hui" : "Ta leçon du jour"}</span>
        <div class="hh-cat">${cat.icon} ${cat.label} · ${daily.minutes} min${status === "mastered" ? " · ✓ maîtrisée" : ""}</div>
        <h2>${daily.title}</h2>
        <p class="hook">${hookLine(daily)}</p>
        <div class="hh-foot">
          <span class="reward-tag">✨ +${status === "mastered" ? "10" : "45"} XP</span>
          <span class="hh-time">≈ ${daily.minutes} min de lecture</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary btn-arrow ${goalDone ? "" : "pulse"}" id="start">
            <span>${status === "mastered" ? "Relire la leçon" : goalDone ? "Reprendre la leçon" : "Commencer ma leçon"}</span>
            <span class="btn-ic" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>

    <section class="streak-ribbon ${goalDone ? "is-on" : ""}" id="go-profile">
      <div class="sr-flame"><span class="${streak > 0 ? "flame-anim" : ""}">${streak > 0 ? "🔥" : "✨"}</span></div>
      <div class="sr-main">
        <strong>${streak > 0 ? `Série de ${streak} jour${streak > 1 ? "s" : ""}` : "Lance ta série"}</strong>
        <span class="muted">${goalDone ? "Objectif du jour validé ✓" : "Fais 1 leçon pour valider aujourd'hui"}</span>
      </div>
      <div class="mini-week">
        ${week.map((d) => `<span class="mw-dot ${d.done ? "done" : ""} ${d.today ? "today" : ""}" title="${d.label}"></span>`).join("")}
      </div>
    </section>

    <section class="level-card" id="go-profile2">
      <div class="lvl-top">
        <div class="level-badge">Niv.${lvl.index + 1}</div>
        <div class="lvl-meta">
          <div class="lvl-title">${lvl.title}</div>
          <div class="lvl-sub">${store.earnedBadgeCount} badge${store.earnedBadgeCount > 1 ? "s" : ""} · ${store.completedCount} leçon${store.completedCount > 1 ? "s" : ""} · ${weekDone}/7 jours</div>
        </div>
        <div class="lvl-xp"><b>${lvl.xp}</b><br><span class="lvl-sub">XP</span></div>
      </div>
      <div class="xpbar"><span style="width:${lvl.pct}%"></span></div>
      <div class="lvl-next">
        <span>Niveau ${lvl.index + 1}</span>
        <span>${lvl.isMax ? "Niveau max atteint 🏆" : `${lvl.toNext} XP → niveau ${lvl.index + 2}`}</span>
      </div>
    </section>

    <h3 class="section-title">Explorer</h3>
    <section class="explore-card" id="go-library">
      <div class="ex-main">
        <strong>Bibliothèque</strong>
        <div class="muted">50 sujets · 7 thèmes à explorer</div>
        <div class="theme-chips">
          ${lessons.getCategories().map((c) => `<span class="tc" style="--accent:${c.color};" title="${c.label}">${c.icon}</span>`).join("")}
        </div>
      </div>
      <span class="ex-arrow">→</span>
    </section>
  `;

  el.querySelector("#start").addEventListener("click", () => navigate("lesson", { id: daily.id }));
  el.querySelector("#go-library").addEventListener("click", () => navigate("library"));
  el.querySelector("#go-profile").addEventListener("click", () => navigate("profile"));
  el.querySelector("#go-profile2").addEventListener("click", () => navigate("profile"));

  return el;
}
