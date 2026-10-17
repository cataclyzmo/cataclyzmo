document.querySelectorAll('.power-scanner').forEach((scanner) => {
    const meters = [...scanner.querySelectorAll('.scanner-meter')];
    if (!meters.some((meter) => meter.dataset.base !== meter.dataset.equipped)) return;

    const label = document.createElement('label');
    label.className = 'stats-toggle';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    label.append(checkbox, ' Include equipment boosts');
    scanner.querySelector('.stats-legend').prepend(label);

    checkbox.addEventListener('change', () => {
        scanner.classList.toggle('stats-base-only', !checkbox.checked);
        meters.forEach((meter) => {
            meter.setAttribute('aria-valuenow', checkbox.checked ? meter.dataset.equipped : meter.dataset.base);
        });
    });
});
