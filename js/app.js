/**
 * Culture G Daily — point d'entrée.
 * Enregistre les routes, monte la navigation et démarre le router.
 */

import { register, setNotFound, startRouter } from "./router.js";
import { mountNav } from "./components/nav.js";

import { renderHome } from "./pages/home.js";
import { renderLesson } from "./pages/lesson.js";
import { renderQuiz } from "./pages/quiz.js";
import { renderLibrary } from "./pages/library.js";
import { renderProfile } from "./pages/profile.js";

register("home", renderHome);
register("lesson", renderLesson);
register("quiz", renderQuiz);
register("library", renderLibrary);
register("profile", renderProfile);

setNotFound(renderHome);

mountNav();
startRouter();
