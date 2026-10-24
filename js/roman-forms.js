const romanForms = document.getElementById('roman-forms');
const romanPortrait = document.getElementById('characterImage');
const romanAppearances = {
    roman: {
        image: '../images/roman-design.webp',
        alt: 'Roman the Conqueror character portrait'
    },
    blueBuster: {
        image: '../images/roman-blue-buster-mode.webp',
        alt: 'Roman in Blue Buster Mode, wearing black and gold armor with blue accents and carrying a sword and shield'
    }
};

romanForms.hidden = false;
romanForms.addEventListener('change', (event) => {
    const appearance = romanAppearances[event.target.value];
    if (!appearance) return;
    romanPortrait.src = appearance.image;
    romanPortrait.alt = appearance.alt;
});
