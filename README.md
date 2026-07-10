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
  50 sujets avec statut (non commencé / en cours / maîtrisé).
- **Profil** : streak, leçons terminées, thèmes forts/faibles, score global de culture générale.
- **Gamification** : XP, 9 niveaux, 12 badges, objectif quotidien, confettis.
- **Génération par IA** (optionnelle) : crée des leçons illimitées via l'API Claude.
- Progression **persistée dans le `localStorage`**.
- **PWA installable** (mobile & desktop) avec animations légères de transition.

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

### Génération par IA (intégrée)

Le contenu passe par `js/data/provider.js` (jamais par `lessons.js` directement).
Le générateur IA (`js/ai/generator.js`) appelle l'**API Claude** pour créer de
nouvelles leçons **à la volée**, au même schéma que les leçons locales, et les
ajoute à la bibliothèque via `provider.addGenerated()`. Aucune page n'est modifiée :
les leçons IA apparaissent comme les autres (avec un badge « IA »).

**Activer l'IA** : Bibliothèque → ⚙️ → coller une clé API Anthropic
(`console.anthropic.com` → API Keys) et choisir un modèle. La clé est stockée
**uniquement dans le navigateur** (usage personnel), et le bouton
« Générer une leçon » crée un nouveau sujet sur le thème choisi.

> ⚠️ La génération IA nécessite un appel réseau vers `api.anthropic.com` : elle
> fonctionne sur la version **déployée** (GitHub Pages) ou en **local**, mais pas
> dans l'aperçu « artifact » (requêtes externes bloquées). Les 50 leçons intégrées
> restent disponibles partout, hors ligne.

Modèle par défaut : `claude-opus-4-8` (choix Haiku / Sonnet / Opus dans les réglages).
