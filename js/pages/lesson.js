import { lessons } from "../data/provider.js";
import { store } from "../store.js";
import { navigate } from "../router.js";

export async function renderLesson(params) {
  const lesson = await lessons.getLesson(params.id);
  if (!lesson) return `<div class="card">Leçon introuvable.</div>`;

  const cat = lessons.getCategories().find((c) => c.id === lesson.category);
  store.markLessonProgress(lesson.id);

  const el = document.createElement("div");
  el.className = "stagger";
  el.innerHTML = `
    <button class="btn btn-ghost" id="back">← Retour</button>

    <article style="--accent:${cat.color};">
      <div class="lesson-meta">
        <span class="chip">${cat.icon} ${cat.label}</span>
        <span class="muted" style="font-size:.85rem;">${lesson.minutes} min de lecture</span>
      </div>
      <h1 class="lesson-title">${lesson.title}</h1>
      <p class="muted">${lesson.summary}</p>

      <div class="lesson-body">
        ${lesson.body.map((p) => `<p>${p}</p>`).join("")}
      </div>

      <div class="callout retenir">
        <div class="callout-title">📌 À retenir</div>
        <p>${lesson.retenir}</p>
      </div>

      <div class="callout stylé">
        <div class="callout-title">✨ Le fait stylé à ressortir</div>
        <p>${lesson.funFact}</p>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary" id="quiz">Passer au quiz</button>
        <button class="btn btn-outline" id="lib">Retour à la bibliothèque</button>
      </div>
    </article>
  `;

  el.querySelector("#back").addEventListener("click", () => history.back());
  el.querySelector("#quiz").addEventListener("click", () =>
    navigate("quiz", { id: lesson.id })
  );
  el.querySelector("#lib").addEventListener("click", () => navigate("library"));

  return el;
}
