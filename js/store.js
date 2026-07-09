/**
 * Store — état de progression persistant (localStorage).
 *
 * Gère : streak quotidienne, leçons terminées, statut par leçon,
 * scores de quiz par catégorie, activité de la semaine.
 *
 * Toute la persistance passe par ici. Les pages lisent/écrivent via
 * les méthodes exposées, jamais directement dans localStorage.
 */

import { CATEGORIES } from "./data/lessons.js";

const KEY = "culture-g-daily:v1";

const defaultState = () => ({
  createdAt: todayStr(),
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  completedLessons: [], // ids
  // statut par leçon : { [id]: "progress" | "mastered" }
  lessonStatus: {},
  // scores par catégorie : { [catId]: { correct, total } }
  categoryScores: {},
  // dates d'activité (YYYY-MM-DD) pour la semaine
  activeDates: [],
});

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a, b) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / 86400000);
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

  /** Remet la streak à zéro si un jour a été sauté. */
  _refreshStreak() {
    const last = this.state.lastActiveDate;
    if (!last) return;
    const gap = daysBetween(last, todayStr());
    if (gap > 1) {
      this.state.streak = 0;
      this._save();
    }
  }

  /** Marque une activité aujourd'hui et met à jour la streak. */
  markActiveToday() {
    const today = todayStr();
    if (this.state.lastActiveDate === today) return;

    const gap = this.state.lastActiveDate
      ? daysBetween(this.state.lastActiveDate, today)
      : null;

    if (gap === 1) this.state.streak += 1;
    else this.state.streak = 1;

    this.state.lastActiveDate = today;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);

    if (!this.state.activeDates.includes(today)) {
      this.state.activeDates.push(today);
    }
    this._save();
  }

  markLessonProgress(id) {
    if (this.state.lessonStatus[id] !== "mastered") {
      this.state.lessonStatus[id] = "progress";
    }
    this.markActiveToday();
    this._save();
  }

  /** Enregistre le résultat d'un quiz pour une leçon. */
  recordQuiz(lesson, correct, total) {
    const id = lesson.id;
    if (!this.state.completedLessons.includes(id)) {
      this.state.completedLessons.push(id);
    }
    // maîtrisé si au moins 2/3 de bonnes réponses
    this.state.lessonStatus[id] = correct / total >= 2 / 3 ? "mastered" : "progress";

    const cat = lesson.category;
    const prev = this.state.categoryScores[cat] || { correct: 0, total: 0 };
    this.state.categoryScores[cat] = {
      correct: prev.correct + correct,
      total: prev.total + total,
    };

    this.markActiveToday();
    this._save();
  }

  getStatus(id) {
    return this.state.lessonStatus[id] || "todo";
  }

  get completedCount() {
    return this.state.completedLessons.length;
  }

  /** Activité des 7 derniers jours (lun→dim) pour l'affichage hebdo. */
  getWeek() {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // 0 = lundi
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);

    const labels = ["L", "M", "M", "J", "V", "S", "D"];
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = todayStr(d);
      week.push({
        label: labels[i],
        date: ds,
        done: this.state.activeDates.includes(ds),
        today: ds === todayStr(),
      });
    }
    return week;
  }

  /** Force/faiblesse par thème + score global de culture G (0–100). */
  getThemeScores() {
    const rows = CATEGORIES.map((c) => {
      const s = this.state.categoryScores[c.id];
      const pct = s && s.total ? Math.round((s.correct / s.total) * 100) : null;
      return { id: c.id, label: c.label, icon: c.icon, pct, played: !!s };
    });
    return rows;
  }

  getGlobalScore() {
    const played = this.getThemeScores().filter((r) => r.played);
    if (!played.length) return 0;
    const avg = played.reduce((a, r) => a + r.pct, 0) / played.length;
    // pondéré par le nombre de leçons terminées (progression + maîtrise)
    const coverage = Math.min(1, this.completedCount / 8);
    return Math.round(avg * (0.6 + 0.4 * coverage));
  }

  strongestTheme() {
    const played = this.getThemeScores().filter((r) => r.played);
    if (!played.length) return null;
    return played.reduce((a, b) => (b.pct > a.pct ? b : a));
  }

  weakestTheme() {
    const played = this.getThemeScores().filter((r) => r.played);
    if (!played.length) return null;
    return played.reduce((a, b) => (b.pct < a.pct ? b : a));
  }

  reset() {
    this.state = defaultState();
    this._save();
  }
}

export const store = new Store();
