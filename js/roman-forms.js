const romanForms = document.getElementById('roman-forms');
const romanPortrait = document.getElementById('characterImage');
const romanStats = [...document.querySelectorAll('.power-scanner .scanner-stat')];
const romanAppearances = {
    roman: {
        image: '../images/roman-design.webp',
        alt: 'Roman the Conqueror character portrait',
        stats: [[4, 'Apex'], [1, 'Deficient'], [2, 'Average'], [0, 'None'], [3, 'Olympian'], [5, 'Apex']]
    },
    blueBuster: {
        image: '../images/roman-blue-buster-mode.webp',
        alt: 'Roman in Blue Buster Mode, wearing black and gold armor with blue accents and carrying a sword and shield',
        stats: [[7, 'Nuclear'], [5, 'Tank'], [2, 'Average'], [1, 'Enabled'], [6, 'Super-Sonic'], [6, 'Enhanced']]
    }
};

romanForms.hidden = false;
romanForms.addEventListener('change', (event) => {
    const appearance = romanAppearances[event.target.value];
    if (!appearance) return;
    romanPortrait.src = appearance.image;
    romanPortrait.alt = appearance.alt;
    romanStats.forEach((stat, index) => {
        const [rating, label] = appearance.stats[index];
        stat.querySelector('.stat-rating').textContent = `${rating}/10 · ${label}`;
        const meter = stat.querySelector('.scanner-meter');
        meter.setAttribute('aria-valuenow', rating);
        meter.dataset.base = rating;
        meter.dataset.equipped = rating;
        meter.style.setProperty('--base', `${rating * 10}%`);
        meter.style.setProperty('--equipped', `${rating * 10}%`);
    });
});
