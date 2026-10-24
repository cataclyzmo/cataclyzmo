const formSelector = document.getElementById('michael-forms');
const characterPortrait = document.getElementById('characterImage');
const characterHeading = document.getElementById('characterName');
const scanner = document.querySelector('.power-scanner');
const maxPotentialKey = document.getElementById('michael-max-potential-key');
const meters = [...scanner.querySelectorAll('.scanner-meter')];
const originalMeters = new Map(meters.map((meter) => [meter, {
    base: meter.dataset.base,
    equipped: meter.dataset.equipped,
    baseWidth: meter.style.getPropertyValue('--base'),
    equippedWidth: meter.style.getPropertyValue('--equipped')
}]));
const energyRating = scanner.querySelector('.scanner-meter[aria-label="Energy"]').closest('.scanner-stat').querySelector('.stat-base');
const psionicsRating = scanner.querySelector('.scanner-meter[aria-label="Psionics"]').closest('.scanner-stat').querySelector('.stat-rating');
const originalEnergyRating = energyRating.textContent;
const originalPsionicsRating = psionicsRating.textContent;
const appearances = {
    michael: { name: 'Michael Preston', image: '../images/michael-design.webp', alt: 'Michael Preston in his New World Technologies lab coat' },
    proto: { name: 'Proto Armor', image: '../images/protoarmor-design.webp', alt: 'Michael Preston wearing silver Proto Armor with a black visor, illustrated in detailed comic style' },
    yesterdayMan: { name: 'The Yesterday Man', image: '../images/the-yesterday-man-design.webp', alt: 'Michael Preston wearing The Yesterday Man’s white armor with glowing green accents' }
};

function showAppearance(form) {
    const appearance = appearances[form];
    if (!appearance) return;

    characterHeading.textContent = appearance.name;
    characterPortrait.src = appearance.image;
    characterPortrait.alt = appearance.alt;
    scanner.hidden = form === 'michael';

    const proto = form === 'proto';
    maxPotentialKey.hidden = proto;
    const toggle = scanner.querySelector('.stats-toggle');
    if (toggle) toggle.hidden = proto;

    meters.forEach((meter) => {
        const original = originalMeters.get(meter);
        const base = proto && meter.getAttribute('aria-label') === 'Energy' ? '3'
            : proto && meter.getAttribute('aria-label') === 'Psionics' ? '0'
            : original.base;
        meter.dataset.base = base;
        meter.dataset.equipped = proto ? base : original.equipped;
        meter.style.setProperty('--base', proto ? `${Number(base) * 10}%` : original.baseWidth);
        meter.style.setProperty('--equipped', proto ? `${Number(base) * 10}%` : original.equippedWidth);
        meter.setAttribute('aria-valuenow', proto ? base : original.equipped);
    });

    energyRating.textContent = proto ? '3/10 · Gunslinger' : originalEnergyRating;
    psionicsRating.textContent = proto ? '0/10 · None' : originalPsionicsRating;
    scanner.classList.toggle('stats-base-only', proto);
    if (!proto && toggle) toggle.querySelector('input').dispatchEvent(new Event('change'));
}

formSelector.hidden = false;
characterHeading.setAttribute('aria-live', 'polite');
formSelector.addEventListener('change', (event) => showAppearance(event.target.value));
showAppearance(formSelector.querySelector('input:checked').value);
