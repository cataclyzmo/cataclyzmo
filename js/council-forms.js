const councilPortrait = document.getElementById('characterImage');
const councilPortraitName = document.getElementById('council-portrait-name');
const councilOptions = document.querySelectorAll('.council-option');
const unityOption = document.querySelector('.council-option[data-name="Unity of Emotion"]');
const requiredCouncilForms = [...councilOptions].filter((option) => option !== unityOption);
const visitedCouncilForms = new Set();
const councilScanner = document.querySelector('.power-scanner');
const councilDossierTitle = document.getElementById('council-dossier-title');
const councilStats = [...councilScanner.querySelectorAll('.scanner-stat')];
const councilToggle = councilScanner.querySelector('.stats-toggle');
const councilBoostKey = councilScanner.querySelector('.stats-legend > span .stat-key-boost').closest('span');
const councilRatings = {
    Fear: [[4, 10], 1, 3, 7, 4, 1],
    Serenity: [[1, 5], [1, 3], 2, [1, 5], 1, 1],
    Rage: [7, 7, 2, 0, 7, 5],
    Grief: [9, 1, 2, [1, 5], 1, 1],
    Boredom: [8, 1, 2, 0, 1, 9],
    Hate: [9, 7, 4, 6, 6, 7],
    Logic: [2, 1, 9, 0, 2, 1],
    Shock: [7, 7, 1, 1, 3, 8],
    'Unity of Emotion': [9, 9, 3, 8, 9, 10]
};
const councilRatingLabels = [
    ['None', 'Deficient', 'Average', 'Fighter', 'Apex', 'Bulletproof', 'Enhanced', 'Nuclear', 'Planetary', 'Nearly Indestructible', 'Immortal'],
    ['None', 'Deficient', 'Average', 'Gunslinger', 'Rocketeer', 'Tank', 'Dynamo', 'Nuclear', 'Continental', 'Planetary', 'Star-Destroyer+'],
    ['None', 'Deficient', 'Average', 'Smart', 'Exceptional', 'Gifted', 'Highly Gifted', 'Genius', 'Super Genius', 'Beyond Genius', 'All-Knowing'],
    ['None', 'Enabled', 'Levitator', 'Puppet Master', 'Bulletproof', 'Vehicular', 'Titanic', 'Skyscraper', 'Continental', 'Planetary', 'Star-System+'],
    ['None', 'Deficient', 'Average', 'Olympian', 'Apex', 'Subsonic', 'Super-Sonic', 'Speedster', 'Super Speedster', 'Omega Level Speedster', 'Lightspeed+'],
    ['None', 'Deficient', 'Average', 'Strong', 'Strongman', 'Apex', 'Enhanced', 'Super', 'Ultra', 'Mega', 'Limitless']
];

function showCouncilRatings(name) {
    const ratings = councilRatings[name];
    councilScanner.hidden = !ratings;
    if (!ratings) return;
    const hasBoost = ratings.some(Array.isArray);
    councilDossierTitle.textContent = `Power dossier · ${name}`;
    if (name === 'Unity of Emotion') {
        councilDossierTitle.textContent = 'Power dossier';
        const formName = document.createElement('span');
        formName.className = 'council-dossier-form';
        formName.textContent = name;
        councilDossierTitle.append(formName);
    }
    councilToggle.hidden = !hasBoost;
    councilBoostKey.hidden = !hasBoost;

    councilStats.forEach((stat, index) => {
        const [base, equipped] = Array.isArray(ratings[index]) ? ratings[index] : [ratings[index], ratings[index]];
        const heading = stat.querySelector('.scanner-stat-heading');
        heading.querySelectorAll('.stat-rating').forEach((rating) => rating.remove());

        const baseRating = document.createElement('span');
        baseRating.className = `stat-rating${base !== equipped ? ' stat-base' : ''}`;
        baseRating.textContent = `${base}/10 · ${councilRatingLabels[index][base]}`;
        if (base !== equipped) {
            const equippedRating = document.createElement('span');
            equippedRating.className = 'stat-rating stat-equipped';
            equippedRating.textContent = `${base} → ${equipped}/10 · ${councilRatingLabels[index][equipped]}`;
            const note = document.createElement('span');
            note.className = 'stat-boost-note';
            note.textContent = 'Similar To';
            equippedRating.append(note);
            heading.append(equippedRating);
        }
        heading.append(baseRating);

        const meter = stat.querySelector('.scanner-meter');
        meter.dataset.base = base;
        meter.dataset.equipped = equipped;
        meter.style.setProperty('--base', `${base * 10}%`);
        meter.style.setProperty('--equipped', `${equipped * 10}%`);
        meter.setAttribute('aria-valuenow', equipped);
    });

    if (hasBoost) {
        councilToggle.querySelector('input').dispatchEvent(new Event('change'));
    } else {
        councilScanner.classList.remove('stats-base-only');
    }
}

function showCouncilForm(option) {
    const name = option.dataset.name;
    councilPortrait.src = option.querySelector('img').src;
    councilPortrait.alt = `${name} character portrait`;
    councilPortraitName.textContent = name;
    showCouncilRatings(name);

    councilOptions.forEach((choice) => {
        choice.setAttribute('aria-pressed', String(choice === option));
    });
}

councilPortraitName.setAttribute('aria-live', 'polite');
councilOptions.forEach((option) => {
    option.addEventListener('click', () => {
        if (option !== unityOption) visitedCouncilForms.add(option.dataset.name);
        if (visitedCouncilForms.size === requiredCouncilForms.length && unityOption.hidden) {
            unityOption.hidden = false;
            showCouncilForm(unityOption);
            return;
        }
        showCouncilForm(option);
    });
});
