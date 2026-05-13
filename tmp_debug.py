#!/usr/bin/env python3
import json

BASE = '/Users/nigelmorris/Projects/Foodshare'

with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

# Show all town names and their CSV files
print("All towns with CSV files in uk_towns.json:")
for t in data['towns']:
    if t.get('csvFile'):
        print(f"  '{t['name']}' -> {t['csvFile']}")

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

# Check specific matches
target_names = ['Brighton', 'Blackburn', 'Blackpool', 'Bolton', 'Bournemouth', 'Bradford',
                'Bristol', 'Cambridge', 'Canterbury', 'Cardiff', 'Carlisle', 'Chelmsford']

for e in entries:
    if e['name'] in target_names:
        found = any(e['name'].lower() == t['name'].lower() or e['name'].lower() in t['name'].lower()
                    for t in data['towns'] if t.get('csvFile'))
        print(f"  '{e['name']}' matched in json: {found}")

# Show first 5 entry names
print(f"\nFirst 5 entry names: {[e['name'] for e in entries[:5]]}")
print(f"First 5 json names: {[t['name'] for t in data['towns'][:5] if t.get('csvFile')]}")
PYEOF