import json, os

BASE = '/Users/nigelmorris/Projects/Foodshare'

# Check what CSV files actually exist in data/
csv_files = {}
for f in os.listdir(os.path.join(BASE, 'data')):
    if f.endswith('.csv'):
        # Extract town name from filename
        name = f.replace('-free-food-locations.csv', '').replace('_free_food_locations.csv', '').replace('-', ' ').replace('_', ' ')
        csv_files[name.lower()] = f

# From JSON
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

json_csv = {}
for t in data['towns']:
    if t.get('csvFile'):
        name = t['name'].lower()
        json_csv[name] = t['csvFile']
        if ' and ' in name:
            parts = name.split(' and ')
            for p in parts:
                json_csv[p.strip()] = t['csvFile']

print("{} CSV files in data/".format(len(csv_files)))
print("{} town names with CSV in json".format(len(json_csv)))
print()

# Test matching
tests = ['Brighton', 'Blackburn', 'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Bristol',
         'Cambridge', 'Canterbury', 'Cardiff', 'Carlisle', 'Chelmsford', 'Bexhill',
         'Haywards Heath', 'Burgess Hill', 'Heathfield']

for t in tests:
    tl = t.lower()
    in_json = tl in json_csv
    in_fs = tl in csv_files
    print("  {}: json={} fs={}".format(t, in_json, in_fs))

# Now check the 200 list properly
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

# Skip header and parse table
entries = []
for line in lines:
    if line.startswith('| ') and not any(line.startswith(x) for x in ['| #', '|---', '| Town', '| T']):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'name': parts[1], 'region': parts[2], 'pop': parts[3]})

have = []
need = []
for e in entries:
    name = e['name'].lower().replace('on-sea', 'on sea')
    key = None
    # Try various matching strategies
    if name in json_csv:
        key = name
    elif name in csv_files:
        key = name
    else:
        # Try partial
        for k in json_csv:
            if name in k or k in name:
                key = k
                break
        if key is None:
            for k in csv_files:
                if name in k or k in name:
                    key = k
                    break

    if key:
        e['csv'] = json_csv.get(key, csv_files.get(key, '?'))
        have.append(e)
    else:
        need.append(e)

print("\n{} matched from {} entries".format(len(have), len(entries)))
print("{} still need CSVs".format(len(need)))
if have:
    print("\nMatched:")
    for h in have[:5]:
        print("  {} -> {}".format(h['name'], h['csv']))
if need:
    print("\nStill needed (first 5):")
    for n in need[:5]:
        print("  {}".format(n['name']))
PYEOF