/**
 * Photos réelles (option) — illustration des leçons via Wikipédia.
 *
 * Source : API MediaWiki (fr.wikipedia.org), gratuite, sans clé, CORS ouverte
 * (origin=*). On récupère l'image principale de l'article le plus proche du
 * titre de la leçon. Les URLs trouvées sont mises en cache dans le
 * localStorage (par leçon) pour éviter de re-questionner à chaque ouverture.
 *
 * Option DÉSACTIVÉE par défaut : nécessite le réseau. Quand elle est off, ou
 * hors-ligne, ou sans résultat, l'app garde sa couverture générée (offline).
 */

const KEY_ENABLED = "culture-g-photos:enabled";
const CACHE_PREFIX = "culture-g-photo:"; // + lesson.id -> url | "none"

export const photosConfig = {
  isEnabled: () => localStorage.getItem(KEY_ENABLED) === "1",
  setEnabled: (v) => {
    if (v) localStorage.setItem(KEY_ENABLED, "1");
    else localStorage.removeItem(KEY_ENABLED);
  },
};

function cacheGet(id) {
  try {
    return localStorage.getItem(CACHE_PREFIX + id);
  } catch (_) {
    return null;
  }
}
function cacheSet(id, val) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, val);
  } catch (_) {}
}

/** Vide le cache des photos (utile si on désactive l'option). */
export function clearPhotoCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
}

/**
 * Renvoie l'URL d'une photo pour la leçon, ou null si indisponible.
 * @param {object} lesson
 * @returns {Promise<string|null>}
 */
export async function getLessonPhoto(lesson) {
  if (!photosConfig.isEnabled() || !lesson) return null;

  const cached = cacheGet(lesson.id);
  if (cached) return cached === "none" ? null : cached;

  const query = lesson.photoQuery || lesson.title;
  const url =
    "https://fr.wikipedia.org/w/api.php?action=query&format=json" +
    "&generator=search&gsrlimit=1&gsrnamespace=0" +
    "&prop=pageimages&piprop=thumbnail&pithumbsize=1000" +
    "&gsrsearch=" +
    encodeURIComponent(query) +
    "&origin=*";

  try {
    const res = await fetch(url, { cache: "force-cache" });
    const data = await res.json();
    const pages = (data && data.query && data.query.pages) || {};
    const first = Object.values(pages)[0];
    const src = (first && first.thumbnail && first.thumbnail.source) || null;
    cacheSet(lesson.id, src || "none");
    return src;
  } catch (_) {
    return null; // hors-ligne / bloqué : on garde la couverture générée
  }
}
