#!/usr/bin/env python3
"""Merge new towns from 200 list into uk_towns.json with countyId, then sort by county and town."""
import json, os, csv, random
from collections import defaultdict

BASE = '/Users/nigelmorris/Projects/Foodshare'

# Load existing data
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    uk_towns = json.load(f)

with open(os.path.join(BASE, 'uk_counties.json')) as f:
    uk_counties = json.load(f)

# Build existing town name lookup (normalized)
existing_names = set()
for t in uk_towns['towns']:
    existing_names.add(t['name'].lower().strip())

# Parse 200_uk_towns_list.md to get all towns with region info
entries = []
with open(os.path.join(BASE, 'data/200_uk_towns_list.md')) as f:
    for line in f:
        if line.startswith('| ') and not line.startswith('| #') and not line.startswith('|---'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) >= 4:
                name = parts[1]
                region = parts[2]
                entries.append({'name': name, 'region': region})

print(f"Parsed {len(entries)} towns from 200_uk_towns_list.md")

# Build region -> county_id mapping
# Normalize county names for matching
county_id_by_name = {}
for c in uk_counties['counties']:
    name_lower = c['name'].lower()
    county_id_by_name[name_lower] = c['id']

# Create a mapping from region/area names to county IDs based on known relationships
REGION_TO_COUNTY = {
    # England - direct matches
    "west midlands": "west_midlands",
    "greater manchester": "greater_manchester",
    "merseyside": "merseyside",
    "tyne and wear": "tyne_and wear",
    "south yorkshire": "south_yorkshire",
    "west yorkshire": "west_yorkshire",
    "lancashire": "lancashire",
    "cumbria": "cumbria",
    "cheshire": "cheshire",
    "derbyshire": "derbyshire",
    "nottinghamshire": "nottinghamshire",
    "staffordshire": "staffordshire",
    "warwickshire": "warwickshire",
    "leicestershire": "leicestershire",
    "northamptonshire": "northamptonshire",
    "cambridgeshire": "cambridgeshire",
    "norfolk": "norfolk",
    "suffolk": "suffolk",
    "essex": "essex",
    "hertfordshire": "hertfordshire",
    "bedfordshire": "bedfordshire",
    "buckinghamshire": "buckinghamshire",
    "oxfordshire": "oxfordshire",
    "gloucestershire": "gloucestershire",
    "wiltshire": "wiltshire",
    "sommer set": "somerset",  # handle spacing
    "somerset": "somerset",
    "dorset": "dorset",
    "devon": "devon",
    "cornwall": "cornwall",
    "kent": "kent",
    "east sussex": "east_sussex",
    "west sussex": "west_sussex",
    "surrey": "surrey",
    "berkshire": "berkshire",
    "hampshire": "hampshire",
    "isle of wight": "isle_of_wight",
    "northumberland": "northumberland",
    "county durham": "county_durham",
    "north yorkshire": "north_yorkshire",
    "east riding of yorkshire": "east_riding",  # not in list; use approximation
    "rutland": "rutland",
    "shropshire": "shropshire",
    "herefordshire": "herefordshire",
    "worcestershire": "worcestershire",
    "greater london": "greater_london",
    # Welsh counties
    "gwynedd": "gwynedd",  # if present
    "dyfed": "dyfed",  # historic
    "south glamorgan": "south_glamorgan",  # if present
    "mid glamorgan": "mid_glamorgan",
    "west glamorgan": "west_glamorgan",
    "gwent": "gwent",
    "clwyd": "clwyd",
    # Scotland - not in uk_counties.json (historic/ceremonial only)
    "scotland": None,
    "angus": None,
    "dumfries and galloway": None,
    "fife": None,
    "highland": None,
    "perth and kinross": None,
    "south lanarkshire": None,
    "north lanarkshire": None,
    "scottish borders": None,
    # Northern Ireland
    "northern ireland": None,
    # Other
    "north east lincolnshire": None,
    "north lincolnshire": None,
}

# We need a more robust mapping: for each region in the entries, assign the most appropriate county_id
# Let's derive it from the uk_counties list by fuzzy matching on name
def find_county_id(region_name):
    r = region_name.lower().strip()
    # Try exact match first
    if r in county_id_by_name:
        return county_id_by_name[r]
    # Try partial match
    for cn, cid in county_id_by_name.items():
        if r in cn or cn in r:
            return cid
    # Use the REGION_TO_COUNTY mapping
    if r in REGION_TO_COUNTY:
        return REGION_TO_COUNTY[r]
    # Try without spaces/hyphens variations
    norm_r = r.replace(' and ', ' & ').replace('-', ' ')
    for cn, cid in county_id_by_name.items():
        norm_cn = cn.replace(' and ', ' & ').replace('-', ' ')
        if norm_r == norm_cn or norm_r in norm_cn or norm_cn in norm_r:
            return cid
    # Return None for unmappable (Scotland, Wales, NI, etc.)
    return None

# Identify new towns to add
new_towns = []
for e in entries:
    name = e['name'].strip()
    if name.lower() not in existing_names:
        region = e['region'].strip()
        county_id = find_county_id(region)
        new_towns.append({
            'name': name,
            'region': region,
            'county_id': county_id,
        })

print(f"Towns to add: {len(new_towns)}")
unmapped = [t for t in new_towns if t['county_id'] is None]
print(f"Unmapped counties (need manual mapping): {len(unmapped)}")
for t in unmapped[:20]:
    print(f"  {t['name']:30s} region={t['region']}")

# For unmapped towns in Wales/Scotland/NI, we'll need to either skip or assign to a nearest county
# For now, let's skip assigning countyId to those (or use None)
