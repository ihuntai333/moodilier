from pathlib import Path
import json
import re

root = Path(r"C:\Users\Constantin\.gemini\antigravity\scratch\moodilier")
data = json.loads(
    (root / "scripts" / "project-descriptions-aug.json").read_text(encoding="utf-8")
)


def to_slug(project: str) -> str:
    m = re.search(r"(Villa|Apartment|Showroom)\s*-?\s*(\d+)?", project, re.I)
    if not m:
        return ""
    kind = m.group(1).lower()
    num = m.group(2)
    if kind == "showroom":
        return "showroom-15"
    if kind == "villa":
        return f"villa-{int(num):02d}"
    return f"apartment-{int(num):02d}"


def clean(body: str) -> str:
    paras = [re.sub(r"\s+", " ", p).strip() for p in body.split("\n")]
    paras = [p for p in paras if p]
    return "\n\n".join(paras)


mapping: dict[str, str] = {}
for row in data:
    slug = to_slug(row["project"])
    if not slug:
        print("SKIP", row["project"])
        continue
    mapping[slug] = clean(row["body"])
    print(slug, len(mapping[slug]))

lines = [
    "/**",
    " * Project descriptions extracted from DOWNLOAD AUG *.docx files.",
    " * Keyed by projects-aug slug.",
    " */",
    "export const PROJECT_DESCRIPTIONS_AUG: Record<string, string> = {",
]
for slug in sorted(mapping.keys()):
    lines.append(f"  {json.dumps(slug)}: {json.dumps(mapping[slug], ensure_ascii=False)},")
lines.append("};")
lines.append("")

out = root / "src" / "data" / "project-descriptions-aug.ts"
out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "count", len(mapping))

aug = root / "src" / "data" / "projects-aug.ts"
src = aug.read_text(encoding="utf-8")
for slug, text in mapping.items():
    pattern = (
        rf'("slug": "{re.escape(slug)}",\s*"title": "[^"]*",\s*"category": "[^"]*",\s*)'
        rf'"description": "(?:\\.|[^"\\])*"'
    )
    repl = r"\1" + '"description": ' + json.dumps(text, ensure_ascii=False)

    def _repl(m, _text=text):
        return m.group(1) + '"description": ' + json.dumps(_text, ensure_ascii=False)

    new_src, n = re.subn(pattern, _repl, src, count=1, flags=re.S)
    if n != 1:
        print("WARN replace", slug, n)
    else:
        src = new_src
        print("OK", slug)

aug.write_text(src, encoding="utf-8")
print("patched projects-aug.ts")
