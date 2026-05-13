import json, os, re

BASE = '/Users/nigelmorris/Projects/Foodshare'

with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Build CSV name lookup with normalized keys
csv_town_map = {}
for t in data['towns']:
    if t.get('csvFile'):
        name = t['name'].lower().strip()
        # Create normalized variants
        variants = set([name])
        if ' and hove' in name:
            variants.add(name.replace(' and hove', '').strip())
        if ' and ' in name:
            parts = name.split(' and ')
            variants.update(p.strip() for p in parts)
        for v in variants:
            csv_town_map[v] = t['csvFile']

# Parse the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

entries = []
for line in lines:
    if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---') and not line.startswith('| ---'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'num': parts[0], 'name': parts[1].strip(), 'region': parts[2].strip(), 'pop': parts[3].strip()})

have = []
need = []
for e in entries:
    key = e['name'].lower().strip()
    # Try exact match or partial match
    matched_key = None
    for k, v in csv_town_map.items():
        if key == k or key.replace('-', ' ') == k or k in key or key in k:
            matched_key = k
            break
    if matched_key:
        have.append({**e, 'csv': csv_town_map[matched_key]})
    else:
        need.append(e)

print("Matched towns with CSV: {}".format(len(have)))
print("Towns still needing CSV: {}".format(len(need)))
print()
print("Example matches:")
for h in have[:10]:
    print("  {} -> {}".format(h['name'], h['csv']))
print()
print("Example needs:")
for n in need[:10]:
    print("  {}".format(n['name']))

# Write clean updated list
out = []
out.append("# 200 UK Towns — CSV Coverage Status")
out.append("")
out.append("- **Total towns listed**: {}".format(len(entries)))
out.append("- **Already have CSV data**: {}".format(len(have)))
out.append("- **Still need CSV creation**: {}".format(len(need)))
out.append("")
out.append("## ✅ Already Covered (have CSV files)")
out.append("")
out.append("| # | Town | Region | Approx. Population |")
out.append("|---|------|--------|--------------------|")
for i, h in enumerate(have, 1):
    out.append("| {} | {} | {} | {} |".format(i, h['name'], h['region'], h['pop']))

out.append("")
out.append("## ❌ Still Needing CSV Files")
out.append("")
out.append("| # | Town | Region | Approx. Population |")
out.append("|---|------|--------|--------------------|")
for i, n in enumerate(need, 1):
    out.append("| {} | {} | {} | {} |".format(i, n['name'], n['region'], n['pop']))

out.append("")
out.append("---")
out.append("*Generated for Foodshare project.*")
out.append("*Towns with existing CSV data reference files in `data/` directory.*")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(out))

print("\n✅ Saved 200_uk_towns_list.md with {} covered and {} needing CSV".format(len(have), len(need)))
PYEOF