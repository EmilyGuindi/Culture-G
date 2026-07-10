/**
 * Provider de leçons — couche d'abstraction.
 *
 * Source de base : leçons locales (lessons.js).
 * Extension : leçons générées par IA, persistées dans le localStorage et
 * fusionnées de façon transparente (même schéma, mêmes méthodes).
 *
 * Toutes les pages passent UNIQUEMENT par ce provider (jamais par
 * lessons.js directement). Le générateur IA (js/ai/generator.js) y ajoute
 * ses leçons via addGenerated() ; aucune page n'a besoin d'être modifiée.
 *
 * Interface :
 *   getCategories()                -> Category[]
 *   getAllLessons()                -> Promise<Lesson[]>
 *   getLesson(id)                  -> Promise<Lesson | null>
 *   getDailyLesson(dateStr)        -> Promise<Lesson>
 *   getByCategory(categoryId)      -> Promise<Lesson[]>
 *   addGenerated(lesson)           -> void   (leçon IA persistée)
 *   getGenerated()                 -> Lesson[]
 */

import { CATEGORIES, LESSONS, pickDailyLessonId } from "./lessons.js";

const GEN_KEY = "culture-g-generated:v1";

class LocalLessonProvider {
  getCategories() {
    return CATEGORIES;
  }

  getGenerated() {
    try {
      return JSON.parse(localStorage.getItem(GEN_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  addGenerated(lesson) {
    const all = this.getGenerated();
    all.unshift(lesson); // les plus récentes en tête
    try {
      localStorage.setItem(GEN_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn("Impossible de sauvegarder la leçon générée", e);
    }
  }

  _pool() {
    // leçons générées d'abord (mises en avant), puis le socle
    return [...this.getGenerated(), ...LESSONS];
  }

  async getAllLessons() {
    return this._pool();
  }

  async getLesson(id) {
    return this._pool().find((l) => l.id === id) || null;
  }

  async getDailyLesson(dateStr) {
    // la leçon du jour reste choisie dans le socle stable
    const id = pickDailyLessonId(dateStr);
    return this.getLesson(id);
  }

  async getByCategory(categoryId) {
    return this._pool().filter((l) => l.category === categoryId);
  }
}

export const lessons = new LocalLessonProvider();
