import { lessons } from "../data/provider.js";
import { store } from "../store.js";
import { navigate } from "../router.js";
import { getLessonPhoto } from "../data/photos.js";

/** Surligne dates, pourcentages et termes « … » pour un texte plus vivant. */
function enrich(text) {
  let t = String(text);
  t = t.replace(/«[^»]+»/g, (m) => `<span class="hl-term">${m}</span>`);
  t = t.replace(/\b(1[0-9]{3}|20[0-9]{2})\b/g, (m) => `<span class="hl-num">${m}</span>`);
  t = t.replace(/(\d{1,3})\s?%/g, (m) => `<span class="hl-num">${m}</span>`);
  return t;
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (_) {
    return false;
  }
}

export async function renderLesson(params) {
  const lesson = await lessons.getLesson(params.id);
  if (!lesson) return `<div class="card">Leçon introuvable.</div>`;

  const cat = lessons.getCategories().find((c) => c.id === lesson.category);
  store.markLessonProgress(lesson.id);

  // Corps + citation mise en avant (l'essentiel), insérée après le 2e paragraphe.
  // enrich() donne de la vie au texte : dates, pourcentages et termes « … »
  // sont surlignés à la couleur du thème.
  const paras = lesson.body.map((p) => `<p>${enrich(p)}</p>`);
  if (lesson.retenir) {
    const at = Math.min(2, paras.length);
    paras.splice(at, 0, `<blockquote class="pullquote">${enrich(lesson.retenir)}</blockquote>`);
  }

  const el = document.createElement("div");
  el.className = "stagger";
  el.innerHTML = `
    <div class="read-progress" aria-hidden="true"></div>
    <button class="btn btn-ghost" id="back">← Retour</button>

    <article style="--accent:${cat.color};">
      <header class="lesson-cover">
        <div class="lc-photo" aria-hidden="true"></div>
        <span class="lc-motif" aria-hidden="true">${cat.icon}</span>
        <div class="lc-body">
          <span class="chip lc-chip">${cat.icon} ${cat.label}${lesson.generated ? ' · <span class="ia-tag">IA</span>' : ""}</span>
          <h1 class="lesson-title">${lesson.title}</h1>
          <span class="lc-meta">⏱ ${lesson.minutes} min de lecture</span>
        </div>
      </header>

      <p class="lesson-lead">${lesson.summary}</p>

      <div class="lesson-body">
        ${paras.join("")}
      </div>

      <div class="callout stylé">
        <div class="callout-title">✨ Le fait stylé à ressortir</div>
        <p>${lesson.funFact}</p>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary btn-arrow" id="quiz">
          <span>Passer au quiz</span>
          <span class="btn-ic" aria-hidden="true">→</span>
        </button>
        <button class="btn btn-outline" id="lib">Retour à la bibliothèque</button>
      </div>
    </article>
  `;

  el.querySelector("#back").addEventListener("click", () => history.back());
  el.querySelector("#quiz").addEventListener("click", () => navigate("quiz", { id: lesson.id }));
  el.querySelector("#lib").addEventListener("click", () => navigate("library"));

  // Apparition au fil de la lecture (jamais de texte caché sans IO).
  if ("IntersectionObserver" in window && !prefersReducedMotion()) {
    const items = el.querySelectorAll(".lesson-body p, .pullquote");
    items.forEach((n) => n.classList.add("js-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    items.forEach((n) => io.observe(n));
  }

  // Photo réelle (option Wikipédia) : superposée à la couverture générée,
  // qui reste le fond de secours (hors-ligne / pas de résultat).
  getLessonPhoto(lesson)
    .then((src) => {
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const cover = el.querySelector(".lesson-cover");
        const layer = el.querySelector(".lc-photo");
        if (!cover || !layer) return;
        layer.style.backgroundImage = `url("${src}")`;
        cover.classList.add("has-photo");
        const credit = document.createElement("span");
        credit.className = "lc-credit";
        credit.textContent = "Photo : Wikipédia";
        cover.appendChild(credit);
      };
      img.src = src;
    })
    .catch(() => {});

  return el;
}
