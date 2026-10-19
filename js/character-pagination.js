(() => {
  const cards = [...document.querySelectorAll('.catalog-page main > .character')];
  const pagination = document.querySelector('.character-pagination');
  const search = document.querySelector('#character-search-input');
  const noResults = document.querySelector('.character-no-results');
  const pageSize = 9;

  if (!pagination || !search || !noResults) return;

  search.value = new URLSearchParams(window.location.search).get('q') || '';

  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const matches = cards.filter(card => {
      const name = card.querySelector('h2').textContent;
      const fullName = card.querySelector('img').alt;
      return `${name} ${fullName}`.toLocaleLowerCase().includes(query);
    });
    const pageCount = Math.ceil(matches.length / pageSize);
    const requestedPage = Number(new URLSearchParams(window.location.search).get('page'));
    const page = Number.isSafeInteger(requestedPage) && requestedPage >= 1 && requestedPage <= pageCount
      ? requestedPage
      : 1;
    const first = (page - 1) * pageSize;
    const last = Math.min(first + pageSize, matches.length);
    const visible = new Set(matches.slice(first, last));

    cards.forEach(card => { card.hidden = !visible.has(card); });
    noResults.hidden = matches.length !== 0;
    pagination.hidden = matches.length === 0;

    const noun = query ? 'matching characters' : 'characters';
    pagination.querySelector('.pagination-status').textContent =
      `Showing ${first + 1}–${last} of ${matches.length} ${noun} · Page ${page} of ${pageCount}`;

    const links = pagination.querySelector('.pagination-links');
    links.replaceChildren();
    const addLink = (label, number, accessibleLabel = label) => {
      const link = document.createElement('a');
      const url = new URL(window.location.href);
      if (number === 1) url.searchParams.delete('page');
      else url.searchParams.set('page', number);
      link.className = 'pagination-link';
      link.href = url.pathname + url.search;
      link.textContent = label;
      link.setAttribute('aria-label', accessibleLabel);
      links.append(link);
    };

    if (page > 1) addLink('Previous', page - 1, 'Previous character page');

    for (let number = 1; number <= pageCount; number += 1) {
      if (number === page) {
        const current = document.createElement('span');
        current.className = 'pagination-link';
        current.textContent = number;
        current.setAttribute('aria-current', 'page');
        current.setAttribute('aria-label', `Page ${number}`);
        links.append(current);
      } else {
        addLink(String(number), number, `Page ${number}`);
      }
    }

    if (page < pageCount) addLink('Next', page + 1, 'Next character page');
  };

  search.addEventListener('input', () => {
    const url = new URL(window.location.href);
    const query = search.value.trim();
    url.searchParams.delete('page');
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
    render();
  });

  render();
})();
