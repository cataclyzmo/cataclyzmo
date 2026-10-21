document.querySelectorAll('[data-team-roster]').forEach((card) => {
  const members = window.teamRosters?.[card.dataset.teamRoster];
  if (!members?.length) return;

  const nameElement = card.querySelector('#characterName');
  const portrait = card.querySelector('#characterImage');
  const position = card.querySelector('#characterPosition');
  const readings = card.querySelector('.scanner-readings');
  const legend = card.querySelector('.stats-legend');
  const physicalTable = card.querySelector('[data-traits="physical"]');
  const personalTable = card.querySelector('[data-traits="personal"]');
  const detailSection = card.querySelector('.team-member-details');
  const detailTable = card.querySelector('[data-traits="details"]');
  const profileLink = card.querySelector('.team-member-profile');
  const statNames = ['Durability', 'Energy', 'Intelligence', 'Psionics', 'Speed', 'Strength'];
  const physicalNames = ['Race', 'Height', 'Weight', 'Gender', 'Hair', 'Eyes', 'Age'];
  const personalNames = ['Secret Identity', 'Power Class', 'Threat Level', 'Aliases', 'Affiliations', 'Education', 'Employment', 'Planet'];
  let currentIndex = 0;
  let showPotential = true;

  function renderTable(table, rows) {
    table.replaceChildren(...rows.map(([label, value]) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = label;
      const cell = document.createElement('td');
      cell.textContent = value || 'Not documented';
      row.append(heading, cell);
      return row;
    }));
  }

  function renderStat(name, rating, base, value) {
    const stat = document.createElement('div');
    stat.className = 'scanner-stat';
    const heading = document.createElement('div');
    heading.className = 'scanner-stat-heading';
    const link = document.createElement('a');
    link.href = `../power-index.html#${name.toLowerCase()}`;
    link.textContent = name;
    const ratingElement = document.createElement('span');
    ratingElement.className = 'stat-rating';
    ratingElement.textContent = rating;
    heading.append(link, ratingElement);
    stat.append(heading);
    if (value !== null) {
      const meter = document.createElement('div');
      meter.className = 'scanner-meter';
      meter.setAttribute('role', 'meter');
      meter.setAttribute('aria-label', name);
      meter.setAttribute('aria-valuemin', '0');
      meter.setAttribute('aria-valuemax', '10');
      meter.setAttribute('aria-valuenow', String(value));
      meter.style.setProperty('--base', `${base * 10}%`);
      meter.style.setProperty('--equipped', `${value * 10}%`);
      const fill = document.createElement('span');
      fill.className = 'scanner-fill';
      fill.setAttribute('aria-hidden', 'true');
      meter.append(fill);
      stat.append(meter);
    }
    readings.append(stat);
  }

  function render() {
    const member = members[currentIndex];
    const facts = member.facts || {};
    const portraitImage = showPotential && member.equipmentImage || member.image;
    nameElement.textContent = `${card.dataset.teamName} - ${member.name}`;
    portrait.src = portraitImage;
    portrait.alt = `${member.name} character portrait`;
    position.textContent = `${currentIndex + 1} / ${members.length}`;
    profileLink.hidden = !member.profile;
    if (member.profile) profileLink.href = member.profile;
    readings.replaceChildren();
    legend.replaceChildren();

    const hasBoost = member.stats?.some(([base, potential]) => base !== potential);
    if (hasBoost) {
      const label = document.createElement('label');
      label.className = 'stats-toggle';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = showPotential;
      checkbox.addEventListener('change', () => {
        showPotential = checkbox.checked;
        render();
        legend.querySelector('input').focus();
      });
      label.append(checkbox, ' Max Potential');
      legend.append(label);
    }

    statNames.forEach((name, index) => {
      const stat = member.stats?.[index];
      if (!stat) {
        renderStat(name, 'Not documented', null, null);
        return;
      }
      const [base, potential, baseLabel, potentialLabel] = stat;
      const boosted = base !== potential && showPotential;
      renderStat(name, boosted
        ? `${base} → ${potential}/10 · ${potentialLabel}`
        : `${base}/10${baseLabel ? ` · ${baseLabel}` : ''}`,
      base, boosted ? potential : base);
    });

    if (member.stats) {
      const key = document.createElement('span');
      key.innerHTML = '<i class="stat-key stat-key-base" aria-hidden="true"></i> Base rating';
      legend.append(key);
      if (hasBoost && showPotential) {
        const boostKey = document.createElement('span');
        boostKey.innerHTML = '<i class="stat-key stat-key-boost" aria-hidden="true"></i> Max Potential';
        legend.append(boostKey);
      }
    }
    const note = document.createElement('p');
    note.textContent = member.note || (member.stats
      ? 'Ratings out of 10. Select a stat for its definition.'
      : `${member.name}'s power ratings have not been documented yet.`);
    legend.append(note);

    renderTable(physicalTable, physicalNames.map((name) => [name, facts[name]]));
    renderTable(personalTable, personalNames.map((name) => [name, facts[name] || (name === 'Affiliations' ? facts.Affiliation : '') || (name === 'Planet' ? facts.Homeworld : '')]));
    const otherFacts = Object.entries(facts).filter(([name, value]) => value && !physicalNames.includes(name) && !personalNames.includes(name) && name !== 'Affiliation' && name !== 'Homeworld');
    detailSection.hidden = !otherFacts.length;
    renderTable(detailTable, otherFacts);
  }

  function changeCharacter(direction) {
    currentIndex = (currentIndex + direction + members.length) % members.length;
    render();
  }

  card.querySelector('#previousCharacter').addEventListener('click', () => changeCharacter(-1));
  card.querySelector('#nextCharacter').addEventListener('click', () => changeCharacter(1));
  portrait.addEventListener('click', () => changeCharacter(1));
  render();
});
