(function() {
  try {
    var stored = localStorage.getItem('theme');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = stored || system;
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  btn.textContent = current === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
  btn.setAttribute('aria-label', 'Switch to ' + (current === 'light' ? 'dark' : 'light') + ' mode');
  btn.addEventListener('click', function() {
    current = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
    btn.textContent = current === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
    btn.setAttribute('aria-label', 'Switch to ' + (current === 'light' ? 'dark' : 'light') + ' mode');
  });
});
