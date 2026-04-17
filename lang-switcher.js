(function () {
  var LOCALES = {
    PT: "",
    EN: "/en",
    ES: "/es",
  };

  function getCleanPath() {
    var path = window.location.pathname;
    // Remove existing locale prefix (/en or /es)
    path = path.replace(/^\/(en|es)(\/|$)/, "/");
    if (!path.startsWith("/")) path = "/" + path;
    // Remove trailing slash except for root
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    return path;
  }

  function handleLangClick(e) {
    var linkText = this.textContent.trim().toUpperCase();
    if (linkText in LOCALES) {
      e.preventDefault();
      e.stopPropagation();
      var cleanPath = getCleanPath();
      var prefix = LOCALES[linkText];
      var newPath = prefix + cleanPath;
      if (!newPath) newPath = "/";
      // Preserve query string and hash
      newPath += window.location.search + window.location.hash;
      // Only navigate if different from current
      if (window.location.pathname !== prefix + cleanPath) {
        window.location.href = newPath;
      }
    }
  }

  function attachListeners() {
    var links = document.querySelectorAll("#navbar a");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var text = link.textContent.trim().toUpperCase();
      if (text in LOCALES && !link.getAttribute("data-lang-switcher")) {
        link.setAttribute("data-lang-switcher", "true");
        link.addEventListener("click", handleLangClick);
      }
    }
  }

  // Debounced MutationObserver to handle SPA re-renders
  var timeout;
  var observer = new MutationObserver(function () {
    clearTimeout(timeout);
    timeout = setTimeout(attachListeners, 150);
  });

  if (document.body) {
    attachListeners();
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      attachListeners();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
