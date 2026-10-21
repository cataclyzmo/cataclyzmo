#!/usr/bin/env python3
"""Render the shared navigation and footer into every published HTML page."""

import argparse
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "templates"
NAV_START = "<!-- BEGIN SHARED NAV -->"
NAV_END = "<!-- END SHARED NAV -->"
FOOTER_START = "<!-- BEGIN SHARED FOOTER -->"
FOOTER_END = "<!-- END SHARED FOOTER -->"
TOKEN = re.compile(r"\{\{([a-z_]+)\}\}")


def section_for(path: Path) -> str | None:
    parts = path.relative_to(ROOT).parts
    if len(parts) > 1:
        return {"characters": "characters", "teams": "teams", "items": "items", "planets": "worlds"}.get(parts[0])
    return {
        "index.html": "home",
        "books.html": "comics",
        "characters.html": "characters",
        "teams.html": "teams",
        "items.html": "items",
        "geo.html": "worlds",
        "power-index.html": "power_index",
        "sim.html": "sim",
    }.get(parts[0])


def render(template: str, path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    current = section_for(path)
    values = {"root": "../" * depth}
    values.update({f"{section}_current": ' aria-current="page"' if current == section else ""
                   for section in ("home", "comics", "characters", "teams", "items", "worlds", "power_index", "sim")})
    return TOKEN.sub(lambda match: values[match.group(1)], template)


def replace_block(source: str, start_marker: str, end_marker: str, rendered: str,
                  old_start: str, old_end: str) -> str:
    if start_marker in source:
        assert source.count(start_marker) == source.count(end_marker) == 1
        start = source.index(start_marker)
        end = source.index(end_marker, start) + len(end_marker)
    else:
        start = source.index(old_start)
        end = source.index(old_end, start) + len(old_end)
    line_start = source.rfind("\n", 0, start) + 1
    if source[line_start:start].isspace() or line_start == start:
        start = line_start
    return source[:start] + f"{start_marker}\n{rendered}\n{end_marker}" + source[end:]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true", help="update published HTML")
    mode.add_argument("--check", action="store_true", help="fail if published HTML is out of sync")
    args = parser.parse_args()

    nav_template = (TEMPLATES / "site-nav.html.tmpl").read_text().strip()
    footer_template = (TEMPLATES / "site-footer.html.tmpl").read_text().strip()
    changed = []
    for page in sorted(ROOT.rglob("*.html")):
        source = page.read_text()
        output = replace_block(source, NAV_START, NAV_END, render(nav_template, page),
                               '<div class="nav-sidescreen"', "</nav>")
        output = replace_block(output, FOOTER_START, FOOTER_END, render(footer_template, page),
                               '<footer class="site-footer"', "</footer>")
        if output != source:
            changed.append(page.relative_to(ROOT))
            if args.write:
                page.write_text(output)

    if changed:
        print(f"{'Updated' if args.write else 'Out of sync'}: {len(changed)} HTML pages")
        for page in changed:
            print(page)
        if args.check:
            raise SystemExit(1)
    else:
        print("All HTML pages use the shared navigation and footer.")


if __name__ == "__main__":
    main()
