import json, os

BASE = '/Users/nigelmorris/Projects/Foodshare'

# From JSON, build proper name set
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Map: normalized json town name -> (original name, csv file)
json_csv = {}
for t in data['towns']:
    if t.get('csvFile'):
        n = t['name'].lower().strip()
        json_csv[n] = (t['name'], t['csvFile'])
        # Also map without "and hove" suffix
        if ' and hove' in n:
            json_csv[n.replace(' and hove', '').strip()] = (t['name'], t['csvFile'])

# Parse the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

entries = []
for line in lines:
    if line.startswith('| ') and not any(line.startswith(x) for x in ['| #', '|---', '| Town', '| T']):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'name': parts[1], 'region': parts[2], 'pop': parts[3]})

have = []
need = []
for e in entries:
    key = e['name'].lower().strip()
    # Exact match
    if key in json_csv:
        orig_name, csv = json_csv[key]
        e['csv'] = csv
        e['json_name'] = orig_name
        have.append(e)
    else:
        need.append(e)

print("Total entries: {}".format(len(entries)))
print("Already have CSV: {}".format(len(have)))
print("Still need CSV: {}".format(len(need)))

# Write the clean list
out = []
out.append("# 200 UK Towns — CSV Coverage Status")
out.append("")
out.append("- **Total towns listed**: {}".format(len(entries)))
out.append("- **Already have CSV data**: {}".format(len(have)))
out.append("- **Still need CSV creation**: {}".format(len(need)))
out.append("")
out.append("## ✅ Covered (have CSV files in uk_towns.json)")
out.append("")
out.append("| # | Town | Region | Population |")
out.append("|---|------|--------|-|")
for i, h in enumerate(have, 1):
    out.append("| {} | {} | {} | {} |".format(i, h['name'], h['region'], h['pop']))

out.append("")
out.append("## ❌ Still Needing CSV Files")
out.append("")
out.append("| # | Town | Region | Population |")
out.append("|---|------|--------|-|")
for i, n in enumerate(need, 1):
    out.append("| {} | {} | {} | {} |".format(i, n['name'], n['region'], n['pop']))

out.append("")
out.append("---")
out.append("*Generated for Foodshare project.*")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(out))

print("\n✅ Saved 200_uk_towns_list.md")
if have:
    print("\nCovered towns:")
    for h in have:
        print("  {} -> {}".format(h['name'], h['csv']))
if need[:5]:
    print("\nFirst 5 still needed:")
    for n in need[:5]:
        print("  {}".format(n['name']))
PYEOF