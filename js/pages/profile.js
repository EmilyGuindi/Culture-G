import { store, LEVELS } from "../store.js";
import { navigate } from "../router.js";

export async function renderProfile() {
  const themes = store.getThemeScores();
  const played = themes.filter((t) => t.played);
  const strong = store.strongestTheme();
  const weak = store.weakestTheme();
  const global = store.getGlobalScore();
  const lvl = store.levelInfo();
  const badges = store.getBadges();

  const el = document.createElement("div");
  el.className = "stagger";

  el.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">Mon profil</span>
      <h1>Ma culture G</h1>
    </header>

    <section class="level-card">
      <div class="lvl-top">
        <div class="level-badge">Niv.${lvl.index + 1}</div>
        <div class="lvl-meta">
          <div class="lvl-title">${lvl.title}</div>
          <div class="lvl-sub">${lvl.isMax ? "Niveau maximum 🏆" : `Plus que ${lvl.toNext} XP pour le niveau ${lvl.index + 2}`}</div>
        </div>
        <div class="lvl-xp"><b>${lvl.xp}</b><br><span class="lvl-sub">XP total</span></div>
      </div>
      <div class="xpbar"><span style="width:${lvl.pct}%"></span></div>
    </section>

    <div class="stat-grid">
      <div class="stat">
        <div class="stat-value"><span class="flame-anim">🔥</span> ${store.state.streak}</div>
        <div class="stat-label">Série en cours</div>
      </div>
      <div class="stat">
        <div class="stat-value">${store.completedCount}</div>
        <div class="stat-label">Leçons terminées</div>
      </div>
      <div class="stat">
        <div class="stat-value">${store.earnedBadgeCount}/${badges.length}</div>
        <div class="stat-label">Badges obtenus</div>
      </div>
      <div class="stat">
        <div class="stat-value">${global}<span style="font-size:1rem;color:var(--ink-faint);">/100</span></div>
        <div class="stat-label">Score de culture G</div>
      </div>
    </div>

    <h3 class="section-title">Mes badges</h3>
    <section class="card">
      <div class="badge-grid">
        ${badges
          .map(
            (b) => `
          <div class="badge ${b.earned ? "earned" : "locked"}" title="${b.desc}">
            <div class="b-ic">${b.icon}</div>
            <div class="b-name">${b.title}</div>
          </div>`
          )
          .join("")}
      </div>
      <p class="muted center" style="margin-top:12px;font-size:.82rem;">Touchez un badge pour voir comment l'obtenir.</p>
    </section>

    ${
      strong || weak
        ? `<h3 class="section-title">Forces & faiblesses</h3>
      <section class="card">
        ${strong ? `<div class="list-item"><span>💪 Point fort</span><strong>${strong.icon} ${strong.label} · ${strong.pct}%</strong></div>` : ""}
        ${weak && (!strong || weak.id !== strong.id) ? `<div class="list-item"><span>🎯 À travailler</span><strong>${weak.icon} ${weak.label} · ${weak.pct}%</strong></div>` : ""}
      </section>`
        : ""
    }

    <h3 class="section-title">Maîtrise par thème</h3>
    <section class="card">
      <div class="themes">
        ${themes
          .map((t) => {
            const pct = t.pct ?? 0;
            return `
            <div class="theme-row">
              <span class="t-name">${t.icon} ${t.label}</span>
              <span class="bar"><span style="width:${pct}%;background:${t.color}"></span></span>
              <span class="pct">${t.played ? pct + "%" : "—"}</span>
            </div>`;
          })
          .join("")}
      </div>
      ${played.length === 0 ? `<p class="muted center" style="margin-top:14px;">Terminez des quiz pour révéler vos statistiques.</p>` : ""}
    </section>

    <div class="btn-row" style="margin-top:24px;">
      <button class="btn btn-primary" id="go">Faire ma leçon du jour</button>
      <button class="btn btn-ghost" id="reset">Réinitialiser ma progression</button>
    </div>
  `;

  el.querySelectorAll(".badge").forEach((b) => {
    b.addEventListener("click", () => {
      const name = b.querySelector(".b-name").textContent;
      alert(`${name}\n\n${b.getAttribute("title")}${b.classList.contains("earned") ? "\n\n✅ Débloqué !" : "\n\n🔒 À débloquer"}`);
    });
  });
  el.querySelector("#go").addEventListener("click", () => navigate("home"));
  el.querySelector("#reset").addEventListener("click", () => {
    if (confirm("Réinitialiser toute votre progression ? Cette action est irréversible.")) {
      store.reset();
      navigate("home");
      location.reload();
    }
  });

  return el;
}
