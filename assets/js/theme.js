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
  if (btn) {
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
  }

  var resultCards = document.querySelectorAll('.results-card');
  if (!resultCards.length) return;

  var printStyles = document.createElement('link');
  printStyles.rel = 'stylesheet';
  printStyles.href = '/assets/css/print-results.css';
  document.head.appendChild(printStyles);

  resultCards.forEach(function(card) {
    card.setAttribute('data-printable-results', '');
    if (card.querySelector('.print-results-button')) return;

    var printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.className = 'print-results-button';
    printButton.textContent = 'Print Results';
    printButton.title = 'Print these results or save them as a PDF';
    printButton.addEventListener('click', function() {
      window.print();
    });
    card.appendChild(printButton);
  });
});
