(() => {
  'use strict';

  const characters = window.compareCharacters || [];
  const names = ['Durability', 'Energy', 'Intelligence', 'Psionics', 'Speed', 'Strength'];
  const physical = ['Race', 'Height', 'Weight', 'Gender', 'Hair', 'Eyes', 'Age'];
  const personal = ['Secret Identity', 'Power Class', 'Threat Level', 'Aliases', 'Affiliations', 'Education', 'Employment', 'Planet'];
  const selects = [document.getElementById('select-one'), document.getElementById('select-two')];
  const displays = [document.getElementById('display-one'), document.getElementById('display-two')];

  characters.forEach((character, index) => {
    selects.forEach(select => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = character.name;
      select.append(option);
    });
  });

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function statRow(name, stat) {
    const row = element('div', 'compare-stat');
    const heading = element('div', 'compare-stat-heading');
    const link = element('a', '', name);
    link.href = `power-index.html#${name.toLowerCase()}`;
    heading.append(link);
    if (!stat) {
      heading.append(element('span', 'compare-stat-value', 'Not documented'));
      row.append(heading);
      return row;
    }
    const [base, potential, baseLabel, potentialLabel] = stat;
    heading.append(element('span', 'compare-stat-value', `${base}/10${baseLabel ? ` · ${baseLabel}` : ''}`));
    row.append(heading);
    if (potential !== base) {
      row.append(element('p', 'compare-potential', `Max potential: ${potential}/10${potentialLabel ? ` · ${potentialLabel}` : ''}`));
    }
    const meter = element('div', 'compare-meter');
    meter.setAttribute('role', 'meter');
    meter.setAttribute('aria-label', name);
    meter.setAttribute('aria-valuemin', '0');
    meter.setAttribute('aria-valuemax', '10');
    meter.setAttribute('aria-valuenow', String(base));
    meter.append(element('span', 'compare-meter-base'), element('span', 'compare-meter-potential'));
    meter.children[0].style.width = `${base * 10}%`;
    meter.children[1].style.left = `${base * 10}%`;
    meter.children[1].style.width = `${Math.max(0, potential - base) * 10}%`;
    row.append(meter);
    return row;
  }

  function factsSection(title, rows) {
    const section = element('section', 'compare-facts');
    section.append(element('h3', '', title));
    const table = document.createElement('table');
    const body = document.createElement('tbody');
    rows.forEach(([label, value]) => {
      const row = document.createElement('tr');
      const heading = element('th', '', label);
      heading.scope = 'row';
      row.append(heading, element('td', '', value || 'Not documented'));
      body.append(row);
    });
    table.append(body);
    section.append(table);
    return section;
  }

  function render(index) {
    const display = displays[index];
    const selection = selects[index].value;
    display.replaceChildren();
    if (selection === '') {
      display.append(element('p', 'compare-placeholder', 'Choose a character to view their dossier.'));
      return;
    }
    const character = characters[Number(selection)];
    if (!character) return;
    const portrait = element('img', 'compare-portrait');
    portrait.src = character.image;
    portrait.alt = `${character.name} portrait`;
    const heading = element('div', 'compare-card-heading');
    heading.append(element('h2', '', character.name));
    const profile = element('a', '', 'View character profile ↗');
    profile.href = character.profile;
    heading.append(profile);
    const dossier = element('section', 'compare-dossier');
    dossier.append(element('h3', '', 'Power dossier'));
    names.forEach((name, statIndex) => dossier.append(statRow(name, character.stats?.[statIndex])));
    const facts = character.facts || {};
    const physicalRows = physical.map(name => [name, facts[name]]);
    const personalRows = personal.map(name => [name, facts[name] || (name === 'Affiliations' ? facts.Affiliation : '') || (name === 'Planet' ? facts.Homeworld : '')]);
    const known = new Set([...physical, ...personal, 'Affiliation', 'Homeworld']);
    const extraRows = Object.entries(facts).filter(([name, value]) => value && !known.has(name));
    display.append(portrait, heading, dossier, factsSection('Physical', physicalRows), factsSection('Personal', personalRows));
    if (extraRows.length) display.append(factsSection('Known details', extraRows));
  }

  function update() {
    render(0);
    render(1);
    const url = new URL(window.location.href);
    selects.forEach((select, index) => {
      const key = index === 0 ? 'a' : 'b';
      if (select.value) url.searchParams.set(key, select.value);
      else url.searchParams.delete(key);
    });
    window.history.replaceState(null, '', url);
  }

  const params = new URLSearchParams(window.location.search);
  selects.forEach((select, index) => {
    const value = params.get(index === 0 ? 'a' : 'b');
    if (value !== null && /^\d+$/.test(value) && Number(value) < characters.length) {
      select.value = String(Number(value));
    }
    select.addEventListener('change', update);
  });
  update();
})();
