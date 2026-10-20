document.querySelectorAll('.power-scanner').forEach((scanner) => {
    const meters = [...scanner.querySelectorAll('.scanner-meter')];
    if (!meters.some((meter) => meter.dataset.base !== meter.dataset.equipped)) return;
    const portrait = scanner.dataset.equipmentPortrait ? document.getElementById('characterImage') : null;
    const basePortrait = portrait?.getAttribute('src');
    const baseAlt = portrait?.alt;

    const label = document.createElement('label');
    label.className = 'stats-toggle';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !portrait;
    if (portrait) {
        const boostKey = document.createElement('i');
        boostKey.className = 'stat-key stat-key-boost';
        boostKey.setAttribute('aria-hidden', 'true');
        label.append(checkbox, boostKey, 'Max Potential');
    } else {
        label.append(checkbox, ' Max Potential');
    }
    scanner.querySelector('.stats-legend').prepend(label);

    const updateEquipment = () => {
        scanner.classList.toggle('stats-base-only', !checkbox.checked);
        meters.forEach((meter) => {
            meter.setAttribute('aria-valuenow', checkbox.checked ? meter.dataset.equipped : meter.dataset.base);
        });
        if (portrait) {
            portrait.src = checkbox.checked ? scanner.dataset.equipmentPortrait : basePortrait;
            portrait.alt = checkbox.checked ? portrait.dataset.equippedAlt : baseAlt;
        }
    };

    checkbox.addEventListener('change', updateEquipment);
    updateEquipment();
});
