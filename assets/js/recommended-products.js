(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var filter = document.querySelector('.recommended-filter');
    var cards = Array.from(document.querySelectorAll('[data-recommendation-card]'));
    var buttons = Array.from(document.querySelectorAll('[data-category-filter]'));
    var search = document.getElementById('product-search');
    var clear = document.getElementById('clear-product-search');
    var status = document.getElementById('filter-status');
    var empty = document.getElementById('no-filter-results');
    var activeCategory = 'all';

    if (!filter || !cards.length || !buttons.length || !search || !clear || !status || !empty) return;

    function normalized(value) {
      return String(value || '').trim().toLocaleLowerCase();
    }

    function applyFilters() {
      var query = normalized(search.value);
      var visible = 0;

      cards.forEach(function(card) {
        var categories = normalized(card.getAttribute('data-categories')).split(/\s+/);
        var matchesCategory = activeCategory === 'all' || categories.indexOf(activeCategory) !== -1;
        var matchesQuery = !query || normalized(card.textContent).includes(query);
        var show = matchesCategory && matchesQuery;
        card.hidden = !show;
        if (show) visible += 1;
      });

      empty.hidden = visible !== 0;
      status.textContent = visible === cards.length && activeCategory === 'all' && !query
        ? 'Showing all ' + cards.length + ' options.'
        : 'Showing ' + visible + ' of ' + cards.length + ' options.';
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        activeCategory = button.getAttribute('data-category-filter') || 'all';
        buttons.forEach(function(candidate) {
          var selected = candidate === button;
          candidate.classList.toggle('active', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        applyFilters();
      });
    });

    search.addEventListener('input', applyFilters);
    clear.addEventListener('click', function() {
      search.value = '';
      activeCategory = 'all';
      buttons.forEach(function(button) {
        var selected = button.getAttribute('data-category-filter') === 'all';
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      applyFilters();
      search.focus();
    });

    filter.hidden = false;
    applyFilters();
  });
})();
