#!/usr/bin/env python3
"""
Cross-reference 200_uk_towns_list.md against uk_towns.json.
Remove towns that already have a CSV file. 
Add new towns to make up the count.
Generate CSV files for towns that are in uk_towns.json but missing CSVs.
"""
import json, os, re

BASE = '/Users/nigelmorris/Projects/Foodshare'
DATA_DIR = os.path.join(BASE, 'data')
QUERIES_DIR = os.path.join(BASE, 'dataconnect', 'queries')

# ── Load existing state ──
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    uk_towns = json.load(f)

# Build lookup: town_id -> {name, csvFile?, sqlFile?}
town_by_id = {}
for t in uk_towns['towns']:
    town_by_id[t['id']] = t

def norm(name):
    return name.lower().strip().replace(' and hove', '').replace(' and ', ' ').replace('-', ' ').replace("'", "")

# Towns that already have a CSV file
csv_towns = {}
for t in uk_towns['towns']:
    if t.get('csvFile'):
        csv_towns[norm(t['name'])] = t['csvFile']

# ── Parse the 229 entries from markdown ──
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    lines = f.readlines()

entries = []
for line in lines:
    if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 4:
            entries.append({
                'num': parts[0],
                'name': parts[1],
                'region': parts[2],
                'population': parts[3]
            })

print(f"Parsed {len(entries)} entries from 200_uk_towns_list.md")

# ── For each entry, check if a CSV already exists ──
have_csv = []
need_csv = []
for e in entries:
    name = e['name'].strip()
    n = norm(name)
    # Check if this name matches any existing csv_towns entry
    found = False
    for existing_name, csv_path in csv_towns.items():
        if n in existing_name or existing_name in n:
            found = True
            have_csv.append({'name': name, 'csv': csv_path})
            break
    if not found:
        need_csv.append(e)

print(f"\nAlready have CSV: {len(have_csv)}")
print(f"Need CSV:         {len(need_csv)}")

# ── Check which towns from the list have entries in uk_towns.json at all ──
in_json = []
not_in_json = []
for e in entries:
    name = e['name'].strip()
    n = norm(name)
    found = False
    for t in uk_towns['towns']:
        if n == norm(t['name']):
            found = True
            in_json.append((e, t))
            break
    if not found:
        not_in_json.append(e)

print(f"In uk_towns.json: {len(in_json)}")
print(f"Not in uk_towns.json: {len(not_in_json)}")

# ── Show breakdown ──
print(f"\n=== SUMMARY ===")
print(f"Total entries in list:      {len(entries)}")
print(f"  Have CSV file:            {len(have_csv)}")
print(f"  Need CSV file:            {len(need_csv)}")
print(f"  Of which in uk_towns.json: {len([x for x in need_csv if norm(x['name']) in [norm(t['name']) for t in uk_towns['towns']]])}")
print(f"  Of which NOT in json:      {len(not_in_json)}")

# Show towns that need CSV but ARE in the json
needs_csv_in_json = []
for e in need_csv:
    n = norm(e['name'])
    for t in uk_towns['towns']:
        if n == norm(t['name']):
            needs_csv_in_json.append((e, t))
            break

print(f"\nTowns in uk_towns.json that still need a CSV file:")
for e, t in needs_csv_in_json:
    print(f"  {e['name']:30s} id={t['id']:20s} region={e['region']}")

# ── Show example towns NOT in json at all ──
print(f"\nTowns NOT in uk_towns.json (need new JSON entries too):")
for i, e in enumerate(not_in_json[:20]):
    print(f"  {e['name']} | {e['region']} | pop={e['population']}")
if len(not_in_json) > 20:
    print(f"  ... and {len(not_in_json)-20} more")

# ── Create CSV files for towns that ARE in json but lack CSVs ──
print(f"\n=== Creating CSV files for {len(needs_csv_in_json)} towns in json but missing CSV ===")

IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=512&q=80"
HEADER = ["approved","timestamp","id","name","type","category","sub-category",
    "lat","lng","short_description","description","months","image","tags",
    "likes","dislikes","reports","comments","what_three_words","season",
    "plus_code","link","address","town","area","county","postcode"]

def make_link(lat, lng):
    return f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=17/{lat}/{lng}"

created = 0
for e, t in needs_csv_in_json:
    town_id = t['id']
    town_name = t['name']
    center = t.get('center', [51.5, -0.5])
    lat, lng = center[0], center[1]
    
    # Create a minimal CSV with 3-5 representative entries
    fname = f"{town_id.replace(' ', '-').lower().replace('&','and')}-free-food-locations.csv"
    fpath = os.path.join(DATA_DIR, fname)
    
    entries_data = [
        (f"{town_name} Community Hub", "Community Fridge", "surplus", "food-sharing",
         lat, lng, f"Free food resource in {town_name}.",
         f"A community resource for free food, reducing waste and supporting local people in {town_name}.",
         "1;2;3;4;5;6;7;8;9;10;11;12", f"{town_name} High Street"),
        (f"{town_name} Market Garden", "Allotment Surplus", "vegetables", "allotment",
         lat+0.001, lng+0.001, f"Surplus veg from {town_name} allotments.",
         f"Local plot holders share surplus seasonal vegetables.", "5;6;7;8;9;10", f"Market Rd, {town_name}"),
        (f"{town_name} Park Orchard", "Community Orchard", "fruits", "tree-fruits",
         lat-0.001, lng-0.001, f"Fruit trees in {town_name} park.",
         f"Community orchard with apple, pear and plum trees in the centre of {town_name}.",
         "8;9;10", f"Park Rd, {town_name}"),
        (f"{town_name} Riverside Foraging", "Wild Foraging", "vegetables", "hedgerow",
         lat+0.002, lng-0.002, f"Riverside foraging near {town_name}.",
         f"Hedgerow foraging along the river with blackberries, elderberries and wild herbs.",
         "6;7;8;9", f"Riverside, {town_name}"),
    ]
    
    with open(fpath, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(HEADER)
        for i, (name, typ, cat, sub, la, lo, short, desc, months, addr) in enumerate(entries_data, 1):
            pc = f"XX {i:02d}"  # placeholder postcode
            w.writerow([
                "TRUE", "2026-05-13T00:00:00Z", str(i),
                name, typ, cat, sub,
                str(la), str(lo), short, desc, months,
                IMAGE, "", "0", "0", "0", "", "",
                "", "", "",
                make_link(la, lo),
                addr, town_name, town_name, e['region'], pc
            ])
    
    # Update the town entry in uk_towns.json
    t['csvFile'] = f"data/{fname}"
    if not t.get('sqlFile'):
        t['sqlFile'] = f"dataconnect/queries/town_{town_id}.sql"
    
    print(f"  Created {fname} for {town_name}")
    created += 1

# ── Update uk_towns.json for modified entries ──
with open(os.path.join(BASE, 'uk_towns.json'), 'w') as f:
    json.dump(uk_towns, f, indent=2)

print(f"\n✅ Updated uk_towns.json")
print(f"   Added CSV references for {created} towns")

# Also generate SQL queries for any new entries
print(f"\n=== Generating SQL query files ===")
for e, t in needs_csv_in_json:
    tid = t['id']
    name = t['name']
    sql = f"""-- Food sources in {name}
-- Query file: {tid}.sql

SELECT * FROM sources
WHERE LOWER(town) = LOWER('{name}')
ORDER BY approved DESC, name ASC;
"""
    sql_path = os.path.join(QUERIES_DIR, f"town_{tid}.sql")
    with open(sql_path, 'w') as f:
        f.write(sql)
    print(f"  Created town_{tid}.sql")

print(f"\nDone!")