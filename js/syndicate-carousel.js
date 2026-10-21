// Ratings and facts follow the individual character profiles. Pyro II's ratings
// are approximate, as described in the team's Powers & Abilities section.
const members = [
  {
    name: 'Nemesis', image: '../images/nemesis-design.png',
    stats: [[6, 7, 'Enhanced', 'Nuclear'], [6, 7, 'Dynamo', 'Nuclear'], [8, 8, 'Super Genius'], [5, 6, 'Vehicular', 'Titanic'], [5, 5, 'Subsonic'], [6, 6, 'Enhanced']],
    physical: ['Centurion', "6'", '250lbs', 'Male', 'Black', 'Yellow', 'Unknown'],
    personal: ['Unknown', 'Tech & Meta', '7.5', 'The Evolutionary', 'The Syndicate', 'Multiple STEM PhDs', 'Terraformer', 'Namako']
  },
  {
    name: 'Quick Draw', image: '../images/quickdraw-design.png',
    stats: null, note: "Quick Draw's power ratings have not been documented yet.",
    physical: Array(7).fill('Unknown'),
    personal: ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'The Syndicate', 'Unknown', 'Unknown', 'Unknown']
  },
  {
    name: 'Vex Krueger', image: '../images/vexkrueger-design.png',
    stats: [[4, 4, 'Apex'], [3, 3, 'Gunslinger'], [3, 3, 'Smart'], [1, 1, 'Enabled'], [4, 10, 'Apex', 'Lightspeed+'], [4, 4, 'Strongman']],
    physical: ['Human', "5'11''", '180lbs', 'Male', 'Black', 'Red', '28'],
    personal: ['Vex Krueger', 'Meta', '5.1', 'The Living Shadow', 'The Survivors / The Syndicate', 'High School', 'Mechanic', 'Merth']
  },
  {
    name: 'Pyro II', image: '../images/pyromaniac-design.png',
    alt: 'Pyromaniac illustration used as a visual reference for Pyro II',
    stats: [[6, 6, 'Enhanced'], [6, 6, 'Dynamo'], [4, 4, 'Exceptional'], [1, 1, 'Enabled'], [4, 4, 'Apex'], [5, 5, 'Apex']],
    note: "Approximate ratings based on Pyromaniac, whose abilities Pyro II resembles. Pyro II's identity and physical details are unknown.",
    physical: ['Unknown', 'Unknown', 'Unknown', 'Male', 'Unknown', 'Unknown', 'Unknown'],
    personal: ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'The Syndicate', 'Unknown', 'Unknown', 'Unknown']
  },
  {
    name: 'Tiger Hide', image: '../images/tigerhide-design.png',
    stats: [[5, 7, 'Bulletproof', 'Nuclear'], [4, 7, 'Rocketeer', 'Nuclear'], [3, 4, 'Smart', 'Exceptional'], [0, 3, 'None', 'Puppet Master'], [4, 5, 'Apex', 'Subsonic'], [5, 6, 'Apex', 'Enhanced']],
    physical: ['Human (cursed)', "9'2''", '800lbs', 'Male', 'orange & black', 'Amber', '52'],
    personal: ['Zangief Draco', 'Magic', '4.2 - 5.7', 'Sabre', 'The Syndicate', 'Home Schooled', 'Hunter', 'Genova']
  }
];

const statNames = ['Durability', 'Energy', 'Intelligence', 'Psionics', 'Speed', 'Strength'];
const physicalNames = ['Race', 'Height', 'Weight', 'Gender', 'Hair', 'Eyes', 'Age'];
const personalNames = ['Secret Identity', 'Power Class', 'Threat Level', 'Aliases', 'Affiliations', 'Education', 'Employment', 'Planet'];
const nameElement = document.getElementById('characterName');
const portrait = document.getElementById('characterImage');
const scanner = document.querySelector('.power-scanner');
const readings = scanner.querySelector('.scanner-readings');
const legend = scanner.querySelector('.stats-legend');
const tables = document.querySelectorAll('aside .traits');
let currentIndex = 0;
let showPotential = true;

function renderTable(table, labels, values) {
  table.replaceChildren(...labels.map((label, index) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th');
    heading.scope = 'row';
    heading.textContent = label;
    const value = document.createElement('td');
    value.textContent = values[index];
    row.append(heading, value);
    return row;
  }));
}

function render() {
  const member = members[currentIndex];
  nameElement.textContent = `Syndicate - ${member.name}`;
  portrait.src = member.image;
  portrait.alt = member.alt || `${member.name} character portrait`;
  document.getElementById('characterPosition').textContent = `${currentIndex + 1} / ${members.length}`;
  readings.replaceChildren();
  legend.replaceChildren();

  if (member.stats) {
    const hasBoost = member.stats.some(([base, potential]) => base !== potential);
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

    member.stats.forEach(([base, potential, baseLabel, potentialLabel], index) => {
      const boosted = base !== potential;
      const value = boosted && showPotential ? potential : base;
      const stat = document.createElement('div');
      stat.className = 'scanner-stat';
      const heading = document.createElement('div');
      heading.className = 'scanner-stat-heading';
      const link = document.createElement('a');
      link.href = `../power-index.html#${statNames[index].toLowerCase()}`;
      link.textContent = statNames[index];
      const rating = document.createElement('span');
      rating.className = 'stat-rating';
      rating.textContent = boosted && showPotential
        ? `${base} → ${potential}/10 · ${potentialLabel}`
        : `${base}/10 · ${baseLabel}`;
      heading.append(link, rating);
      const meter = document.createElement('div');
      meter.className = 'scanner-meter';
      meter.setAttribute('role', 'meter');
      meter.setAttribute('aria-label', statNames[index]);
      meter.setAttribute('aria-valuemin', '0');
      meter.setAttribute('aria-valuemax', '10');
      meter.setAttribute('aria-valuenow', String(value));
      meter.style.setProperty('--base', `${base * 10}%`);
      meter.style.setProperty('--equipped', `${value * 10}%`);
      const fill = document.createElement('span');
      fill.className = 'scanner-fill';
      fill.setAttribute('aria-hidden', 'true');
      meter.append(fill);
      stat.append(heading, meter);
      readings.append(stat);
    });
    const baseKey = document.createElement('span');
    baseKey.innerHTML = '<i class="stat-key stat-key-base" aria-hidden="true"></i> Base rating';
    legend.append(baseKey);
    if (hasBoost && showPotential) {
      const boostKey = document.createElement('span');
      boostKey.innerHTML = '<i class="stat-key stat-key-boost" aria-hidden="true"></i> Max Potential';
      legend.append(boostKey);
    }
  } else {
    statNames.forEach((name) => {
      const stat = document.createElement('div');
      stat.className = 'scanner-stat';
      const heading = document.createElement('div');
      heading.className = 'scanner-stat-heading';
      const link = document.createElement('a');
      link.href = `../power-index.html#${name.toLowerCase()}`;
      link.textContent = name;
      const rating = document.createElement('span');
      rating.className = 'stat-rating';
      rating.textContent = 'Not documented';
      heading.append(link, rating);
      stat.append(heading);
      readings.append(stat);
    });
  }

  const note = document.createElement('p');
  note.textContent = member.note || 'Ratings out of 10. Select a stat for its definition.';
  legend.append(note);
  renderTable(tables[0], physicalNames, member.physical);
  renderTable(tables[1], personalNames, member.personal);
}

function changeCharacter(direction) {
  currentIndex = (currentIndex + direction + members.length) % members.length;
  render();
}

document.getElementById('previousCharacter').addEventListener('click', () => changeCharacter(-1));
document.getElementById('nextCharacter').addEventListener('click', () => changeCharacter(1));
portrait.addEventListener('click', () => changeCharacter(1));
render();
