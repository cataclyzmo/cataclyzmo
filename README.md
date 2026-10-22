# Cataclyzmo

This is a static HTML site. The published pages include the navigation and footer markup directly, so they work without a build step or client-side JavaScript.

## Shared navigation and footer

Edit `templates/site-nav.html.tmpl` or `templates/site-footer.html.tmpl`, then regenerate the HTML pages:

```sh
python3 scripts/sync-site-shell.py --write
```

Before committing, verify that every page matches the templates:

```sh
python3 scripts/sync-site-shell.py --check
```

The script sets relative links and the current navigation item based on each page's location.

## Character comparison data

The Compare dropdowns, power ratings, and facts are generated from `characters.html` and the character dossiers. After changing the catalog or a dossier, regenerate the static bundle:

```sh
python3 scripts/build-compare-data.py
```

Characters without documented ratings remain selectable, with missing details labeled on their cards.
