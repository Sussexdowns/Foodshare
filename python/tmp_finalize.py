#!/usr/bin/env python3
"""Finalize the 200 UK towns list, properly cross-referencing with existing data."""
import json, os, csv

BASE = '/Users/nigelmorris/Projects/Foodshare'

# Load uk_towns.json
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Build set of town names that have a CSV file
csv_town_names = set()
for t in data['towns']:
    if t.get('csvFile'):
        csv_town_names.add(t['name'].lower().strip())

def norm(n):
    return n.lower().strip().replace(' and hove', '').replace('-', ' ').replace("'", "")

# Check each entry in the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

entries = []
for line in lines:
    if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---') and not line.startswith('| ---'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'num': parts[0], 'name': parts[1], 'region': parts[2], 'pop': parts[3]})

have = []
need = []
for e in entries:
    n = norm(e['name'])
    if any(n == norm(c) for c in csv_town_names):
        have.append(e)
    else:
        need.append(e)

print(f"Total entries: {len(entries)}")
print(f"Already have CSV: {len(have)}")
print(f"Still need CSV: {len(need)}")

# Write the cleaned-up list
out = []
out.append("# 200 UK Towns — CSV Coverage Status")
out.append("")
out.append(f"- **Total major UK towns listed**: {len(entries)}")
out.append(f"- **Towns with existing CSV data**: {len(have)}")
out.append(f"- **Towns still needing CSV creation**: {len(need)}")
out.append("")
out.append("## ✅ Towns Already Covered (have CSV files)")
out.append("")
out.append("| # | Town | Region | Population |")
out.append("|---|------|--------|------------|")
for i, h in enumerate(have, 1):
    out.append(f"| {i} | {h['name']} | {h['region']} | {h['pop']} |")

out.append("")
out.append("## ❌ Towns Still Needing CSV Files")
out.append("")
out.append("| # | Town | Region | Population |")
out.append("|---|------|--------|------------|")
for i, n in enumerate(need, 1):
    out.append(f"| {i} | {n['name']} | {n['region']} | {n['pop']} |")

out.append("")
out.append("---")
out.append(f"*Generated for Foodshare project. CSV files are located in `data/` directory.*")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(out))

print(f"\n✅ Updated 200_uk_towns_list.md")
print(f"   Covered: {len(have)} | Need: {len(need)}")