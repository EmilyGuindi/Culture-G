import { aiConfig, AI_MODELS } from "../ai/generator.js";
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
      <h1>Leçons par IA</h1>
      <p>Branche une clé API Claude pour générer des leçons à l'infini, sur tous les thèmes.</p>
    </header>

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

    <div class="callout stylé" style="margin-top:18px;">
      <div class="callout-title">💡 Bon à savoir</div>
      <p>La génération par IA fonctionne sur la version <strong>déployée</strong> (GitHub Pages) ou en local.
      Dans l'aperçu « artifact », les appels réseau externes sont bloqués : les 50 leçons intégrées restent, mais la génération est indisponible.</p>
    </div>
  `;

  el.querySelector("#back").addEventListener("click", () => history.back());

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
