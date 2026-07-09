/**
 * Provider de leçons — couche d'abstraction.
 *
 * Aujourd'hui : source locale (leçons fictives dans lessons.js).
 * Demain : brancher une API IA sans toucher au reste de l'app.
 *
 * Toutes les pages passent UNIQUEMENT par ce provider (jamais par
 * lessons.js directement). Pour connecter une IA plus tard, il suffit
 * d'implémenter la même interface dans une classe `AiLessonProvider`
 * et de changer la ligne `export const lessons = ...` en bas.
 *
 * Interface :
 *   getCategories()                -> Category[]
 *   getAllLessons()                -> Promise<Lesson[]>
 *   getLesson(id)                  -> Promise<Lesson | null>
 *   getDailyLesson(dateStr)        -> Promise<Lesson>
 *   getByCategory(categoryId)      -> Promise<Lesson[]>
 */

import { CATEGORIES, LESSONS, pickDailyLessonId } from "./lessons.js";

class LocalLessonProvider {
  getCategories() {
    return CATEGORIES;
  }

  async getAllLessons() {
    return LESSONS;
  }

  async getLesson(id) {
    return LESSONS.find((l) => l.id === id) || null;
  }

  async getDailyLesson(dateStr) {
    const id = pickDailyLessonId(dateStr);
    return this.getLesson(id);
  }

  async getByCategory(categoryId) {
    return LESSONS.filter((l) => l.category === categoryId);
  }
}

/**
 * Exemple de squelette pour brancher une IA plus tard.
 * Décommenter et implémenter, puis remplacer l'export ci-dessous.
 *
 * class AiLessonProvider {
 *   constructor(apiBaseUrl, apiKey) { ... }
 *   async getLesson(id) {
 *     const res = await fetch(`${this.apiBaseUrl}/lessons/${id}`, {
 *       headers: { Authorization: `Bearer ${this.apiKey}` },
 *     });
 *     return res.json(); // doit respecter le même schéma que lessons.js
 *   }
 *   // ... implémenter les autres méthodes à l'identique
 * }
 */

export const lessons = new LocalLessonProvider();
