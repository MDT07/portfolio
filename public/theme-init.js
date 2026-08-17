/** Anti-FOUC theme initialization: runs before first paint. */
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") t = "light";
    document.documentElement.dataset.theme = t;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
