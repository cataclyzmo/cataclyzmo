const councilPortrait = document.getElementById('characterImage');
const councilPortraitName = document.getElementById('council-portrait-name');
const councilOptions = document.querySelectorAll('.council-option');

councilOptions.forEach((option) => {
    option.addEventListener('click', () => {
        const name = option.dataset.name;
        councilPortrait.src = option.querySelector('img').src;
        councilPortrait.alt = `${name} character portrait`;
        councilPortraitName.textContent = name;

        councilOptions.forEach((choice) => {
            choice.setAttribute('aria-pressed', String(choice === option));
        });
    });
});
