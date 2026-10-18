const formSelector = document.getElementById('michael-forms');
const characterPortrait = document.getElementById('characterImage');
const characterHeading = document.getElementById('characterName');
const appearances = {
    michael: { name: 'Michael Preston', image: '../images/michael-design.png', alt: 'Michael Preston in his New World Technologies lab coat' },
    proto: { name: 'Proto Armor', image: '../images/protoarmor-design.png', alt: 'Michael Preston wearing silver Proto Armor with a black visor, illustrated in detailed comic style' },
    yesterdayMan: { name: 'The Yesterday Man', image: '../images/the-yesterday-man-design.png', alt: 'Michael Preston wearing The Yesterday Man’s white armor with glowing green accents' }
};

formSelector.hidden = false;
characterHeading.setAttribute('aria-live', 'polite');
formSelector.addEventListener('change', (event) => {
    const appearance = appearances[event.target.value];
    if (!appearance) return;
    characterHeading.textContent = appearance.name;
    characterPortrait.src = appearance.image;
    characterPortrait.alt = appearance.alt;
});
