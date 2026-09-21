import { aiConfig, AI_MODELS } from "../ai/generator.js";
import { photosConfig, clearPhotoCache } from "../data/photos.js";
import { store } from "../store.js";
import { navigate } from "../router.js";

export async function renderSettings() {
  const el = document.createElement("div");
  el.className = "stagger";

  const enabled = aiConfig.isEnabled();
  const model = aiConfig.getModel();

  el.innerHTML = `
    <button class="btn btn-ghost" id="back">← Retour</button>

    <header class="page-head">
      <span class="eyebrow">Réglages</span>
      <h1>Réglages</h1>
    </header>

    <section class="card">
      <label class="form-label" for="name">Ton prénom</label>
      <div style="display:flex;gap:10px;">
        <input class="input" id="name" type="text" autocomplete="off" spellcheck="false"
          placeholder="Ton prénom" value="${store.name}" />
        <button class="btn btn-navy small" id="save-name" style="flex:none;">OK</button>
      </div>
      <p class="muted" style="font-size:.8rem;margin-top:6px;">Utilisé pour te saluer sur l'accueil et ton profil.</p>
    </section>

    <h3 class="section-title">Leçons par IA</h3>
    <section class="card stack">
      <div>
        <label class="form-label" for="key">Clé API Anthropic</label>
        <input class="input" id="key" type="password" autocomplete="off" spellcheck="false"
          placeholder="sk-ant-..." value="${enabled ? "••••••••••••••••" : ""}" />
        <p class="muted" style="font-size:.8rem;margin-top:6px;">
          Obtiens une clé sur <strong>console.anthropic.com</strong> → API Keys.
          Elle est stockée uniquement dans ce navigateur (usage personnel).
        </p>
      </div>

      <div>
        <label class="form-label" for="model">Modèle</label>
        <select class="input" id="model">
          ${AI_MODELS.map(
            (m) => `<option value="${m.id}" ${m.id === model ? "selected" : ""}>${m.label}</option>`
          ).join("")}
        </select>
      </div>

      <div id="status" class="ai-status ${enabled ? "on" : "off"}">
        ${enabled ? "✅ IA activée" : "⚪️ IA non configurée"}
      </div>

      <div class="btn-row">
        <button class="btn btn-primary" id="save">Enregistrer</button>
        ${enabled ? `<button class="btn btn-outline" id="clear">Supprimer la clé</button>` : ""}
      </div>
    </section>

    <h3 class="section-title">Visuels des leçons</h3>
    <section class="card">
      <div class="toggle-row">
        <div class="toggle-txt">
          <strong>Photos réelles</strong>
          <span class="muted">Illustre chaque leçon avec une image de Wikipédia (nécessite internet). Sinon, jolie couverture générée, hors-ligne.</span>
        </div>
        <button class="switch ${photosConfig.isEnabled() ? "on" : ""}" id="photos" role="switch" aria-checked="${photosConfig.isEnabled()}" aria-label="Photos réelles">
          <span class="knob"></span>
        </button>
      </div>
    </section>

    <div class="callout stylé" style="margin-top:18px;">
      <div class="callout-title">💡 Bon à savoir</div>
      <p>La génération par IA nécessite ta propre clé Anthropic (appels facturés à l'usage).
      Les 50 leçons intégrées et leurs couvertures fonctionnent sans clé et hors-ligne.</p>
    </div>
  `;

  el.querySelector("#back").addEventListener("click", () => history.back());

  const saveName = () => {
    store.setName(el.querySelector("#name").value);
    const b = el.querySelector("#save-name");
    b.textContent = "✓";
    setTimeout(() => (b.textContent = "OK"), 1000);
  };
  el.querySelector("#save-name").addEventListener("click", saveName);
  el.querySelector("#name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveName();
  });

  const photosBtn = el.querySelector("#photos");
  photosBtn.addEventListener("click", () => {
    const next = !photosConfig.isEnabled();
    photosConfig.setEnabled(next);
    if (!next) clearPhotoCache();
    photosBtn.classList.toggle("on", next);
    photosBtn.setAttribute("aria-checked", String(next));
  });

  el.querySelector("#save").addEventListener("click", () => {
    const raw = el.querySelector("#key").value.trim();
    aiConfig.setModel(el.querySelector("#model").value);
    // ne réécrit la clé que si l'utilisateur a saisi autre chose que le masque
    if (raw && !/^•+$/.test(raw)) aiConfig.setKey(raw);
    const status = el.querySelector("#status");
    if (aiConfig.isEnabled()) {
      status.className = "ai-status on";
      status.textContent = "✅ IA activée — enregistré";
    }
    setTimeout(() => navigate("library"), 600);
  });

  const clearBtn = el.querySelector("#clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      aiConfig.clearKey();
      navigate("settings");
    });
  }

  return el;
}
