const romanForms = document.getElementById('roman-forms');
const romanPortrait = document.getElementById('characterImage');
const romanAppearances = {
    roman: {
        image: '../images/roman-design.png',
        alt: 'Roman the Conqueror character portrait'
    },
    blueBuster: {
        image: '../images/roman-blue-buster-mode.png',
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
