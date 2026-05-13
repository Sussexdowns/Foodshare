#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# xc – Import all JSON data into Firestore
#
# Usage:
#   chmod +x import_all_to_firestore.sh
#   ./import_all_to_firestore.sh <YOUR_PROJECT_ID>
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT="${1:?Error – provide your Firebase project ID.}"

TMPDIR="$(mktemp -d)"
JSON_OUT="$TMPDIR/firestore_bulk_import.json"
trap 'rm -rf "$TMPDIR"' EXIT
export PROJECT_ROOT="$(pwd)"

# ── 1. Verify JSON files exist ───────────────────────────────────────
for f in categories.json items.json locations.json uk_counties.json uk_towns.json; do
  if [[ ! -f "$f" ]]; then
    echo "✘ Missing $f. Please ensure it is in $(pwd)."
    exit 1
  fi
done

# ── 2. Detect Python ────────────────────────────────────────────────
PY_CMD="python3"
if command -v python3.13 &> /dev/null; then
  PY_CMD="python3.13"
elif command -v python3.12 &> /dev/null; then
  PY_CMD="python3.12"
fi

echo "▸ Using $PY_CMD for transformation..."

# ── 3. Run Transformation ──────────────────────────────────────────
echo "▸ Transforming data to Firestore format..."
$PY_CMD - "$PROJECT" "$JSON_OUT" << 'PYEOF'
import json, sys, os, hashlib
from datetime import datetime, timezone
import csv # Added for CSV processing
try:
    from google.cloud import firestore
except ImportError:
    print("\n✘ Error: The 'google-cloud-firestore' Python library is required.\n   Run: pip3 install google-cloud-firestore\n", file=sys.stderr)
    sys.exit(1)

project = sys.argv[1] # Firebase project ID
out_path = sys.argv[2] # Temporary file path for potential bulk import (not used in this Firestore direct import)
docs = {}
location_name_to_doc_id = {} # To store mapping of location names to their Firestore doc_ids
csv_files_to_import = [] # To collect CSV paths from uk_counties/towns JSON files
location_names = {} # Stores {doc_id: display_name} for denormalization
now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def add_doc(collection, doc_id, data):
    docs[(collection, doc_id)] = data

def safe_int(val, default=0):
    try:
        if val is None: return default
        s = str(val).strip()
        return int(float(s)) if s else default
    except (ValueError, TypeError):
        return default

def generate_fallback_id(name):
    return f"loc_{hashlib.md5(name.encode()).hexdigest()[:10]}"

# Initialize Firestore client and perform auth check
db = None # Initialize to None
try:
    db = firestore.Client(project=project)
    # Validate connection/auth immediately
    # This will raise an exception if credentials are not set up
    db.collections()
except Exception as e:
    print(f"\n✘ Authentication Error: {e}", file=sys.stderr)
    print("\nTo fix this, please set up Application Default Credentials:", file=sys.stderr)
    if os.system("command -v gcloud > /dev/null") != 0:
        print("  1. Install gcloud: brew install --cask google-cloud-sdk", file=sys.stderr)
        print("  2. Run: gcloud auth application-default login", file=sys.stderr)
    else:
        print("  Run: gcloud auth application-default login", file=sys.stderr)
    print("\n  Alternatively, set GOOGLE_APPLICATION_CREDENTIALS to a service account key path.\n", file=sys.stderr)
    sys.exit(1)

# ── 1. Categories ──
if os.path.exists("categories.json"):
    with open("categories.json") as f:
        cats_data = json.load(f)["categories"]
    for top in cats_data:
        tid = top["id"]
        add_doc("categories", f"cat_{tid}", {
            "categoryId": f"cat_{tid}",
            "categoryName": top["name"],
            "categoryLink": f"/categories/{tid}",
            "categoryParentId": None,
            "categoryIcon": top.get("icon", "fa-solid fa-folder"),
            "categoryImage": f"/images/categories/{tid}.jpg",
            "createdAt": now
        })
        for sub in top.get("subcategories", []):
            sid = sub["id"]
            add_doc("categories", f"cat_{sid}", {
                "categoryId": f"cat_{sid}",
                "categoryName": sub["name"],
                "categoryLink": f"/categories/{tid}/{sid}",
                "categoryParentId": f"cat_{tid}",
                "categoryIcon": sub.get("icon", "fa-solid fa-circle"),
                "categoryImage": f"/images/categories/{sid}.jpg",
                "createdAt": now
            })

# ── 2. Food Items ──
if os.path.exists("items.json"):
    with open("items.json") as f:
        items_data = json.load(f)
    for cat_key, items in items_data.items():
        for it in items:
            doc_id = f"{cat_key}_{it['id']}"
            it_data = {
                "id": doc_id,
                "name": it["name"],
                "description": it.get("desc", ""),
                "quantity": it.get("quantity", 10),
                "status": it.get("status", "available"),
                "postedById": it.get("postedById", "user001"),
                "category": f"cat_{cat_key}",
                "imageUrl": it.get("image", ""),
                "link": it.get("link", ""),
                "createdAt": now
            }
            add_doc("items", doc_id, it_data)

# ── 3. Locations (JSON) ──
def import_json_locations(file, root_key=None, tag_type=None):
    global location_name_to_doc_id, csv_files_to_import, location_names

    if not os.path.exists(file): return
    with open(file) as f:
        raw = json.load(f)
        data = raw[root_key] if root_key else raw

    for loc in data:
        name = loc.get("name", "Unknown Location")
        
        # Use provided ID if available (counties/towns), otherwise fallback to hashed name
        raw_id = loc.get("id")
        doc_id = f"{tag_type}_{raw_id}" if (tag_type and raw_id) else (str(raw_id) if raw_id else generate_fallback_id(name))
        
        # Store the mapping for later use by CSV sources
        location_name_to_doc_id[name.lower()] = doc_id
        location_names[doc_id] = name
        if tag_type: # For towns and counties, store with type suffix to avoid name collisions
            location_name_to_doc_id[f"{name.lower()}_{tag_type}"] = doc_id

        # Collect CSV file paths if available in location JSON
        if loc.get("csvFile"):
            csv_files_to_import.append(os.path.join(os.environ["PROJECT_ROOT"], loc["csvFile"]))

        season = loc.get("season", "")
        months = []
        try:
            months = [int(m) for m in season.split(",") if m.strip().isdigit()]
        except: pass

        # Clean tags: handles strings like '"tag1", "tag2"' and removes escaped quotes
        if tag_type:
            tags = [tag_type, "uk"]
        else:
            raw_tags = loc.get("tags", "")
            tags = [t.strip().strip('"').strip('\\"') for t in raw_tags.split(",") if t.strip()]

        doc_data = {
            "name": name,
            "category": loc.get("category", tag_type.capitalize() if tag_type else "Other"),
            "shortDescription": loc.get("short_description", f"{tag_type} in UK" if tag_type else ""),
            "description": loc.get("description", ""),
            "lat": float(loc["lat"]) if loc.get("lat") is not None else (float(loc["center"][0]) if loc.get("center") else None),
            "lng": float(loc["lng"]) if loc.get("lng") is not None else (float(loc["center"][1]) if loc.get("center") else None),
            "status": loc.get("status", "active"),
            "postedById": loc.get("postedById", "user001"),
            "createdAt": now,
            "tags": tags,
            "likes": loc.get("likes", 0),
            "dislikes": loc.get("dislikes", 0),
            "season": season,
            "months": months,
            "images": loc.get("images", [loc.get("image")] if "image" in loc else []),
            "whatThreeWords": loc.get("what_three_words", "")
        }
        add_doc("locations", doc_id, doc_data)

# Process all JSON location files first to populate `location_name_to_doc_id` and `csv_files_to_import`
import_json_locations("locations.json")
import_json_locations("uk_counties.json", "counties", "county")
import_json_locations("uk_towns.json", "towns", "town")

# ── 4. CSV Sources ──
def import_csv_sources_from_file(csv_file_path):
    global location_name_to_doc_id, location_names

    if not os.path.exists(csv_file_path):
        print(f"  Warning: CSV file not found: {csv_file_path}", file=sys.stderr)
        return

    print(f"  Processing CSV: {csv_file_path}")
    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader):
            # Generate a unique ID for the source document
            # Combine relevant fields to ensure uniqueness, or use a simple counter + filename
            source_id_base = f"{os.path.basename(csv_file_path).replace('.csv', '')}_{row.get('id', i)}"
            source_id = f"src_{hashlib.md5(source_id_base.encode()).hexdigest()[:16]}"

            # Process tags
            raw_tags = row.get("tags", "")
            tags = [t.strip().strip('"').strip('\\"') for t in raw_tags.split(",") if t.strip()]

            # Process season/months (CSV uses semicolon for months)
            season_str = row.get("season", "")
            months_list = []
            try:
                months_list = [int(m) for m in season_str.split(";") if m.strip().isdigit()]
            except: pass

            # Link to existing locations (town and county)
            location_town_id = None
            location_county_id = None

            csv_town_name = row.get("town", "").lower()
            if csv_town_name:
                # Prioritize specific town lookup, then generic name lookup
                if f"{csv_town_name}_town" in location_name_to_doc_id:
                    location_town_id = location_name_to_doc_id[f"{csv_town_name}_town"]
                elif csv_town_name in location_name_to_doc_id:
                    location_town_id = location_name_to_doc_id[csv_town_name]

            csv_county_name = row.get("county", "").lower()
            if csv_county_name:
                # Prioritize specific county lookup, then generic name lookup
                if f"{csv_county_name}_county" in location_name_to_doc_id:
                    location_county_id = location_name_to_doc_id[f"{csv_county_name}_county"]
                elif csv_county_name in location_name_to_doc_id:
                    location_county_id = location_name_to_doc_id[csv_county_name]

            # Construct the source document
            source_data = {
                "sourceId": source_id,
                "name": row.get("name", "Unknown Source"),
                "type": row.get("type", "Other"),
                "category": row.get("category", "Other"),
                "subCategory": row.get("sub-category", "Other"),
                "lat": float(row["lat"]) if row.get("lat") else None,
                "lng": float(row["lng"]) if row.get("lng") else None,
                "shortDescription": row.get("short_description", ""),
                "description": row.get("description", ""),
                "season": season_str,
                "months": months_list,
                "imageUrl": row.get("image", ""),
                "tags": tags,
                "likes": safe_int(row.get("likes")),
                "dislikes": safe_int(row.get("dislikes")),
                "reports": safe_int(row.get("reports")),
                "comments": row.get("comments", ""),
                "whatThreeWords": row.get("what_three_words", ""),
                "plusCode": row.get("plus_code", ""),
                "sourceLink": row.get("link", ""), # Renamed to avoid conflict with imageUrl
                "address": row.get("address", ""),
                "town": row.get("town", ""),
                "area": row.get("area", ""),
                "county": row.get("county", ""),
                "postcode": row.get("postcode", ""),
                "approved": row.get("approved", "False").lower() == "true",
                "timestamp": row.get("timestamp", now), # Use CSV timestamp if available, else current
                "postedById": row.get("postedById", "user001"), # Default user
                "createdAt": now, # When this record was created in Firestore
            }

            # Add references to locations if found
            # These will be Firestore DocumentReference objects
            if location_town_id:
                source_data["locationTownRef"] = db.collection("locations").document(location_town_id)
                source_data["townName"] = location_names.get(location_town_id, "")
            if location_county_id:
                source_data["locationCountyRef"] = db.collection("locations").document(location_county_id)
                source_data["countyName"] = location_names.get(location_county_id, "")

            add_doc("sources", source_id, source_data)

# Now, process all collected CSV files
export_root = os.environ.get("PROJECT_ROOT", ".")
for csv_file_path in csv_files_to_import:
    import_csv_sources_from_file(csv_file_path)

print(f"▸ Prepared {len(docs)} documents. Starting upload to Firestore...")

import time
time.sleep(60)  # Wait for quota to reset

batch = db.batch()
count = 0

for (coll_name, doc_id), data in docs.items():
    doc_ref = db.collection(coll_name).document(doc_id)
    batch.set(doc_ref, data, merge=True)
    count += 1
    if count % 250 == 0:
        batch.commit()
        print(f"  .. uploaded {count} documents")
        batch = db.batch()
        time.sleep(2)

batch.commit()
print(f"\n✔ Successfully imported {count} documents into project '{project}'.")
PYEOF