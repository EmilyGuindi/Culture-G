/**
 * Store — état de progression persistant (localStorage) + gamification.
 *
 * Gère : streak, leçons terminées, statuts, scores par thème,
 * XP, niveaux, badges/succès, objectif quotidien.
 *
 * Toute la persistance passe par ici. Les pages lisent/écrivent via
 * les méthodes exposées, jamais directement dans localStorage.
 */

import { CATEGORIES } from "./data/lessons.js";

const KEY = "culture-g-daily:v1";

/** Paliers de niveaux (titres = progression de culture générale). */
export const LEVELS = [
  { min: 0, title: "Novice curieux" },
  { min: 120, title: "Apprenti" },
  { min: 300, title: "Amateur éclairé" },
  { min: 550, title: "Esprit cultivé" },
  { min: 900, title: "Érudit" },
  { min: 1400, title: "Fin connaisseur" },
  { min: 2000, title: "Encyclopédiste" },
  { min: 2800, title: "Maître de Culture G" },
  { min: 4000, title: "Légende de la Culture G" },
];

/** Récompenses XP. */
const XP = {
  read: 10, // lire une leçon (une fois)
  correct: 10, // par bonne réponse
  mastered: 20, // bonus leçon maîtrisée (≥ 2/3)
  perfect: 15, // bonus quiz parfait (3/3)
};

/** Badges / succès. `test(store)` renvoie true quand débloqué. */
export const BADGES = [
  { id: "premiere-lecon", icon: "🎓", title: "Premiers pas", desc: "Terminer 1 leçon", test: (s) => s.completedCount >= 1 },
  { id: "assidu", icon: "📚", title: "Assidu", desc: "Terminer 10 leçons", test: (s) => s.completedCount >= 10 },
  { id: "boulimique", icon: "🍽️", title: "Boulimique de savoir", desc: "Terminer 25 leçons", test: (s) => s.completedCount >= 25 },
  { id: "encyclopedie", icon: "🏛️", title: "Encyclopédie vivante", desc: "Terminer 50 leçons", test: (s) => s.completedCount >= 50 },
  { id: "sans-faute", icon: "✨", title: "Sans faute", desc: "Un quiz parfait (3/3)", test: (s) => s.state.perfectQuizzes >= 1 },
  { id: "serie-parfaite", icon: "💯", title: "Cinq sans faute", desc: "5 quiz parfaits", test: (s) => s.state.perfectQuizzes >= 5 },
  { id: "streak-3", icon: "⚡", title: "En rythme", desc: "3 jours d'affilée", test: (s) => s.state.bestStreak >= 3 },
  { id: "streak-7", icon: "📆", title: "Semaine parfaite", desc: "7 jours d'affilée", test: (s) => s.state.bestStreak >= 7 },
  { id: "streak-30", icon: "🗓️", title: "Increvable", desc: "30 jours d'affilée", test: (s) => s.state.bestStreak >= 30 },
  { id: "explorateur", icon: "🧭", title: "Explorateur", desc: "Un thème entamé dans chaque catégorie", test: (s) => s.state.categoriesPlayed.length >= CATEGORIES.length },
  { id: "specialiste", icon: "🎯", title: "Spécialiste", desc: "Maîtriser 3 leçons d'un même thème", test: (s) => Object.values(s.state.masteredByCat).some((n) => n >= 3) },
  { id: "erudit", icon: "⭐", title: "Érudit", desc: "Atteindre le niveau Érudit", test: (s) => s.levelInfo().index >= 4 },
];

const defaultState = () => ({
  createdAt: todayStr(),
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  completedLessons: [],
  lessonStatus: {}, // { [id]: "progress" | "mastered" }
  categoryScores: {}, // { [catId]: { correct, total } }
  activeDates: [],
  // gamification
  xp: 0,
  badges: [], // ids débloqués
  read: [], // ids de leçons lues (XP lecture)
  perfectQuizzes: 0,
  categoriesPlayed: [], // catégories avec ≥ 1 leçon terminée
  masteredByCat: {}, // { catId: nb de leçons maîtrisées }
});

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}

class Store {
  constructor() {
    this.state = this._load();
    this._refreshStreak();
  }

  _load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch (e) {
      console.warn("Store: lecture impossible, réinitialisation", e);
      return defaultState();
    }
  }

  _save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Store: sauvegarde impossible", e);
    }
  }

  _refreshStreak() {
    const last = this.state.lastActiveDate;
    if (last && daysBetween(last, todayStr()) > 1) {
      this.state.streak = 0;
      this._save();
    }
  }

  markActiveToday() {
    const today = todayStr();
    if (this.state.lastActiveDate === today) return;
    const gap = this.state.lastActiveDate ? daysBetween(this.state.lastActiveDate, today) : null;
    this.state.streak = gap === 1 ? this.state.streak + 1 : 1;
    this.state.lastActiveDate = today;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
    if (!this.state.activeDates.includes(today)) this.state.activeDates.push(today);
    this._save();
  }

  /** Lecture d'une leçon → petit XP la première fois. */
  markLessonProgress(id) {
    if (this.state.lessonStatus[id] !== "mastered") this.state.lessonStatus[id] = "progress";
    if (!this.state.read.includes(id)) {
      this.state.read.push(id);
      this.state.xp += XP.read;
    }
    this.markActiveToday();
    this._checkBadges();
    this._save();
  }

  /**
   * Enregistre un quiz et attribue l'XP.
   * @returns {{xpEarned,leveledUp,fromTitle,toTitle,newBadges}}
   */
  recordQuiz(lesson, correct, total) {
    const id = lesson.id;
    const before = this.levelInfo().index;

    if (!this.state.completedLessons.includes(id)) this.state.completedLessons.push(id);

    const wasMastered = this.state.lessonStatus[id] === "mastered";
    const mastered = correct / total >= 2 / 3;
    this.state.lessonStatus[id] = mastered ? "mastered" : "progress";

    // scores par catégorie
    const cat = lesson.category;
    const prev = this.state.categoryScores[cat] || { correct: 0, total: 0 };
    this.state.categoryScores[cat] = { correct: prev.correct + correct, total: prev.total + total };
    if (!this.state.categoriesPlayed.includes(cat)) this.state.categoriesPlayed.push(cat);
    if (mastered && !wasMastered) {
      this.state.masteredByCat[cat] = (this.state.masteredByCat[cat] || 0) + 1;
    }

    // XP
    let xpEarned = correct * XP.correct;
    if (mastered) xpEarned += XP.mastered;
    if (correct === total) {
      xpEarned += XP.perfect;
      this.state.perfectQuizzes += 1;
    }
    this.state.xp += xpEarned;

    this.markActiveToday();
    const newBadges = this._checkBadges();
    this._save();

    const after = this.levelInfo().index;
    return {
      xpEarned,
      leveledUp: after > before,
      fromTitle: LEVELS[before].title,
      toTitle: LEVELS[after].title,
      newBadges,
    };
  }

  /** Débloque les badges nouvellement obtenus, renvoie la liste des nouveaux. */
  _checkBadges() {
    const newly = [];
    for (const b of BADGES) {
      if (!this.state.badges.includes(b.id) && b.test(this)) {
        this.state.badges.push(b.id);
        newly.push(b);
      }
    }
    return newly;
  }

  // ---- Niveaux ----
  levelInfo() {
    const xp = this.state.xp;
    let index = 0;
    for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) index = i;
    const cur = LEVELS[index];
    const next = LEVELS[index + 1];
    const isMax = !next;
    const span = isMax ? 1 : next.min - cur.min;
    const into = xp - cur.min;
    return {
      index,
      title: cur.title,
      xp,
      curMin: cur.min,
      nextMin: isMax ? xp : next.min,
      into,
      span,
      pct: isMax ? 100 : Math.round((into / span) * 100),
      isMax,
      toNext: isMax ? 0 : next.min - xp,
    };
  }

  // ---- Getters ----
  getStatus(id) {
    return this.state.lessonStatus[id] || "todo";
  }
  get completedCount() {
    return this.state.completedLessons.length;
  }
  get xp() {
    return this.state.xp;
  }

  getBadges() {
    return BADGES.map((b) => ({ ...b, earned: this.state.badges.includes(b.id) }));
  }
  get earnedBadgeCount() {
    return this.state.badges.length;
  }

  /** Objectif du jour : au moins une leçon/quiz aujourd'hui. */
  dailyGoalDone() {
    return this.state.activeDates.includes(todayStr());
  }

  getWeek() {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    const labels = ["L", "M", "M", "J", "V", "S", "D"];
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = todayStr(d);
      week.push({ label: labels[i], date: ds, done: this.state.activeDates.includes(ds), today: ds === todayStr() });
    }
    return week;
  }

  getThemeScores() {
    return CATEGORIES.map((c) => {
      const s = this.state.categoryScores[c.id];
      const pct = s && s.total ? Math.round((s.correct / s.total) * 100) : null;
      return { id: c.id, label: c.label, icon: c.icon, color: c.color, pct, played: !!s };
    });
  }

  getGlobalScore() {
    const played = this.getThemeScores().filter((r) => r.played);
    if (!played.length) return 0;
    const avg = played.reduce((a, r) => a + r.pct, 0) / played.length;
    const coverage = Math.min(1, this.completedCount / 12);
    return Math.round(avg * (0.6 + 0.4 * coverage));
  }

  strongestTheme() {
    const p = this.getThemeScores().filter((r) => r.played);
    return p.length ? p.reduce((a, b) => (b.pct > a.pct ? b : a)) : null;
  }
  weakestTheme() {
    const p = this.getThemeScores().filter((r) => r.played);
    return p.length ? p.reduce((a, b) => (b.pct < a.pct ? b : a)) : null;
  }

  reset() {
    this.state = defaultState();
    this._save();
  }
}

export const store = new Store();
