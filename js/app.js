/**
 * Culture G Daily — point d'entrée.
 * Enregistre les routes, monte la navigation et démarre le router.
 */

import { register, setNotFound, startRouter } from "./router.js";
import { mountNav } from "./components/nav.js";
import { initUpdateCheck } from "./update-check.js";

import { renderHome } from "./pages/home.js";
import { renderLesson } from "./pages/lesson.js";
import { renderQuiz } from "./pages/quiz.js";
import { renderLibrary } from "./pages/library.js";
import { renderProfile } from "./pages/profile.js";
import { renderSettings } from "./pages/settings.js";

register("home", renderHome);
register("lesson", renderLesson);
register("quiz", renderQuiz);
register("library", renderLibrary);
register("profile", renderProfile);
register("settings", renderSettings);

setNotFound(renderHome);

mountNav();
startRouter();

// Mises à jour (OTA silencieux + bandeau natif) — sans effet sur le web.
initUpdateCheck();
