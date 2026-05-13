#!/usr/bin/env python3
"""Fix the 200 towns list to properly match against existing CSV data."""
import json, os

BASE = '/Users/nigelmorris/Projects/Foodshare'

# Load existing town data
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Build list of town names with CSV files
csv_names = {}
for t in data['towns']:
    if t.get('csvFile'):
        raw = t['name'].lower().strip()
        # Create multiple matching variants
        variants = [raw]
        if 'brighton' in raw: variants.append('brighton')
        if 'hove' in raw and 'brighton' not in raw: variants.append('brighton and hove')
        if ' and hove' in raw: variants.append(raw.replace(' and hove', ''))
        if ' and ' in raw:
            parts = raw.split(' and ')
            variants.extend(parts)
        for v in variants:
            csv_names[v] = t['csvFile']

# Parse the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    content = f.read()

lines = content.split('\n')
entries = []
for line in lines:
    if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---') and not line.startswith('| ---'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'num': parts[0], 'name': parts[1], 'region': parts[2], 'pop': parts[3]})

def norm(n):
    return n.lower().strip().replace(' and hove', '').replace('-', ' ').replace("'", "")

have = []
need = []
for e in entries:
    n = norm(e['name'])
    found = False
    # Check all known CSV town names
    for csv_name in csv_names:
        if n == norm(csv_name) or n in norm(csv_name) or norm(csv_name) in n:
            found = True
            have.append({**e, 'csv': csv_names[csv_name]})
            break
    if not found:
        need.append(e)

print(f"Total entries: {len(entries)}")
print(f"Already have CSV: {len(have)}")
print(f"Still need CSV: {len(need)}")

# Write updated list
out = []
out.append("# 200 UK Towns — CSV Coverage Status")
out.append("")
out.append(f"- **Total major UK towns listed**: {len(entries)}")
out.append(f"- **Towns with existing CSV data**: {len(have)}")
out.append(f"- **Towns still needing CSV creation**: {len(need)}")
out.append("")
out.append("## ✅ Towns Already Covered (have CSV files)")
out.append("")
out.append("| # | Town | Region | Population | CSV File |")
out.append("|---|------|--------|------------|----------|")
for i, h in enumerate(have, 1):
    out.append(f"| {i} | {h['name']} | {h['region']} | {h['pop']} | `{h['csv']}` |")

out.append("")
out.append("## ❌ Towns Still Needing CSV Files")
out.append("")
out.append("| # | Town | Region | Population |")
out.append("|---|------|--------|------------|")
for i, n in enumerate(need, 1):
    out.append(f"| {i} | {n['name']} | {n['region']} | {n['pop']} |")

out.append("")
out.append("---")
out.append("*Generated for Foodshare project. CSV files are in `data/` directory.*")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(out))

print(f"\n✅ Saved. {len(have)} covered, {len(need)} still needed.")
PYEOF