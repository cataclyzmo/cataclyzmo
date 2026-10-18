const formSelector = document.getElementById('michael-forms');
const characterPortrait = document.getElementById('characterImage');
const characterHeading = document.getElementById('characterName');
const appearances = {
    michael: { name: 'Michael Preston', image: '../images/michael-design.png', alt: 'Michael Preston in his New World Technologies lab coat' },
    proto: { name: 'Proto Armor', image: '../images/protoarmor-bg.jpeg', alt: 'Michael Preston wearing Proto Armor' },
    century: { name: 'Century', image: '../images/century-design.png', alt: 'Michael Preston wearing Century’s white armor with glowing green accents' }
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
