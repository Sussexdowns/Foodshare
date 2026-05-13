import json, os

BASE = '/Users/nigelmorris/Projects/Foodshare'

with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

print("All towns with CSV files in uk_towns.json:")
for t in data['towns']:
    if t.get('csvFile'):
        print("  '{}' -> {}".format(t['name'], t['csvFile']))

# Load the 200 list
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    content = f.read()

lines = content.split('\n')
entries = []
for line in lines:
    if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---') and not line.startswith('| ---'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({'name': parts[1]})

# Test matching
json_names = [t['name'].lower() for t in data['towns'] if t.get('csvFile')]
csv_town_map = {}
for t in data['towns']:
    if t.get('csvFile'):
        csv_town_map[t['name'].lower()] = t['csvFile']

# Check specific names
test_names = ['Brighton', 'Blackburn', 'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Bristol']
for name in test_names:
    nl = name.lower()
    found = nl in csv_town_map
    print("  '{}' in json csv_towns: {}".format(name, found))

print("\nFirst 5 entries from 200 list: {}".format([e['name'] for e in entries[:5]]))
print("Total entries parsed: {}".format(len(entries)))
print("Total csv towns in json: {}".format(len(json_names)))