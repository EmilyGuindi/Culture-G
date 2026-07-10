import { lessons } from "../data/provider.js";
import { store } from "../store.js";
import { navigate } from "../router.js";
import { burstConfetti } from "../components/confetti.js";

export async function renderQuiz(params) {
  const lesson = await lessons.getLesson(params.id);
  if (!lesson) return `<div class="card">Quiz introuvable.</div>`;

  const el = document.createElement("div");
  el.className = "view-enter";

  let index = 0;
  let correctCount = 0;
  let answered = false;
  const total = lesson.quiz.length;

  function renderQuestion() {
    const q = lesson.quiz[index];
    answered = false;
    el.innerHTML = `
      <button class="btn btn-ghost" id="quit">← Quitter</button>
      <div class="progress" style="margin-bottom:18px;"><span style="width:${(index / total) * 100}%"></span></div>
      <span class="quiz-progress">Question ${index + 1} / ${total}</span>
      <h2 class="question">${q.question}</h2>
      <div class="options">
        ${q.options
          .map(
            (opt, i) => `
          <button class="option" data-i="${i}">
            <span class="marker">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </button>`
          )
          .join("")}
      </div>
      <div id="fb"></div>
    `;
    el.querySelector("#quit").addEventListener("click", () => navigate("lesson", { id: lesson.id }));
    el.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => onAnswer(parseInt(btn.dataset.i, 10)));
    });
  }

  function onAnswer(choice) {
    if (answered) return;
    answered = true;
    const q = lesson.quiz[index];
    const isRight = choice === q.answer;
    if (isRight) correctCount++;

    el.querySelectorAll(".option").forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
      else if (i === choice) btn.classList.add("wrong");
    });

    const fb = el.querySelector("#fb");
    fb.innerHTML = `
      <div class="feedback ${isRight ? "ok" : "ko"}">
        <strong>${isRight ? "Bravo ! 🎉" : "Pas tout à fait."}</strong> ${q.explain}
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="next">${index + 1 < total ? "Question suivante" : "Voir mon score"}</button>
      </div>
    `;
    fb.querySelector("#next").addEventListener("click", () => {
      index++;
      if (index < total) renderQuestion();
      else finish();
    });
  }

  function finish() {
    const result = store.recordQuiz(lesson, correctCount, total);
    const pct = Math.round((correctCount / total) * 100);
    const mastered = correctCount / total >= 2 / 3;

    el.innerHTML = `
      <div class="stagger reward">
        <span class="eyebrow">Quiz terminé</span>
        <h1 class="lesson-title" style="margin-bottom:16px;">${lesson.title}</h1>

        <div class="score-ring" style="--pct:${pct}%">
          <div class="inner">
            <div>
              <div class="num">${correctCount}/${total}</div>
              <div class="muted" style="font-size:.8rem;">${pct}%</div>
            </div>
          </div>
        </div>

        <div class="xp-pop">+${result.xpEarned} XP</div>

        <p style="font-size:1.05rem;margin-top:6px;">
          ${mastered ? "Sujet <strong>maîtrisé</strong> ✅" : "Presque ! Un petit tour de révision et c'est acquis."}
        </p>

        ${
          result.leveledUp
            ? `<div class="levelup">
                 <div class="lu-eyebrow">Niveau supérieur !</div>
                 <div class="lu-title">Vous êtes ${result.toTitle} 🎖️</div>
               </div>`
            : ""
        }

        ${result.newBadges
          .map(
            (b) => `
          <div class="badge-unlocked">
            <div class="bu-ic">${b.icon}</div>
            <div class="bu-txt">
              <div class="bu-title">Badge débloqué : ${b.title}</div>
              <div class="bu-desc">${b.desc}</div>
            </div>
          </div>`
          )
          .join("")}

        <div class="btn-row" style="max-width:340px;margin:22px auto 0;">
          <button class="btn btn-primary" id="continue">Continuer</button>
          <button class="btn btn-outline" id="review">Revoir la leçon</button>
        </div>
      </div>
    `;

    if (mastered || result.leveledUp || result.newBadges.length) {
      burstConfetti({ intense: result.leveledUp || correctCount === total });
    }

    el.querySelector("#continue").addEventListener("click", () => navigate("home"));
    el.querySelector("#review").addEventListener("click", () => navigate("lesson", { id: lesson.id }));
  }

  renderQuestion();
  return el;
}
