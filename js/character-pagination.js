(() => {
  const cards = [...document.querySelectorAll('.catalog-page main > .character')];
  const pagination = document.querySelector('.character-pagination');
  const pageSize = 8;

  if (!pagination || cards.length <= pageSize) return;

  const pageCount = Math.ceil(cards.length / pageSize);
  const requestedPage = Number(new URLSearchParams(window.location.search).get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage >= 1 && requestedPage <= pageCount
    ? requestedPage
    : 1;
  const first = (page - 1) * pageSize;
  const last = Math.min(first + pageSize, cards.length);

  cards.forEach((card, index) => {
    card.hidden = index < first || index >= last;
  });

  pagination.querySelector('.pagination-status').textContent =
    `Showing ${first + 1}–${last} of ${cards.length} characters · Page ${page} of ${pageCount}`;

  const links = pagination.querySelector('.pagination-links');
  const addLink = (label, number, accessibleLabel = label) => {
    const link = document.createElement('a');
    link.className = 'pagination-link';
    link.href = number === 1 ? 'characters.html' : `characters.html?page=${number}`;
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

  pagination.hidden = false;
})();
