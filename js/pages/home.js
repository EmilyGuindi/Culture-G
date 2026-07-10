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
  const lvl = store.levelInfo();
  const goalDone = store.dailyGoalDone();

  const el = document.createElement("div");
  el.className = "stagger";
  el.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">${new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span>
      <h1>${greeting()} 👋</h1>
      <p>5 minutes aujourd'hui pour muscler votre culture générale.</p>
    </header>

    <section class="level-card">
      <div class="lvl-top">
        <div class="level-badge">Niv.${lvl.index + 1}</div>
        <div class="lvl-meta">
          <div class="lvl-title">${lvl.title}</div>
          <div class="lvl-sub">${store.earnedBadgeCount} badge${store.earnedBadgeCount > 1 ? "s" : ""} · ${store.completedCount} leçon${store.completedCount > 1 ? "s" : ""}</div>
        </div>
        <div class="lvl-xp"><b>${lvl.xp}</b><br><span class="lvl-sub">XP</span></div>
      </div>
      <div class="xpbar"><span style="width:${lvl.pct}%"></span></div>
      <div class="lvl-next">
        <span>Niveau ${lvl.index + 1}</span>
        <span>${lvl.isMax ? "Niveau max atteint 🏆" : `${lvl.toNext} XP → niveau ${lvl.index + 2}`}</span>
      </div>
    </section>

    <div class="rings">
      <div class="ring-card">
        <div class="mini-ring" style="--p:${goalDone ? 100 : 0}%"><div class="hole">${goalDone ? "✅" : "🎯"}</div></div>
        <div>
          <div class="rc-val">${goalDone ? "Fait !" : "À faire"}</div>
          <div class="rc-lbl">Objectif du jour</div>
        </div>
      </div>
      <div class="ring-card">
        <div class="mini-ring" style="--p:${Math.min(100, (store.state.streak % 7) / 7 * 100)}%"><div class="hole"><span class="flame-anim">🔥</span></div></div>
        <div>
          <div class="rc-val">${store.state.streak} j</div>
          <div class="rc-lbl">Série en cours</div>
        </div>
      </div>
    </div>

    <section class="hero-card" style="margin-top:16px;">
      <span class="eyebrow">Leçon du jour</span>
      <h2>${daily.title}</h2>
      <div class="hero-cat">${cat.icon} ${cat.label} · ${daily.minutes} min${status === "mastered" ? " · ✓ maîtrisée" : ""}</div>
      <p class="hero-preview">${daily.summary}</p>
      <div><span class="reward-tag">✨ +${status === "mastered" ? "10" : "45"} XP à gagner</span></div>
      <div class="btn-row">
        <button class="btn btn-primary" id="start">Commencer ma leçon</button>
      </div>
    </section>

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
        <div class="muted" style="font-size:.88rem;">50 sujets sur 7 thèmes à découvrir</div>
      </div>
      <span style="font-size:1.4rem;">→</span>
    </section>
  `;

  el.querySelector("#start").addEventListener("click", () => navigate("lesson", { id: daily.id }));
  el.querySelector("#go-library").addEventListener("click", () => navigate("library"));

  return el;
}
