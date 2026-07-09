# Culture G Daily

Web app mobile-first pour développer sa culture générale en **5 minutes par jour**.

Interface élégante et minimaliste (fond crème, texte anthracite, accents bleu nuit & doré),
progression sauvegardée localement, et une architecture pensée pour brancher plus tard
une API IA qui génère les leçons.

## ✨ Fonctionnalités

- **Accueil** : leçon du jour, streak quotidienne, progression de la semaine.
- **Leçon du jour** : texte court (400–600 mots), encadrés « À retenir » et « Le fait stylé à ressortir ».
- **Quiz** : 3 questions à choix multiple, feedback immédiat, score final.
- **Bibliothèque** : 7 thèmes (Histoire, Géopolitique, Sciences, Économie, Philosophie, Arts, Technologie),
  cartes de sujets avec statut (non commencé / en cours / maîtrisé).
- **Profil** : streak, leçons terminées, thèmes forts/faibles, score global de culture générale.
- Progression **persistée dans le `localStorage`**.
- **Responsive** mobile & desktop, avec animations légères de transition.

## 🚀 Lancer l'app

Aucune installation ni build nécessaire. L'app utilise des modules ES,
il faut donc la servir via HTTP (le protocole `file://` bloque les modules) :

```bash
# depuis la racine du projet
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Déployable tel quel sur **GitHub Pages** (source = branche, dossier racine).

## 🧱 Architecture

```
index.html
css/styles.css          → design system
js/
  app.js                → bootstrap : routes + navigation
  router.js             → routeur hash + transitions de page
  store.js              → état & persistance localStorage (streak, scores…)
  components/nav.js     → tab bar
  data/
    lessons.js          → contenu fictif local (schéma partagé)
    provider.js         → couche d'abstraction des leçons
  pages/                → home, lesson, quiz, library, profile
```

### Brancher une API IA plus tard

Tout le contenu passe par `js/data/provider.js` (jamais par `lessons.js` directement).
Pour connecter une IA, il suffit d'implémenter la **même interface** dans une classe
`AiLessonProvider` (un squelette commenté est déjà fourni) puis de remplacer la ligne :

```js
export const lessons = new LocalLessonProvider();
// →
export const lessons = new AiLessonProvider(API_URL, API_KEY);
```

Les leçons renvoyées par l'API doivent respecter le schéma décrit en tête de `lessons.js`
(`title`, `category`, `body[]`, `retenir`, `funFact`, `quiz[]`…). Aucune page n'a besoin
d'être modifiée.
