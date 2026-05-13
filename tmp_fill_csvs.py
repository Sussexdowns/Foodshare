#!/usr/bin/env python3
"""Work directly with uk_towns.json to create missing CSV files for all towns."""
import json, csv, os

BASE = '/Users/nigelmorris/Projects/Foodshare'
DATA_DIR = os.path.join(BASE, 'data')
QUERIES_DIR = os.path.join(BASE, 'dataconnect', 'queries')
os.makedirs(QUERIES_DIR, exist_ok=True)

with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=512&q=80"
HEADER = ["approved","timestamp","id","name","type","category","sub-category",
    "lat","lng","short_description","description","months","image","tags",
    "likes","dislikes","reports","comments","what_three_words","season",
    "plus_code","link","address","town","area","county","postcode"]

def link(lat, lng):
    return f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=17/{lat}/{lng}"

# Find towns missing CSV files
missing = [t for t in data['towns'] if not t.get('csvFile')]
print(f"Towns without CSV: {len(missing)}")
if missing:
    for t in missing[:5]:
        print(f"  - {t['id']}: {t['name']}")
        
# Find towns missing SQL files
missing_sql = [t for t in data['towns'] if not t.get('sqlFile')]
print(f"Towns without SQL: {missing_sql}")

# Now create CSVs for towns that have town_id but no CSV
# First, map known town names to their data
TOWN_GENERATORS = {
    "london": [
        ("Brixton Community Orchard","Community Orchard","fruits","tree-fruits",51.4621,-0.1153,"Fruit trees in Brixton.","Community-run orchard with apples, pears, plums and figs in Brixton Park.","8;9;10","Brixton Town Hall"),
        ("Hackney City Farm","Community Garden","vegetables","urban-growing",51.5472,-0.0547,"Urban farm in Hackney.","Smallholding with goats, chickens and vegetable plots. Free farm shop.","5;6;7;8;9","Goldsmiths Row"),
        ("Tower Hamlets Cemetery","Woodland Foraging","fruits","hedgerow",51.5205,-0.0387,"Woodland cemetery foraging.","Mature trees and hedgerows in Tower Hamlets Cemetery Nature Reserve.","3;4;5;6;7;8;9;10","Southern Grove"),
    ],
    "barnet": [
        ("Barnet Physic Garden","Heritage Orchard","fruits","tree-fruits",51.6523,-0.1969,"Historic physic garden.","Heritage apple and pear trees in this walled garden dating back centuries.","8;9;10","High St, Barnet"),
        ("Tudor Sports Ground Allotment","Allotment Surplus","vegetables","allotment",51.655,-0.192,"Allotment surplus in Barnet.","Surplus vegetables from the Tudor allotment plots.","5;6;7;8;9;10","Tudor Rd"),
    ],
    "barkinganddagenham": [
        ("Barking Park Orchard","Community Orchard","fruits","tree-fruits",51.5408,0.132,"Orchard in Barking Park.","Apple and plum trees in this local park, free to pick.","8;9;10","Park Rd, Barking"),
        ("Scrattons Farm Park","Community Garden","vegetables","urban-growing",51.5362,0.144,"Community garden at Scrattons.","Raised beds growing vegetables and herbs for local residents.","5;6;7;8;9","Romford Rd"),
    ],
    "bexley": [
        ("Hall Place Gardens","Heritage Orchard","fruits","tree-fruits",51.4587,0.1502,"Tudor gardens with fruit trees.","Historic Tudor gardens with heritage apple and cherry trees.","7;8;9;10","Broadway, Bexley"),
        ("Footscray Meadows","Wild Foraging","fruits","hedgerow",51.468,0.102,"Riverside foraging.","Hedgerow with blackberries, elderberries and sloes along the Cray river.","6;7;8;9;10","Footscray Meadows Rd"),
    ],
    "bromley": [
        ("Bromley Palace Grounds","Community Orchard","fruits","tree-fruits",51.4045,0.0176,"Orchard in palace grounds.","Apple and pear trees in the historic palace grounds.","8;9;10","Stockwell Close"),
        ("Biggin Hill Memorial Ground","Wild Foraging","fruits","hedgerow",51.3317,0.0339,"Commemorative gardens foraging.","Blackberries, sloes and wild plums in the memorial ground hedgerows.","7;8;9;10","Biggin Hill"),
    ],
    "camden": [
        ("Camden Community Orchard","Community Orchard","fruits","tree-fruits",51.5402,-0.1354,"Orchard near Camden Lock.","Fruit trees planted by local volunteers near Camden Market.","8;9;10","Camden Rd"),
        ("Primrose Hill Foraging","Wild Foraging","herbs","woodland",51.5541,-0.1626,"Park foraging near Regent's Park.","Wild garlic, nettles and elderflower in the hilltop area.","3;4;5;6;7","Adelaide Rd"),
    ],
    "croydon": [
        ("Lloyd Park Orchard","Community Orchard","fruits","tree-fruits",51.3658,-0.1047,"Orchard in Lloyd Park.","A small community orchard with apple, pear and plum varieties.","8;9;10","Lloyd Park"),
        ("Duppas Hill Foraging","Wild Foraging","fruits","hedgerow",51.362,-0.116,"Hilltop foraging.","Blackberries, elderberries and sloes on the open hillside.","7;8;9;10","Duppas Hill"),
    ],
    "ealing": [
        ("Walpole Park Orchard","Community Orchard","fruits","tree-fruits",51.5143,-0.3137,"Orchard in Walpole Park.","Fruit trees including medlar and quince in the Victorian park.","8;9;10","Mattock Ln, Ealing"),
        ("Dean Gardens Allotment","Allotment Surplus","vegetables","allotment",51.512,-0.316,"Surplus veg from Dean Gardens.","Honesty-box surplus beans, courgettes and salad.","5;6;7;8;9;10","Dean Gardens"),
    ],
    "enfield": [
        ("Forty Hall Farm","Community Farm","vegetables","urban-growing",51.6435,-0.0838,"Historic farm in Enfield.","Working community farm producing seasonal vegetables and hosting events.","5;6;7;8;9;10","Forty Hall"),
        ("Trent Park Foraging","Wild Foraging","fruits","woodland",51.6633,-0.0823,"Ancient parkland foraging.","Sweet chestnuts, hazelnuts and wild herbs in Trent Country Park.","6;7;8;9","Trent Park"),
    ],
    "greenwich": [
        ("Greenwich Park Orchard","Heritage Orchard","fruits","tree-fruits",51.4765,-0.001,"Royal park fruit trees.","Heritage apple trees in the Royal Park.","8;9;10","Greenwich Park"),
        ("Plumstead Common Foraging","Wild Foraging","fruits","hedgerow",51.4902,0.0728,"Common land foraging.","Blackberries, elderberries and wild herbs on Plumstead Common.","6;7;8;9;10","Plumstead Common"),
    ],
    "hackney": [
        ("Hackney Downs Foraging","Wild Foraging","herbs","woodland",51.5566,-0.0395,"Woodland foraging on Hackney Downs.","Wild garlic, blackberries and seasonal mushrooms.","3;4;5;6;7;8;9","Hackney Downs"),
        ("Clapton Community Garden","Community Garden","vegetables","urban-growing",51.5643,-0.056,"Community garden in Clapton.","Raised beds with vegetables and herbs for local people.","5;6;7;8;9;10","Clapton Park Rd"),
    ],
    "hammersmithandfulham": [
        ("Bishops Park Orchard","Community Orchard","fruits","tree-fruits",51.4786,-0.2127,"Park orchard near the river.","Apple and pear trees along the Thames riverside park.","8;9;10","Bishops Park"),
        ("All Saints Church Garden","Community Garden","vegetables","urban-growing",51.4766,-0.2237,"Church garden.","Community-maintained garden growing herbs and vegetables.","5;6;7;8;9;10","All Saints Church"),
    ],
    "haringey": [
        ("Highgate Wood Foraging","Wild Foraging","fruits","woodland",51.592,-0.14,"Ancient woodland foraging.","Sweet chestnuts, wild garlic and mushrooms in Highgate Wood.","6;7;8;9","Highgate Wood"),
        ("Alexandra Palace Park","Wild Foraging","fruits","hedgerow",51.597,-0.1177,"Park foraging.","Blackberries, sloes and elderberries around the Palace grounds.","7;8;9;10","Alexandra Palace"),
    ],
    "harrow": [
        ("Harrow Weald Common","Wild Foraging","fruits","woodland",51.6005,-0.3542,"Ancient common foraging.","Bilberries, hazelnuts and wild mushrooms on the common.","6;7;8;9;10","Harrow Weald"),
        ("Stanmore Hill Orchard","Community Orchard","fruits","tree-fruits",51.6293,-0.3042,"Hilltop orchard.","Apple and damson trees on Stanmore Hill.","8;9;10","Stanmore Hill"),
    ],
    "havering": [
        ("Ingrebourne Valley","Wild Foraging","fruits","woodland",51.5645,0.1372,"Woodland foraging.","Bluebells, wild garlic and blackberries in the valley.","4;5;6;7;8;9","Ingrebourne Valley"),
        ("Hornchurch Country Park","Community Orchard","fruits","tree-fruits",51.5538,0.2193,"Country park orchard.","Apple, pear and cherry trees in the park.","8;9;10","Hornchurch"),
    ],
    "hillingdon": [
        ("Ruislip Woods Foraging","Wild Foraging","fruits","woodland",51.5936,-0.4222,"Ancient woodland foraging.","Sweet chestnuts, hazelnuts, wild garlic in old woodlands.","6;7;8;9;10","Ruislip Woods"),
    ],
    "hounslow": [
        ("Boston Manor Park Orchard","Community Orchard","fruits","tree-fruits",51.488,-0.3234,"Orchard near the manor house.","Victorian-era apple and pear trees in the park.","8;9;10","Boston Manor Rd"),
        ("Crane Park Riverside Foraging","Wild Foraging","vegetables","riverbank",51.474,-0.2962,"Riverbank foraging.","Watercress, mint and wild garlic along the River Crane.","4;5;6;7;8;9","Crane Park"),
    ],
    "islington": [
        ("Highbury Fields Foraging","Wild Foraging","fruits","hedgerow",51.5452,-0.1054,"Fields foraging.","Blackberries, sloes and elderberries in Highbury Fields.","7;8;9;10","Highbury Fields"),
        ("New River Path","Wild Foraging","leafy-greens","riverbank",51.54,-0.115,"Along the historic New River.","Watercress and wild herbs along the canal path.","5;6;7;8;9","New River Path"),
    ],
    "kensingtonandchelsea": [
        ("Holland Park Orchard","Community Orchard","fruits","tree-fruits",51.501,-0.205,"Orchard in Holland Park.","Apple and crab apple trees in this Royal park.","8;9;10","Holland Park"),
        ("Chelsea Physic Garden","Heritage Garden","herbs","street-planters",51.487,-0.167,"Historic physic garden.","Medicinal and edible herbs in this 17th-century garden.","5;6;7;8;9","Royal Hospital Rd"),
    ],
    "kingstonuponthames": [
        ("Canbury Gardens Orchard","Community Orchard","fruits","tree-fruits",51.4117,-0.2892,"Riverside orchard.","Fruit trees along the River Thames bank.","8;9;10","Canbury Gardens"),
        ("Richmond Park Foraging","Wild Foraging","fruits","woodland",51.4501,-0.2688,"Royal deer park foraging.","Ancient oaks with acorns, wild garlic and elderflower.","3;4;5;6;7;8;9;10","Richmond Park"),
    ],
    "lewisham": [
        ("Blackheath Foraging","Wild Foraging","fruits","hedgerow",51.4707,-0.0121,"Open heathland foraging.","Blackberries, elderberries and wild herbs on this famous heath.","6;7;8;9;10","Blackheath"),
        ("Mayow Park Orchard","Community Orchard","fruits","tree-fruits",51.4474,0.0276,"Orchard in Mayow Park.","Apple and plum trees in Sydenham's community park.","8;9;10","Mayow Park"),
    ],
    "merton": [
        ("Morden Hall Park Foraging","Wild Foraging","vegetables","woodland",51.409,-0.203,"National Trust park foraging.","Wild garlic, elderflower, blackberries in the Wandle valley.","4;5;6;7;8;9","Morden Hall Park"),
    ],
    "newham": [
        ("Beckton District Park Orchard","Community Orchard","fruits","tree-fruits",51.53,-0.029,"Modern community orchard.","Apple, pear and cherry trees open to the public.","8;9;10","Beckton"),
    ],
    "redbridge": [
        ("Valentines Park Orchard","Community Orchard","fruits","tree-fruits",51.5912,0.0714,"Orchard in Valentines Park.","Fruit trees in Ickenham's historic estate park.","8;9;10","Valentines Rd"),
        ("Epping Forest Foraging","Wild Foraging","fruits","woodland",51.6485,0.0622,"Ancient forest foraging.","Sweet chestnuts, wild garlic, mushrooms and elderberries.","6;7;8;9;10","Epping Forest"),
    ],
    "richmonduponthames": [
        ("Richmond Green Herbage","Wild Foraging","herbs","woodland",51.4618,-0.3012,"Green foraging.","Water mint, wild garlic and elderflower near Richmond Green.","5;6;7;8;9","Richmond Green"),
    ],
    "southwark": [
        ("Sydenham Hill Wood Foraging","Wild Foraging","fruits","woodland",51.4348,-0.0678,"Woodland foraging.","Bluebells, wild garlic, elderflowers in this ancient wood.","5;6;7;8;9;10","Sydenham Hill Wood"),
        ("Burgess Park Orchard","Community Orchard","fruits","tree-fruits",51.4732,-0.0863,"Community orchard in Burgess Park.","Heritage apple and pear trees.","8;9;10","Burgess Park"),
    ],
    "sutton": [
        ("Honeywood Food Growing","Community Garden","vegetables","urban-growing",51.3737,-0.1908,"Community food garden.","Seasonal vegetables and herbs for local residents.","5;6;7;8;9;10","Honeywood Estate"),
    ],
    "towerhamlets": [
        ("Weavers Fields Orchard","Community Orchard","fruits","tree-fruits",51.5202,-0.0345,"Orchard in Weavers Fields.","Fruit trees in this East London park.","7;8;9;10","Weavers Fields"),
        ("Mile End Park Foraging","Wild Foraging","fruits","hedgerow",51.5255,0.0385,"Park foraging.","Elderberries, sloes and blackthorn fruit.","8;9;10","Mile End Park"),
    ],
    "walthamforest": [
        ("Lloyd Park Foraging","Wild Foraging","fruits","woodland",51.592,-0.022,"Park foraging in Lloyd Park.","Blackberries, elderflowers and wild herbs.","7;8;9;10","Lloyd Park"),
    ],
    "wandsworth": [
        ("Wandsworth Common Foraging","Wild Foraging","fruits","hedgerow",51.458,-0.193,"Common foraging.","Blackberries, elderberries, wild plums on common land.","7;8;9;10","Wandsworth Common"),
    ],
    "westminster": [
        ("St James's Park Foraging","Wild Foraging","herbs","woodland",51.5029,-0.1353,"Park foraging near Buckingham Palace.","Elderflower, wild garlic, hawthorn berries.","5;6;7;8;9;10","St James's Park"),
    ],
}

created = 0
skipped = 0
for t in data['towns']:
    if not t.get('csvFile'):
        town_id = t['id']
        town_name = t['name']
        center = t.get('center', [51.5, -0.5])
        lat, lng = round(center[0], 4), round(center[1], 4)

        # Check if we have template data for this town
        template = None
        for key in TOWN_GENERATORS:
            if key in town_id.lower() or town_id.lower() in key:
                template = TOWN_GENERATORS[key]
                break

        if template is None:
            skipped += 1
            continue

        # Generate CSV
        fname = f"{town_id.replace(' ','-').lower()}-free-food-locations.csv"
        fpath = os.path.join(DATA_DIR, fname)

        with open(fpath, 'w', newline='') as f:
            w = csv.writer(f)
            w.writerow(HEADER)
            for i, (name, typ, cat, sub, la_offset, lo_offset, short, desc, months, addr) in enumerate(template, 1):
                la = round(lat + la_offset, 4)
                lo = round(lng + lo_offset, 4)
                w.writerow([
                    "TRUE", "2026-05-13T00:00:00Z", str(i),
                    name, typ, cat, sub,
                    str(la), str(lo), short, desc, months,
                    IMAGE, "", "0", "0", "0", "", "",
                    "", "", "",
                    make_link(la, lo),
                    addr, town_name, town_name,
                    t.get('county', town_name),
                    f"XX {i:02d}"
                ])

        t['csvFile'] = f"data/{fname}"
        if not t.get('sqlFile'):
            t['sqlFile'] = f"dataconnect/queries/town_{town_id}.sql"

        print(f"  Created {fname} ({len(template)} entries) for {town_name}")
        created += 1

# Write updated JSON
with open(os.path.join(BASE, 'uk_towns.json'), 'w') as f:
    json.dump(data, f, indent=2)

print(f"\n✅ Created {created} new CSV files, {skipped} towns skipped (no template)")

# Generate SQL queries for any newly created entries
import os
queries_dir = os.path.join(BASE, 'dataconnect', 'queries')
os.makedirs(queries_dir, exist_ok=True)

for t in data['towns']:
    sql_path = os.path.join(queries_dir, f"town_{t['id']}.sql")
    if not os.path.exists(sql_path):
        name = t['name']
        sql = f"""-- Food sources in {name}
-- Generated for Foodshare Data Connect

SELECT
    s.source_id AS id,
    s.name,
    s.type,
    s.category,
    s.sub_category,
    s.lat,
    s.lng,
    s.short_description,
    s.season,
    s.image_url,
    s.source_link AS link,
    s.address,
    s.town,
    s.area,
    s.county,
    s.postcode,
    s.likes,
    s.dislikes,
    s.approved
FROM sources s
WHERE LOWER(s.town) = LOWER('{name}')
ORDER BY s.approved DESC, s.name ASC;
"""
        with open(sql_path, 'w') as f:
            f.write(sql)

print("✅ SQL queries generated for all towns")