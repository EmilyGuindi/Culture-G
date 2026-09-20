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

## 📱 Installer en vraie app Android (APK)

L'app peut être empaquetée en **APK Android installable** (via [Capacitor](https://capacitorjs.com/)).
L'APK embarque tout le contenu : elle **fonctionne hors-ligne**, sans lien internet.

### Le plus simple : télécharger l'APK prête

À chaque push, GitHub Actions compile l'APK et la publie ici :

- **Releases → « Culture G — APK Android (dernière version) »** → fichier `culture-g.apk`.

Ouvre ce lien depuis ton téléphone, télécharge le `.apk`, ouvre-le et installe
(autorise si besoin « installer des applis inconnues » pour ton navigateur).

Tu peux aussi lancer la compilation à la demande depuis l'onglet **Actions →
Build Android APK → Run workflow**.

### Compiler soi-même (nécessite le SDK Android + JDK 17+)

```bash
npm install
npm run android:apk
# → android/app/build/outputs/apk/debug/app-debug.apk
```

`npm run build:web` assemble le dossier `www/` (les fichiers embarqués),
`npx cap add android` génère le projet natif, et Gradle produit l'APK.

### Mises à jour de l'app installée

Une APK sideloadée ne se met pas à jour toute seule comme sur le Play Store,
mais deux mécanismes couvrent les deux types de changements :

- **Contenu / design (web) → OTA silencieux.** Le plugin
  [`@capgo/capacitor-updater`](https://capgo.app/) applique les nouveaux
  bundles web au lancement, sans réinstaller. **À activer une fois** :
  1. Crée un compte Capgo (palier gratuit) et enregistre l'app :
     `npx @capgo/cli app add com.cultureg.daily` puis récupère ta clé API.
  2. Ajoute-la dans le dépôt : *Settings → Secrets and variables → Actions →
     New secret* nommé `CAPGO_TOKEN`. La CI enverra alors chaque build à Capgo.
- **Changements natifs → bandeau « Mettre à jour ».** L'app compare sa
  `versionCode` à `app-version.json` (publié dans la Release) et propose
  d'installer la nouvelle APK en un tap. Rien à configurer.

> ⚠️ Il faut **réinstaller une fois** l'APK qui contient ce système de mise à
> jour pour que les suivantes se fassent automatiquement (OTA) ou en un tap.

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
