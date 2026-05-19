/**
 * QualifyChat — embed loader.
 * Usage:
 * <script src="https://YOUR_DOMAIN/embed.js" data-business-id="UUID" async defer></script>
 */
(function () {
  var script = document.currentScript;
  if (!script || !script.src) return;

  var businessId = script.getAttribute("data-business-id");
  if (!businessId) {
    console.warn("[QualifyChat] Missing data-business-id on embed script.");
    return;
  }

  var root = new URL(script.src).origin;
  var iframeSrc =
    root + "/chatbot/" + encodeURIComponent(businessId) + "?embed=1";

  // Inject keyframes once
  if (!document.getElementById("cf-embed-styles")) {
    var style = document.createElement("style");
    style.id = "cf-embed-styles";
    style.textContent =
      "@keyframes cfPulse{0%{box-shadow:0 0 0 0 rgba(99,102,241,.55)}70%{box-shadow:0 0 0 14px rgba(99,102,241,0)}100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}}" +
      "@keyframes cfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}" +
      ".cf-launcher{transition:transform .25s ease,box-shadow .25s ease}" +
      ".cf-launcher:hover{transform:translateY(-2px) scale(1.04)}" +
      ".cf-launcher:active{transform:scale(.98)}" +
      ".cf-panel{transform-origin:bottom right;transition:opacity .2s ease, transform .25s cubic-bezier(.22,1,.36,1)}" +
      ".cf-panel.cf-closed{opacity:0;transform:translateY(12px) scale(.96);pointer-events:none}";
    document.head.appendChild(style);
  }

  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "cf-launcher";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.style.cssText = [
    "position:fixed",
    "z-index:2147483000",
    "right:20px",
    "bottom:20px",
    "width:60px",
    "height:60px",
    "border-radius:9999px",
    "border:none",
    "cursor:pointer",
    "color:#fff",
    "background:linear-gradient(135deg,#6366f1,#8b5cf6)",
    "box-shadow:0 10px 30px rgba(99,102,241,.35),0 4px 10px rgba(15,23,42,.15)",
    "animation:cfPulse 2.2s cubic-bezier(.66,0,.34,1) infinite",
    "display:flex",
    "align-items:center",
    "justify-content:center",
  ].join(";");

  launcher.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v8c0 1.38-1.12 2.5-2.5 2.5H13l-4 3v-3H6.5C5.12 17 4 15.88 4 14.5v-8Z" fill="currentColor"/>' +
    '<circle cx="9" cy="10.5" r="1.2" fill="#6366f1"/>' +
    '<circle cx="12.5" cy="10.5" r="1.2" fill="#6366f1"/>' +
    '<circle cx="16" cy="10.5" r="1.2" fill="#6366f1"/>' +
    "</svg>";

  var panel = document.createElement("div");
  panel.className = "cf-panel cf-closed";
  panel.style.cssText = [
    "position:fixed",
    "z-index:2147483001",
    "right:20px",
    "bottom:92px",
    "width:min(400px,calc(100vw - 32px))",
    "height:min(620px,calc(100vh - 120px))",
    "border-radius:20px",
    "overflow:hidden",
    "box-shadow:0 24px 60px rgba(15,23,42,.25),0 8px 20px rgba(15,23,42,.1)",
    "background:#fff",
  ].join(";");

  var iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  iframe.title = "QualifyChat";
  iframe.style.cssText = "border:0;width:100%;height:100%;background:transparent;";
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("allow", "clipboard-write");

  panel.appendChild(iframe);

  var open = false;
  function toggle() {
    open = !open;
    panel.classList.toggle("cf-closed", !open);
    launcher.style.animation = open ? "none" : "cfPulse 2.2s cubic-bezier(.66,0,.34,1) infinite";
    launcher.setAttribute("aria-expanded", open ? "true" : "false");
  }

  launcher.addEventListener("click", toggle);

  document.body.appendChild(launcher);
  document.body.appendChild(panel);
})();
