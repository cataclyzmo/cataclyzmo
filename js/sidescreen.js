(() => {
    const button = document.querySelector('.ham-menu');
    const panel = document.querySelector('.nav-sidescreen');
    if (!button || !panel) return;

    const mobile = window.matchMedia('(max-width: 900px)');
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.append(backdrop);
    let open = false;
    let background = [];

    function setOpen(next, restoreFocus = true) {
        next = next && mobile.matches;
        if (next === open) return;
        open = next;
        button.classList.toggle('active', open);
        panel.classList.toggle('active', open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        panel.inert = !open;
        backdrop.hidden = !open;
        document.documentElement.classList.toggle('menu-open', open);

        if (open) {
            const nav = button.closest('nav');
            // Preserve any pre-existing inert states when closing.
            background = [...document.body.children, ...nav.children]
                .filter(element => ![panel, backdrop, nav, button].includes(element))
                .map(element => [element, element.inert]);
            background.forEach(([element]) => { element.inert = true; });
            panel.querySelector('a').focus();
        } else {
            background.forEach(([element, inert]) => { element.inert = inert; });
            background = [];
            if (restoreFocus) button.focus();
        }
    }

    button.addEventListener('click', () => setOpen(!open));
    backdrop.addEventListener('click', () => setOpen(false));
    panel.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (!open) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Tab') {
            const controls = [button, ...panel.querySelectorAll('a[href]')];
            const index = controls.indexOf(document.activeElement);
            const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
            event.preventDefault();
            controls[next].focus();
        }
    });
    mobile.addEventListener('change', () => setOpen(false, false));
})();
