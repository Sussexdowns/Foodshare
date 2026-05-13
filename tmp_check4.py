import json, os

BASE = '/Users/nigelmorris/Projects/Foodshare'

# From JSON, build proper name set
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Map of json town name -> csv file
json_csv = {}
for t in data['towns']:
    if t.get('csvFile'):
        json_csv[t['name'].lower().strip()] = t['csvFile']

# Also build set of json town names (all)
json_names = set()
for t in data['towns']:
    json_names.add(t['name'].lower().strip())

# Parse the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

entries = []
for line in lines:
    if line.startswith('| ') and not any(line.startswith(x) for x in ['| #', '|---', '| Town', '| T']):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'name': parts[1], 'region': parts[2], 'pop': parts[3]})

def matches_json(name):
    """Check if a town from the 200 list matches a json entry with a CSV."""
    nl = name.lower().strip()
    # Exact match
    if nl in json_csv:
        return True, json_csv[nl]
    # Handle 'Brighton' matching 'Brighton and Hove'
    for jn, jcsv in json_csv.items():
        if nl in jn or jn in nl:
            # Additional length check to avoid bad partial matches
            if abs(len(nl) - len(jn)) < 10:
                return True, jcsv
    return False, None

have = []
need = []
for e in entries:
    ok, csv_path = matches_json(e['name'])
    if ok:
        e['csv'] = csv_path
        have.append(e)
    else:
        need.append(e)

print("Total entries in list: {}".format(len(entries)))
print("Already have CSV: {}".format(len(have)))
print("Still need CSV: {}".format(len(need)))
print()

if have:
    print("=== ALREADY COVERED ===")
    for h in have:
        print("  {} -> {}".format(h['name'], h['csv']))

if need:
    print("\n=== STILL NEED ===")
    for n in need:
        print("  {} | {} | pop={}".format(n['name'], n['region'], n['pop']))

# Write clean list
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
out.append("|---|------|--------|-|")
for i, h in enumerate(have, 1):
    out.append("| {} | {} | {} | {} |".format(i, h['name'], h['region'], h['pop']))

out.append("")
out.append("## ❌ Still Needing CSV Files")
out.append("")
out.append("| # | Town | Region | Approx. Population |")
out.append("|---|------|--------|-|")
for i, n in enumerate(need, 1):
    out.append("| {} | {} | {} | {} |".format(i, n['name'], n['region'], n['pop']))

out.append("")
out.append("---")
out.append("*Generated for Foodshare project.*")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(out))

print("\n✅ Saved 200_uk_towns_list.md")
print("   Covered: {} | Need: {}".format(len(have), len(need)))
PYEOF