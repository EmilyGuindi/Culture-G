/**
 * Générateur de leçons par IA (API Claude / Anthropic).
 *
 * S'appuie sur la couche provider : une leçon générée respecte EXACTEMENT
 * le même schéma que les leçons locales (voir js/data/lessons.js), et est
 * ajoutée à la bibliothèque via le provider.
 *
 * ⚠️ Appel direct depuis le navigateur : la clé API est stockée dans le
 * localStorage de CE navigateur uniquement. À réserver à un usage personnel.
 * (Ne fonctionne pas dans l'aperçu « artifact » où les requêtes externes
 * sont bloquées — utiliser la version déployée ou locale.)
 */

import { CATEGORIES } from "../data/lessons.js";
import { lessons } from "../data/provider.js";

const KEY_API = "culture-g-ai:key";
const KEY_MODEL = "culture-g-ai:model";

const DEFAULT_MODEL = "claude-opus-4-8";

/** Modèles proposés (du plus économique au plus capable). */
export const AI_MODELS = [
  { id: "claude-haiku-4-5", label: "Haiku 4.5 — rapide & économique" },
  { id: "claude-sonnet-5", label: "Sonnet 5 — équilibré" },
  { id: "claude-opus-4-8", label: "Opus 4.8 — le plus capable" },
];

export const aiConfig = {
  getKey: () => localStorage.getItem(KEY_API) || "",
  setKey: (v) => localStorage.setItem(KEY_API, v.trim()),
  clearKey: () => localStorage.removeItem(KEY_API),
  getModel: () => localStorage.getItem(KEY_MODEL) || DEFAULT_MODEL,
  setModel: (v) => localStorage.setItem(KEY_MODEL, v),
  isEnabled: () => !!localStorage.getItem(KEY_API),
};

function categoryLabel(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).label || id;
}

function buildSystemPrompt() {
  return [
    "Tu es un auteur de contenus de culture générale pour une app éducative francophone.",
    "Tu écris des micro-leçons claires, rigoureuses, vivantes et accessibles à un large public.",
    "Tu réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises Markdown.",
    "Schéma exact attendu :",
    "{",
    '  "title": string,            // titre du sujet, concis',
    '  "summary": string,          // accroche d\'une phrase',
    '  "body": string[],           // 6 à 7 paragraphes, 400 à 600 mots au total',
    '  "retenir": string,          // l\'essentiel à retenir, 1-2 phrases',
    '  "funFact": string,          // un fait surprenant à ressortir',
    '  "quiz": [                   // EXACTEMENT 3 questions',
    "    {",
    '      "question": string,',
    '      "options": string[],    // EXACTEMENT 4 propositions',
    '      "answer": number,       // index (0-3) de la bonne réponse',
    '      "explain": string       // courte explication',
    "    }",
    "  ]",
    "}",
    "Contraintes : français impeccable, faits exacts et à jour, ton engageant mais sérieux, aucune information sensible ou dangereuse.",
  ].join("\n");
}

async function buildUserPrompt(categoryId) {
  const existing = await lessons.getByCategory(categoryId);
  const titles = existing.map((l) => l.title).slice(0, 20);
  return [
    `Génère une nouvelle leçon de culture générale dans le thème « ${categoryLabel(categoryId)} ».`,
    "Choisis un sujet précis, intéressant et pas trop technique.",
    titles.length
      ? `Évite ces sujets déjà traités : ${titles.join(" ; ")}.`
      : "",
    "Réponds uniquement avec l'objet JSON du schéma.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Extrait et parse le JSON d'une réponse (tolère d'éventuelles balises). */
function parseLessonJSON(text) {
  let t = (text || "").trim();
  // retire d'éventuelles clôtures Markdown ```json ... ```
  t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  // isole le premier objet { ... } si du texte l'entoure
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start > 0 || end < t.length - 1) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

/** Vérifie qu'une leçon générée respecte le schéma attendu. */
export function validateLesson(l) {
  const errs = [];
  if (!l || typeof l !== "object") return ["Réponse vide."];
  if (typeof l.title !== "string" || !l.title.trim()) errs.push("titre manquant");
  if (typeof l.summary !== "string") errs.push("résumé manquant");
  if (!Array.isArray(l.body) || l.body.length < 3) errs.push("corps manquant");
  if (typeof l.retenir !== "string") errs.push("« à retenir » manquant");
  if (typeof l.funFact !== "string") errs.push("« fait stylé » manquant");
  if (!Array.isArray(l.quiz) || l.quiz.length !== 3) errs.push("quiz ≠ 3 questions");
  else
    l.quiz.forEach((q, i) => {
      if (!q || typeof q.question !== "string") errs.push(`Q${i + 1} sans énoncé`);
      if (!Array.isArray(q.options) || q.options.length !== 4) errs.push(`Q${i + 1} ≠ 4 options`);
      if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) errs.push(`Q${i + 1} réponse invalide`);
    });
  return errs;
}

/**
 * Appelle l'API Claude et renvoie une leçon prête à l'emploi, déjà ajoutée
 * à la bibliothèque via le provider.
 * @param {string} categoryId
 * @returns {Promise<object>} la leçon générée
 */
export async function generateLesson(categoryId) {
  const apiKey = aiConfig.getKey();
  if (!apiKey) throw new Error("Aucune clé API configurée. Ouvre les réglages IA.");

  const model = aiConfig.getModel();
  const body = {
    model,
    max_tokens: 2000,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: await buildUserPrompt(categoryId) }],
  };

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(
      "Impossible de joindre l'API (réseau bloqué ?). L'IA fonctionne sur la version déployée ou en local, pas dans l'aperçu."
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message || "";
    } catch (_) {}
    if (res.status === 401) throw new Error("Clé API invalide (401). Vérifie ta clé.");
    if (res.status === 429) throw new Error("Trop de requêtes (429). Réessaie dans un instant.");
    throw new Error(`Erreur API ${res.status}. ${detail}`.trim());
  }

  const data = await res.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("Réponse inattendue de l'API.");

  let lesson;
  try {
    lesson = parseLessonJSON(textBlock.text);
  } catch (e) {
    throw new Error("La réponse de l'IA n'était pas un JSON valide. Réessaie.");
  }

  const problems = validateLesson(lesson);
  if (problems.length) throw new Error("Leçon incomplète : " + problems.join(", "));

  // Complète les champs techniques et enregistre
  lesson.id = `${categoryId}-ia-${Date.now().toString(36)}`;
  lesson.category = categoryId;
  lesson.minutes = 5;
  lesson.generated = true;

  lessons.addGenerated(lesson);
  return lesson;
}
