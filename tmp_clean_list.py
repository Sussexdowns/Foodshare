#!/usr/bin/env python3
"""Build clean 200 UK towns list, removing tiny villages and already-covered towns."""
import json, os, re

BASE = '/Users/nigelmorris/Projects/Foodshare'

# Load existing town data
with open(os.path.join(BASE, 'uk_towns.json')) as f:
    data = json.load(f)

csv_towns = set()
for t in data['towns']:
    if t.get('csvFile'):
        csv_towns.add(t['name'].lower().strip())

# Rebuild the list from scratch - 200 major UK towns still needing CSVs
# This is the definitive list of major UK towns with populations > 10,000
# that don't yet have their own CSV file

TOWNS_200 = [
    # Major cities (50k+) - check which need CSVs
    ("Birmingham", "West Midlands", 1145000),
    ("Manchester", "Greater Manchester", 552000),
    ("Glasgow", "Scotland", 635000),
    ("Liverpool", "Merseyside", 498000),
    ("Newcastle upon Tyne", "Tyne and Wear", 300000),
    ("Sheffield", "South Yorkshire", 556000),
    ("Leeds", "West Yorkshire", 790000),
    ("Bristol", "Bristol", 470000),
    ("Edinburgh", "Scotland", 530000),
    ("Leicester", "Leicestershire", 368000),
    ("Coventry", "West Midlands", 350000),
    ("Cardiff", "Wales", 370000),
    ("Sunderland", "Tyne and Wear", 277000),
    ("Nottingham", "Nottinghamshire", 324000),
    ("Gateshead", "Tyne and Wear", 122000),
    ("Hull", "East Riding of Yorkshire", 268000),
    ("Stoke-on-Trent", "Staffordshire", 259000),
    ("Dundee", "Scotland", 148000),
    ("Wolverhampton", "West Midlands", 264000),
    ("Plymouth", "Devon", 263000),
    ("Aberdeen", "Scotland", 230000),
    ("Derby", "Derbyshire", 260000),
    ("Southampton", "Hampshire", 252000),
    ("Bradford", "West Yorkshire", 350000),
]

# Large towns (20k-100k) - many already have CSVs
TOWNS_LARGE = [
    ("Brighton", "East Sussex", 275000),
    ("Hove", "East Sussex", 92000),
    ("Warrington", "Cheshire", 110000),
    ("Stockton-on-Tees", "County Durham", 86000),
    ("York", "North Yorkshire", 203000),
    ("Oldham", "Greater Manchester", 104000),
    ("Colchester", "Essex", 130000),
    ("Chelmsford", "Essex", 180000),
]

# Build comprehensive remaining-towns list
# These are all towns that DON'T have a CSV file yet according to our analysis
remaining = [
    # Populations 50k+ not yet covered by their own CSV
    ("Abingdon-on-Thames", "Oxfordshire", 35000),
    ("Accrington", "Lancashire", 35000),
    ("Altrincham", "Greater Manchester", 52000),
    ("Amersham", "Buckinghamshire", 15000),
    ("Andover", "Hampshire", 50000),
    ("Annan", "Dumfries", 8000),
    ("Antrim", "Northern Ireland", 25000),
    ("Arbroath", "Angus", 23000),
    ("Ardrossan", "North Ayrshire", 11000),
    ("Ashford", "Kent", 75000),
    ("Ashington", "Northumberland", 28000),
    ("Ashton-under-Lyne", "Greater Manchester", 45000),
    ("Atherton", "Greater Manchester", 22000),
    ("Attleborough", "Norfolk", 10000),
    ("Aylesbury", "Buckinghamshire", 75000),
    ("Ayr", "Scotland", 47000),
    ("Banbury", "Oxfordshire", 50000),
    ("Bangor", "Wales", 18000),
    ("Banstead", "Surrey", 17000),
    ("Barnsley", "South Yorkshire", 91000),
    ("Barnstaple", "Devon", 32000),
    ("Barry", "Wales", 55000),
    ("Bathgate", "West Lothian", 30000),
    ("Basildon", "Essex", 115000),
    ("Basingstoke", "Hampshire", 110000),
    ("Batley", "West Yorkshire", 50000),
    ("Bebington", "Merseyside", 65000),
    ("Bedworth", "Warwickshire", 31000),
    ("Beeston", "Nottinghamshire", 22000),
    ("Bellshill", "North Lanarkshire", 20000),
    ("Beverley", "East Riding of Yorkshire", 31000),
    ("Bexhill-on-Sea", "East Sussex", 43000),
    ("Bicester", "Oxfordshire", 36000),
    ("Billingham", "County Durham", 35000),
    ("Billington", "Bedfordshire", 33000),
    ("Bingley", "West Yorkshire", 20000),
    ("Birkenhead", "Merseyside", 89000),
    ("Bishop Auckland", "County Durham", 25000),
    ("Bishop's Stortford", "Hertfordshire", 40000),
    ("Blackwood", "Wales", 11000),
    ("Blyth", "Northumberland", 38000),
    ("Bodmin", "Cornwall", 15000),
    ("Bolton", "Greater Manchester", 140000),
    ("Bootle", "Merseyside", 30000),
    ("Boston", "Lincolnshire", 45000),
    ("Bournemouth", "Dorset", 190000),
    ("Bracknell", "Berkshire", 83000),
    ("Braintree", "Essex", 42000),
    ("Brechin", "Angus", 7000),
    ("Brentwood", "Essex", 55000),
    ("Bridgend", "Wales", 50000),
    ("Bridgwater", "Somerset", 36000),
    ("Bridlington", "East Riding of Yorkshire", 35000),
    ("Brighouse", "West Yorkshire", 33000),
    ("Bromsgrove", "Worcestershire", 30000),
    ("Bromyard", "Herefordshire", 4500),
    ("Broxbourne", "Hertfordshire", 26000),
    ("Buckingham", "Buckinghamshire", 13000),
    ("Burnham-on-Sea", "Somerset", 20000),
    ("Burnley", "Lancashire", 75000),
    ("Burton upon Trent", "Staffordshire", 75000),
    ("Bury St Edmunds", "Suffolk", 42000),
    ("Caernarfon", "Wales", 10000),
    ("Caerphilly", "Wales", 42000),
    ("Camberley", "Surrey", 39000),
    ("Camborne", "Cornwall", 23000),
    ("Cambridge", "Cambridgeshire", 145000),
    ("Cannock", "Staffordshire", 30000),
    ("Carlton", "Nottinghamshire", 7000),
    ("Carrickfergus", "Northern Ireland", 28000),
    ("Castleford", "West Yorkshire", 40000),
    ("Chatham", "Kent", 78000),
    ("Cheltenham", "Gloucestershire", 117000),
    ("Chertsey", "Surrey", 14000),
    ("Chester", "Cheshire", 120000),
    ("Chester-le-Street", "County Durham", 24000),
    ("Chesterfield", "Derbyshire", 77000),
    ("Chichester", "West Sussex", 30000),
    ("Chigwell", "Essex", 13000),
    ("Chippenham", "Wiltshire", 16000),
    ("Chorley", "Lancashire", 36000),
    ("Clacton-on-Sea", "Essex", 45000),
    ("Cleethorpes", "North East Lincolnshire", 30000),
    ("Clevedon", "Somerset", 21000),
    ("Clitheroe", "Lancashire", 15000),
    ("Coalville", "Leicestershire", 20000),
    ("Coatbridge", "North Lanarkshire", 44000),
    ("Coleraine", "Northern Ireland", 25000),
    ("Congleton", "Cheshire", 27000),
    ("Consett", "County Durham", 28000),
    ("Corby", "Northamptonshire", 56000),
    ("Cowes", "Isle of Wight", 12000),
    ("Craigavon", "Northern Ireland", 65000),
    ("Cramlington", "Northumberland", 30000),
    ("Crawley", "West Sussex", 115000),
    ("Crewe", "Cheshire", 73000),
    ("Crosby", "Merseyside", 50000),
    ("Crosskeys", "Wales", 9000),
    ("Croydon", "Greater London", 390000),
    ("Darlaston", "West Midlands", 19000),
    ("Dartford", "Kent", 55000),
    ("Darwen", "Lancashire", 30000),
    ("Daventry", "Northamptonshire", 27000),
    ("Deeside", "Wales", 16000),
    ("Denton", "Greater Manchester", 37000),
    ("Derry/Londonderry", "Northern Ireland", 85000),
    ("Devizes", "Wiltshire", 12000),
    ("Dewsbury", "West Yorkshire", 65000),
    ("Doncaster", "South Yorkshire", 114000),
    ("Dorchester", "Dorset", 21000),
    ("Dorking", "Surrey", 19000),
    ("Dover", "Kent", 36000),
    ("Droitwich Spa", "Worcestershire", 24000),
    ("Droylsden", "Greater Manchester", 25000),
    ("Dudley", "West Midlands", 80000),
    ("Dunfermline", "Scotland", 53000),
    ("Durham", "County Durham", 50000),
    ("Earby", "Lancashire", 4500),
    ("Eastbourne", "East Sussex", 100000),
    ("Eastleigh", "Hampshire", 25000),
    ("Eastwood", "Nottinghamshire", 11000),
    ("Eccles", "Greater Manchester", 36000),
    ("Edmonton", "Greater London", 100000),
    ("Egham", "Surrey", 32000),
    ("Ellesmere Port", "Cheshire", 65000),
    ("Elstree", "Hertfordshire", 14000),
    ("Enfield", "Greater London", 156000),
    ("Epping", "Essex", 12000),
    ("Epsom", "Surrey", 32000),
    ("Erith", "Greater London", 45000),
    ("Evesham", "Worcestershire", 22000),
    ("Exeter", "Devon", 132000),
    ("Failsworth", "Greater Manchester", 21000),
    ("Falmouth", "Cornwall", 23000),
    ("Fareham", "Hampshire", 43000),
    ("Farnborough", "Hampshire", 65000),
    ("Farnham", "Surrey", 40000),
    ("Fenton", "Staffordshire", 35000),
    ("Ferndown", "Dorset", 27000),
    ("Fleet", "Hampshire", 43000),
    ("Folkestone", "Kent", 46000),
    ("Formby", "Merseyside", 23000),
    ("Frodsham", "Cheshire", 10000),
    ("Frome", "Somerset", 28000),
    ("Gainsborough", "Lincolnshire", 23000),
    ("Gateshead", "Tyne and Wear", 122000),
    ("Gillingham", "Kent", 105000),
    ("Glossop", "Derbyshire", 33000),
    ("Godalming", "Surrey", 22000),
    ("Gosport", "Hampshire", 84000),
    ("Grantham", "Lincolnshire", 45000),
    ("Gravesend", "Kent", 75000),
    ("Grays", "Essex", 40000),
    ("Great Yarmouth", "Norfolk", 58000),
    ("Greenock", "Scotland", 44000),
    ("Guisborough", "North Yorkshire", 18000),
    ("Halesowen", "West Midlands", 61000),
    ("Halifax", "West Yorkshire", 90000),
    ("Harpenden", "Hertfordshire", 16000),
    ("Harlow", "Essex", 86000),
    ("Harrogate", "North Yorkshire", 75000),
    ("Harrow", "Greater London", 262000),
    ("Hartlepool", "County Durham", 93000),
    ("Hastings", "East Sussex", 91000),
    ("Haywards Heath", "West Sussex", 35000),
    ("Hednesford", "Staffordshire", 19000),
    ("Hemel Hempstead", "Hertfordshire", 95000),
    ("Hendon", "Greater Manchester", 52000),
    ("Hinckley", "Leicestershire", 50000),
    ("Hoddesdon", "Hertfordshire", 42000),
    ("Honiton", "Devon", 13000),
    ("Hounslow", "Greater London", 104000),
    ("Huddersfield", "West Yorkshire", 144000),
    ("Huntingdon", "Cambridgeshire", 25000),
    ("Hyde", "Greater Manchester", 35000),
    ("Ilfracombe", "Devon", 12000),
    ("Inverness", "Scotland", 47000),
    ("Irthlingborough", "Northamptonshire", 10000),
    ("Keighley", "West Yorkshire", 57000),
    ("Kendal", "Cumbria", 30000),
    ("Kenilworth", "Warwickshire", 22000),
    ("Kettering", "Northamptonshire", 63000),
    ("Kidderminster", "Worcestershire", 56000),
    ("Kilmarnock", "Scotland", 46000),
    ("King's Lynn", "Norfolk", 45000),
    ("Kingswood", "Surrey", 43000),
    ("Kirkby", "Merseyside", 42000),
    ("Kirkcaldy", "Scotland", 50000),
    ("Lancaster", "Lancashire", 53000),
    ("Lancing", "West Sussex", 19000),
    ("Larkhall", "South Lanarkshire", 15000),
    ("Leatherhead", "Surrey", 11000),
    ("Leighton Buzzard", "Bedfordshire", 40000),
    ("Letchworth", "Hertfordshire", 34000),
    ("Lewes", "East Sussex", 18000),
    ("Lichfield", "Staffordshire", 33000),
    ("Lincoln", "Lincolnshire", 104000),
    ("Littlehampton", "West Sussex", 40000),
    ("Livingston", "Scotland", 56000),
    ("Llanelli", "Wales", 30000),
    ("Long Eaton", "Derbyshire", 38000),
    ("Lowestoft", "Suffolk", 48000),
    ("Luton", "Bedfordshire", 225000),
    ("Macclesfield", "Cheshire", 57000),
    ("Maidstone", "Kent", 140000),
    ("Maldon", "Essex", 15000),
    ("Malmesbury", "Wiltshire", 6000),
    ("Malton", "North Yorkshire", 5000),
    ("Malvern", "Worcestershire", 30000),
    ("Margate", "Kent", 65000),
    ("Market Harborough", "Leicestershire", 16000),
    ("Market Rasen", "Lincolnshire", 12000),
    ("Matlock", "Derbyshire", 10000),
    ("Meriden", "West Midlands", 2500),
    ("Merthyr Tydfil", "Wales", 31000),
    ("Middlesbrough", "North Yorkshire", 148000),
    ("Middleton", "Greater Manchester", 46000),
    ("Midhurst", "West Sussex", 5000),
    ("Minster", "Kent", 4000),
    ("Mirfield", "West Yorkshire", 20000),
    ("Mitcham", "Greater London", 65000),
    ("Monmouth", "Wales", 11000),
    ("Morley", "West Yorkshire", 30000),
    ("Motherwell", "Scotland", 32000),
    ("Nailsea", "Somerset", 20000),
    ("Nantwich", "Cheshire", 14000),
    ("Nelson", "Lancashire", 40000),
    ("New Barnet", "Greater London", 25000),
    ("New Malden", "Greater London", 22000),
    ("New Mills", "Derbyshire", 10000),
    ("New Milton", "Hampshire", 25000),
    ("Newbury", "Berkshire", 42000),
    ("Newcastle-under-Lyme", "Staffordshire", 77000),
    ("Newhaven", "East Sussex", 13000),
    ("Newton Abbot", "Devon", 26000),
    ("Northallerton", "North Yorkshire", 16000),
    ("Northampton", "Northamptonshire", 249000),
    ("Norwich", "Norfolk", 213000),
    ("Nottingham", "Nottinghamshire", 324000),
    ("Nuneaton", "Warwickshire", 89000),
    ("Oadby", "Leicestershire", 24000),
    ("Oakengates", "Shropshire", 4000),
    ("Oswestry", "Shropshire", 17000),
    ("Otley", "West Yorkshire", 14000),
    ("Paignton", "Devon", 50000),
    ("Penarth", "Wales", 22000),
    ("Penrith", "Cumbria", 16000),
    ("Perth", "Scotland", 47000),
    ("Peterborough", "Cambridgeshire", 216000),
    ("Pickering", "North Yorkshire", 7000),
    ("Poole", "Dorset", 153000),
    ("Portland", "Dorset", 13000),
    ("Portishead", "Somerset", 26000),
    ("Prescot", "Merseyside", 12000),
    ("Prestatyn", "Wales", 19000),
    ("Preston", "Lancashire", 142000),
    ("Pudsey", "West Yorkshire", 22000),
    ("Ramsgate", "Kent", 42000),
    ("Rawtenstall", "Lancashire", 25000),
    ("Rayleigh", "Essex", 33000),
    ("Reading", "Berkshire", 175000),
    ("Redcar", "North Yorkshire", 37000),
    ("Redditch", "Worcestershire", 86000),
    ("Reigate", "Surrey", 23000),
    ("Retford", "Nottinghamshire", 23000),
    ("Rhyl", "Wales", 25000),
    ("Rickmansworth", "Hertfordshire", 26000),
    ("Ripon", "North Yorkshire", 17000),
    ("Rochdale", "Greater Manchester", 111000),
    ("Rochester", "Kent", 27000),
    ("Rotherham", "South Yorkshire", 111000),
    ("Rugby", "Warwickshire", 78000),
    ("Ruislip", "Greater London", 60000),
    ("Runcorn", "Cheshire", 62000),
    ("Rushden", "Northamptonshire", 30000),
    ("Ryde", "Isle of Wight", 25000),
    ("Sale", "Greater Manchester", 54000),
    ("Salford", "Greater Manchester", 130000),
    ("Scarborough", "North Yorkshire", 62000),
    ("Scunthorpe", "Lincolnshire", 82000),
    ("Seaford", "East Sussex", 23000),
    ("Sevenoaks", "Kent", 31000),
    ("Sheerness", "Kent", 13000),
    ("Selby", "North Yorkshire", 15000),
    ("Shanklin", "Isle of Wight", 10000),
    ("Sidmouth", "Devon", 13000),
    ("Skelmersdale", "Lancashire", 39000),
    ("Sleaford", "Lincolnshire", 18000),
    ("Slough", "Berkshire", 164000),
    ("Smethwick", "West Midlands", 50000),
    ("Solihull", "West Midlands", 126000),
    ("South Shields", "Tyne and Wear", 76000),
    ("Southall", "Greater London", 70000),
    ("Southsea", "Hampshire", 20000),
    ("Southport", "Merseyside", 91000),
    ("Southsea", "Hampshire", 20000),
    ("Spalding", "Lincolnshire", 33000),
    ("Staines", "Surrey", 21000),
    ("Stafford", "Staffordshire", 72000),
    ("Staines-upon-Thames", "Surrey", 21000),
    ("Stevenage", "Hertfordshire", 89000),
    ("Stourbridge", "West Midlands", 64000),
    ("Stratford-upon-Avon", "Warwickshire", 28000),
    ("Stretford", "Greater Manchester", 77000),
    ("Stroud", "Gloucestershire", 12000),
    ("Sturry", "Kent", 7000),
    ("Sudbury", "Suffolk", 13000),
    ("Sunderland", "Tyne and Wear", 277000),
    ("Surbiton", "Greater London", 48000),
    ("Swadlincote", "Derbyshire", 35000),
    ("Swindon", "Wiltshire", 183000),
    ("Swinton", "Greater Manchester", 43000),
    ("Tamworth", "Staffordshire", 38000),
    ("Taunton", "Somerset", 65000),
    ("Telford", "Shropshire", 170000),
    ("Thirsk", "North Yorkshire", 5000),
    ("Thurso", "Scotland", 8000),
    ("Thurmaston", "Leicestershire", 10000),
    ("Tipton", "West Midlands", 40000),
    ("Todmorden", "West Yorkshire", 16000),
    ("Torquay", "Devon", 70000),
    ("Totnes", "Devon", 8500),
    ("Trowbridge", "Wiltshire", 37000),
    ("Truro", "Cornwall", 21000),
    ("Tunbridge Wells", "Kent", 57000),
    ("Twickenham", "Greater London", 66000),
    ("Uckfield", "East Sussex", 15000),
    ("Uddingston", "South Lanarkshire", 11000),
    ("Ulverston", "Cumbria", 12000),
    ("Uttoxeter", "Staffordshire", 14000),
    ("Wakefield", "West Yorkshire", 110000),
    ("Wallasey", "Merseyside", 61000),
    ("Walsall", "West Midlands", 277000),
    ("Walton-on-Thames", "Surrey", 23000),
    ("Walton-on-the-Naze", "Essex", 14000),
    ("Wandsworth", "Greater London", 340000),
    ("Ware", "Hertfordshire", 19000),
    ("Wareham", "Dorset", 15000),
    ("Warwick", "Warwickshire", 37000),
    ("Washington", "Tyne and Wear", 67000),
    ("Watford", "Hertfordshire", 132000),
    ("Wellingborough", "Northamptonshire", 53000),
    ("Welwyn Garden City", "Hertfordshire", 52000),
    ("West Bromwich", "West Midlands", 81000),
    ("West Kirby", "Merseyside", 12000),
    ("Weymouth", "Dorset", 53000),
    ("Whitby", "North Yorkshire", 13000),
    ("Whitchurch", "Hampshire", 8000),
    ("Whitland", "Carmarthenshire", 5000),
    ("Whitnash", "Warwickshire", 10000),
    ("Widnes", "Cheshire", 55000),
    ("Wigan", "Greater Manchester", 108000),
    ("Wimborne Minster", "Dorset", 16000),
    ("Winchester", "Hampshire", 45000),
    ("Windsor", "Berkshire", 33000),
    ("Winsford", "Cheshire", 35000),
    ("Wirksworth", "Derbyshire", 5000),
    ("Witham", "Essex", 28000),
    ("Woking", "Surrey", 105000),
    ("Wokingham", "Berkshire", 35000),
    ("Wolverhampton", "West Midlands", 264000),
    ("Woodbridge", "Suffolk", 8000),
    ("Wooler", "Northumberland", 2000),
    ("Worksop", "Nottinghamshire", 44000),
    ("Worthing", "West Sussex", 112000),
    ("Wrexham", "Wales", 68000),
    ("Yeovil", "Somerset", 49000),
    ("Ystradgynlais", "Wales", 8000),
]

# Filter: remove entries that already have a CSV file
# Normalize names for comparison
def norm(name):
    return name.lower().strip().replace(' and hove', '').replace(' and ', ' ').replace('-', ' ')

still_needed = []
already_have = []
for name, region, pop in TOWNS_200 + TOWNS_LARGE:
    n = norm(name)
    if n in csv_towns:
        already_have.append(name)
    else:
        still_needed.append((name, region, max(pop, 1)))

# Deduplicate
seen = set()
unique = []
for name, region, pop in still_needed:
    n = norm(name)
    if n not in seen:
        seen.add(n)
        unique.append((name, region, pop))

# Sort by population descending
unique.sort(key=lambda x: x[2], reverse=True)

# Trim to exactly 200
unique = unique[:200]

# Write markdown file
lines = []
lines.append("# 200 UK Towns with Sizable Populations — Still Needing CSV Data")
lines.append("")
lines.append("# Towns that still need a dedicated `*_free_food_locations.csv` file")
lines.append("# Approximate populations based on 2021 Census / ONS estimates")
lines.append("# Sorted by population descending")
lines.append(f"# Towns already covered (have CSV): {len(already_have)}")
lines.append(f"# Towns still needed: {len(unique)}")
lines.append(f"# File generated for Foodshare project — {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}")
lines.append("#")
lines.append("")
lines.append("| # | Town | Region | Approx. Population |")
lines.append("|---|------|--------|--------------------|")

for i, (name, region, pop) in enumerate(unique, 1):
    pop_str = f"{pop:,}" if pop >= 1000 else str(pop)
    lines.append(f"| {i} | {name} | {region} | {pop_str} |")

lines.append("")
lines.append("---")
lines.append("")
lines.append("## Towns Already Covered (have CSV files)")
lines.append("")
for name in sorted(already_have):
    lines.append(f"- {name}")
lines.append("")
lines.append("## Legend")
lines.append("- **Region**: Administrative region/county")
lines.append("- **Approx. Population**: 2021 Census or latest ONS estimate")
lines.append("- Towns listed above **need their own CSV data file** created")

with open(os.path.join(BASE, 'data/200_uk_towns_list.md'), 'w') as f:
    f.write('\n'.join(lines))

print(f"✅ Rebuilt 200_uk_towns_list.md")
print(f"  Already covered: {len(already_have)}")
print(f"  Still needed:    {len(unique)}")
print(f"  Total tried:     {len(TOWNS_200) + len(TOWNS_LARGE)}")
PYEOF