#!/usr/bin/env python3
"""
Inject Person schema JSON-LD into HTML pages missing author attribution.

Empire: creator-revenue-calculator
Author: brand ("Your Friendly Developer") per EMPIRE_BUILD_STANDARDS Tier 1 Standard.
Source audit: 2026-04-19 core-update audit, Pattern 2 (missing Person schema).

Idempotent: re-running skips files that already have Person schema.
"""
import json
import sys
from pathlib import Path

# Determine repo root: if script is in /scripts/, repo is parent; else cwd.
_here = Path(__file__).resolve().parent
REPO = _here.parent if _here.name == 'scripts' else Path.cwd()

PERSON_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Your Friendly Developer",
    "jobTitle": "Web Developer",
    "worksFor": {
        "@type": "Organization",
        "name": "Your Friendly Developer LLC",
        "url": "https://creatorrevenuecalculator.com/"
    },
    "url": "https://creatorrevenuecalculator.com/about.html"
}


def discover_targets(repo):
    """Root-level public HTML pages + every blog page. Skip about.html (already compliant)."""
    targets = []
    skip_root = {"about.html"}
    for p in sorted(repo.glob("*.html")):
        if p.name not in skip_root:
            targets.append(p)
    blog = repo / "blog"
    if blog.is_dir():
        for sub in sorted(blog.iterdir()):
            if sub.is_dir():
                idx = sub / "index.html"
                if idx.is_file():
                    targets.append(idx)
            elif sub.is_file() and sub.suffix == ".html":
                targets.append(sub)
    return targets


def has_person_schema(html):
    return '"@type": "Person"' in html or '"@type":"Person"' in html


def inject(file_path):
    html = file_path.read_text(encoding="utf-8")
    if has_person_schema(html):
        return False, "already has Person schema"
    script_tag = (
        '<script type="application/ld+json">\n'
        + json.dumps(PERSON_SCHEMA, indent=2)
        + "\n</script>\n</head>"
    )
    new_html = html.replace("</head>", script_tag, 1)
    if new_html == html:
        return False, "no </head> tag found"
    file_path.write_text(new_html, encoding="utf-8")
    return True, "injected"


def main():
    print(f"Repo root: {REPO}")
    targets = discover_targets(REPO)
    print(f"Discovered {len(targets)} HTML files to check")
    injected = 0
    skipped = 0
    for p in targets:
        rel = p.relative_to(REPO)
        ok, msg = inject(p)
        marker = "INJ" if ok else "SKP"
        print(f"  [{marker}] {rel}: {msg}")
        if ok:
            injected += 1
        else:
            skipped += 1
    print(f"\nTotal: {injected} injected, {skipped} skipped")
    return 0 if injected > 0 or skipped > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
