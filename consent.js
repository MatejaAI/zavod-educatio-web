/* Soglasje za piškotke + Microsoft Clarity (naloži se šele po sprejetju) */
(function () {
  const KEY = "zavod-consent";
  const CLARITY_ID = "yofr3vt81e";
  let loaded = false;

  const read = () => {
    try {
      return localStorage.getItem(KEY);
    } catch (err) {
      return null;
    }
  };
  const save = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch (err) {
      /* brez shranjevanja */
    }
  };
  const t = (text) => (window.I18N ? window.I18N.t(text) : text);

  function loadClarity() {
    if (loaded) return;
    loaded = true;
    (function (c, l, a, r, i, s, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      s = l.createElement(r);
      s.async = 1;
      s.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(s, y);
    })(window, document, "clarity", "script", CLARITY_ID);
    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "granted",
    });
  }

  function stopClarity() {
    if (window.clarity) window.clarity("consent", false);
  }

  const style = document.createElement("style");
  style.textContent = `
    .cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:520px;margin-left:auto;padding:20px 22px;border-radius:20px;background:#111b36;color:#f8fbff;border:1px solid rgba(222,230,255,.2);box-shadow:0 20px 50px rgba(0,0,0,.45);font-size:.9rem;line-height:1.55}
    .cookie-banner[hidden]{display:none}
    .cookie-banner h2{margin:0 0 6px;font-size:1.05rem;font-weight:800;letter-spacing:0!important;line-height:1.3!important;color:inherit}
    .cookie-banner p{margin:0 0 14px;color:#c8d3ed}
    .cookie-actions{display:flex;gap:10px;flex-wrap:wrap}
    .cookie-actions button{flex:1 1 140px;padding:11px 16px;border-radius:12px;border:1px solid rgba(222,230,255,.3);background:transparent;color:inherit;font:inherit;font-weight:800;cursor:pointer}
    .cookie-actions button[data-consent="granted"]{background:#c9ff4a;color:#091225;border-color:#c9ff4a}
    .cookie-actions button:focus-visible{outline:3px solid #ffd858;outline-offset:2px}
    html[data-theme="light"] .cookie-banner{background:#fff;color:#101a34;border-color:rgba(16,26,52,.18);box-shadow:0 20px 50px rgba(16,26,52,.2)}
    html[data-theme="light"] .cookie-banner p{color:#4a5878}
    html[data-theme="light"] .cookie-actions button{border-color:rgba(16,26,52,.3)}
    @media(max-width:560px){.cookie-banner{left:10px;right:10px;bottom:10px}}`;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.id = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.setAttribute("aria-labelledby", "cookie-title");
  banner.hidden = true;
  document.body.appendChild(banner);

  function render() {
    banner.innerHTML =
      '<h2 id="cookie-title"></h2><p></p><div class="cookie-actions">' +
      '<button type="button" data-consent="granted"></button>' +
      '<button type="button" data-consent="denied"></button></div>';
    banner.querySelector("h2").textContent = t("Piškotki in analitika");
    banner.querySelector("p").textContent = t(
      "Za boljšo stran uporabljamo orodje Microsoft Clarity, ki z vašim soglasjem uporablja piškotke in beleži, kako uporabljate stran (klike, drsenje). Brez soglasja analitike ne vključimo.",
    );
    banner.querySelector('[data-consent="granted"]').textContent =
      t("Sprejmem");
    banner.querySelector('[data-consent="denied"]').textContent = t("Zavrni");
  }

  function show() {
    render();
    banner.hidden = false;
    banner.querySelector("button").focus({ preventScroll: true });
  }
  function hide() {
    banner.hidden = true;
  }

  banner.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-consent]");
    if (!btn) return;
    const choice = btn.dataset.consent;
    const previous = read();
    save(choice);
    if (choice === "granted") loadClarity();
    else if (previous === "granted") stopClarity();
    hide();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-cookie-settings]");
    if (link) {
      event.preventDefault();
      show();
    }
  });
  document.addEventListener("langchange", () => {
    if (!banner.hidden) render();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !banner.hidden && read()) hide();
  });

  const state = read();
  if (state === "granted") loadClarity();
  else if (state === null) show();
})();
