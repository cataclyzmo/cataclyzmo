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

## Battle simulator data

The Sim dropdowns and base power ratings are generated from `characters.html` and the character dossiers. After changing the catalog or a dossier's ratings, regenerate the static bundle:

```sh
python3 scripts/build-sim-data.py
```

Characters without documented ratings remain selectable and fight with even odds.
