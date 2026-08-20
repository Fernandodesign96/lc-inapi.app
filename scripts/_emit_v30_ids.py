# -*- coding: utf-8 -*-
import json
from pathlib import Path

ids = [
    c["id"]
    for c in json.loads(
        Path("data/checklist-criteria-lc-ptd.json").read_text(encoding="utf-8")
    )["criteria"]
]
out = Path("scripts/_v30_ids.txt")
lines = ["export const CRITERION_IDS_V30 = ["]
for i in ids:
    lines.append(f'  "{i}",')
lines.append("] as const")
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(out, len(ids))
