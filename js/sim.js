(() => {
  'use strict';

  const characters = window.simCharacters || [];
  const statNames = ['Durability', 'Energy', 'Intelligence', 'Psionics', 'Speed', 'Strength'];
  const selects = [document.getElementById('select-one'), document.getElementById('select-two')];
  const displays = [document.getElementById('display-one'), document.getElementById('display-two')];
  const button = document.getElementById('fight-button');
  const message = document.getElementById('selection-message');
  const result = document.getElementById('battle-result');
  const resultTitle = document.getElementById('result-title');
  const resultDetail = document.getElementById('result-detail');
  const resultSeed = document.getElementById('result-seed');

  characters.forEach((character, index) => {
    selects.forEach(select => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = character.name;
      select.append(option);
    });
  });

  function selected(index) {
    return selects[index].value === '' ? null : characters[Number(selects[index].value)];
  }

  function showFighter(index) {
    const character = selected(index);
    const display = displays[index];
    display.replaceChildren();
    if (!character) {
      const placeholder = document.createElement('p');
      placeholder.className = 'fighter-placeholder';
      placeholder.textContent = `Your ${index === 0 ? 'first' : 'second'} fighter appears here.`;
      display.append(placeholder);
      return;
    }

    const portrait = document.createElement('img');
    portrait.src = character.image;
    portrait.alt = `${character.name} portrait`;
    const info = document.createElement('div');
    info.className = 'fighter-info';
    const name = document.createElement('h2');
    name.textContent = character.name;
    const profile = document.createElement('a');
    profile.href = character.profile;
    profile.textContent = 'View character profile';
    const stats = document.createElement('div');
    stats.className = 'fighter-stats';
    if (character.stats) {
      character.stats.forEach((value, statIndex) => {
        const line = document.createElement('div');
        line.className = 'fighter-stat';
        const label = document.createElement('span');
        label.textContent = statNames[statIndex];
        const score = document.createElement('strong');
        score.textContent = `${value}/10`;
        line.append(label, score);
        stats.append(line);
      });
      const total = document.createElement('p');
      total.className = 'fighter-total';
      total.textContent = `Total: ${character.stats.reduce((sum, value) => sum + value, 0)}/60`;
      stats.append(total);
    } else {
      const note = document.createElement('p');
      note.className = 'fighter-unrated';
      note.textContent = 'Power ratings are not documented yet.';
      stats.append(note);
    }
    info.append(name, profile, stats);
    display.append(portrait, info);
  }

  function updateSelection() {
    showFighter(0);
    showFighter(1);
    const both = selected(0) && selected(1);
    const different = both && selects[0].value !== selects[1].value;
    button.disabled = !different;
    message.textContent = different ? 'Ready to fight.' : both ? 'Choose two different characters.' : 'Choose two different characters to begin.';
    result.hidden = true;
  }

  // Mulberry32: the same seed always produces the same first roll.
  function seededRoll(seed) {
    let value = (seed + 0x6D2B79F5) | 0;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  function fight(seed) {
    const first = selected(0);
    const second = selected(1);
    if (!first || !second || selects[0].value === selects[1].value) return;

    let chance = 0.5;
    if (first.stats && second.stats) {
      const firstTotal = first.stats.reduce((sum, value) => sum + value, 0);
      const secondTotal = second.stats.reduce((sum, value) => sum + value, 0);
      chance = Math.max(0.05, Math.min(0.95, 1 / (1 + Math.exp((secondTotal - firstTotal) / 10))));
    }
    const firstWins = seededRoll(seed) < chance;
    const winner = firstWins ? first : second;
    const winnerChance = firstWins ? chance : 1 - chance;
    resultTitle.textContent = `${winner.name} wins!`;
    resultDetail.textContent = first.stats && second.stats
      ? `${first.name}: ${Math.round(chance * 100)}% chance · ${second.name}: ${Math.round((1 - chance) * 100)}% chance. ${winner.name} won this simulation with a ${Math.round(winnerChance * 100)}% pre-fight chance.`
      : `Both fighters had a 50% chance because ${!first.stats && !second.stats ? 'neither has documented power ratings' : 'one fighter has no documented power ratings'}.`;

    const replay = new URL(window.location.href);
    replay.searchParams.set('a', selects[0].value);
    replay.searchParams.set('b', selects[1].value);
    replay.searchParams.set('seed', String(seed));
    resultSeed.replaceChildren();
    const link = document.createElement('a');
    link.href = replay.href;
    link.textContent = 'Replay this result';
    resultSeed.append(`Fight seed: ${seed} · `, link);
    result.hidden = false;
  }

  selects.forEach(select => select.addEventListener('change', updateSelection));
  button.addEventListener('click', () => {
    const seed = new Uint32Array(1);
    crypto.getRandomValues(seed);
    fight(seed[0]);
  });

  const params = new URLSearchParams(window.location.search);
  const first = params.get('a');
  const second = params.get('b');
  const seed = params.get('seed');
  if (first !== null && second !== null && seed !== null &&
      /^\d+$/.test(first) && /^\d+$/.test(second) && /^\d+$/.test(seed) &&
      Number(first) < characters.length && Number(second) < characters.length &&
      Number(seed) <= 0xFFFFFFFF) {
    selects[0].value = first;
    selects[1].value = second;
    updateSelection();
    fight(Number(seed));
  } else {
    updateSelection();
  }
})();
