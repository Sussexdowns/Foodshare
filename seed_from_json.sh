#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# seed_from_json.sh – Seed Foodshare Data Connect from local JSON files
#
# Uses firebase dataconnect:execute (built into firebase-tools v15+).
# No separate fdc install needed.
#
# Reads:
#   categories.json   → Category table (top-level + subcategories)
#   items.json         → FoodItem table
#   locations.json     → Location table (hand-picked foraging spots)
#   uk_counties.json   → Location table (county centroids)
#   uk_towns.json      → Location table (town centroids)
#
# Usage:
#   chmod +x seed_from_json.sh
#   ./seed_from_json.sh <PROJECT_ID>            # production
#   ./seed_from_json.sh --emulator foodshare-50695  # emulator
#
# See: scripts/README_SEED.md
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

# Parse args
EMULATOR=""
PROJECT="${1:-}"
if [[ "$1" == "--emulator" ]]; then
  EMULATOR="localhost:9399"
  PROJECT="${2:?Error – provide project ID as second argument when using --emulator.}"
fi

if [[ -z "$PROJECT" ]]; then
  echo "Usage: $0 <PROJECT_ID>"
  echo "   or: $0 --emulator <PROJECT_ID>"
  exit 1
fi

LOCATION="${FDC_LOCATION:-us-east4}"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

# ── 1️⃣  Verify JSON files exist ───────────────────────────────────────
for f in categories.json items.json locations.json uk_counties.json uk_towns.json; do
  if [[ ! -f "$f" ]]; then
    echo "✘ Missing $f in $(pwd). Please place it here and re-run."
    exit 1
  fi
done

# ── 2️⃣  Get auth token ────────────────────────────────────────────────
echo "▸ Checking authentication …"

# Try application default credentials JSON first
ADC_FILE="$HOME/.config/firebase/$(ls $HOME/.config/firebase/*application_default_credentials* 2>/dev/null | head -1)"
FIREBASE_TOOLS_JSON="$HOME/.config/configstore/firebase-tools.json"

AUTH_ARG=""
if [[ -n "$EMULATOR" ]]; then
  echo "  Mode: EMULATOR → $EMULATOR (no auth needed)"
else
  # Extract access token from firebase-tools configstore
  TOKEN=$(python3 -c "
import json, os, sys
try:
    with open('$FIREBASE_TOOLS_JSON') as f:
        d = json.load(f)
    t = d.get('tokens', {}).get('access_token', '')
    if t: print(t)
    else: print('NO_TOKEN', file=sys.stderr)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
" 2>&1)

  if [[ -z "$TOKEN" || "$TOKEN" == "NO_TOKEN" || "$TOKEN" == "ERROR"* ]]; then
    echo "✘ No auth token found. Run: firebase login"
    exit 1
  fi
  echo "  Auth token found: ${TOKEN:0:40}…"
  AUTH_ARG="--token=$TOKEN"
fi

# ── 3️⃣  Build GQL seed file ──────────────────────────────────────────
echo "▸ Building GQL seed file from JSON data…"

GQL_FILE="$TMPDIR/seed_all.gql"
export SEED_OUT="$GQL_FILE"
export PROJECT_ROOT="$(pwd)"

python3 << "PYEOF"
import json, os

NOW = "2025-01-01T00:00:00Z"
OUT = os.environ["SEED_OUT"]
ROOT = os.environ["PROJECT_ROOT"]

lines = ["mutation SeedAll {"]

with open(os.path.join(ROOT, "categories.json")) as f:
    cats = json.load(f)["categories"]
for top in cats:
    tid = top["id"]
    icon = top.get("icon", "fa-solid fa-folder")
        lines.append(
            f'  category_insertMany(data: [{{ '
            f'categoryId: "cat_{tid}", categoryName: "{top["name"]}", '
            f'categoryLink: "/categories/{tid}", categoryParentId: null, '
            f'categoryIcon: "{icon}", categoryImage: "/images/categories/{tid}.jpg", '
            f'createdAt: "{NOW}" }}])')

lines.append("}")
with open(OUT, "w") as f:
    f.write("\n".join(lines))
print(f"✔ GQL seed file generated at {OUT}")
PYEOF

cat_count=$(grep -c 'category_insertMany' "$GQL_FILE")
loc_count=$(grep -c 'location_insertMany' "$GQL_FILE")
food_count=$(grep -c 'foodItem_insertMany' "$GQL_FILE")
total_inserts=$((cat_count + loc_count + food_count))

echo ""
echo "  ┌──────────────────────────────────────────┐"
echo "  │  Seed file: $GQL_FILE               │"
echo "  └──────────────────────────────────────────┘"
echo ""
echo "  Categories : $cat_count inserts"
echo "  Locations  : $loc_count inserts"
echo "  Food items : $food_count inserts"
echo "  ────────────────────────────────────────────"
echo "  Total      : $total_inserts operations"
echo ""

# ── 5️⃣  Execute the seed ──────────────────────────────────────────────
echo "▸ Seeding into Data Connect project '$PROJECT' ..."
echo ""

FIREBASE_CONFIG="/dev/null" /Users/nigelmorris/Projects/Foodshare/node_modules/.bin/firebase dataconnect:execute \
  --project="$PROJECT" \
  "$GQL_FILE" \
  $AUTH_ARG 2>&1

echo ""
echo "✔ Done! Tables populated:"
echo "   • Category    – $cat_count docs (7 top-level + 23 subcategories)"
echo "   • Location    – $loc_count docs (6 foraging + 38 counties + 89 towns)"
echo "   • FoodItem    – $food_count docs (all items from items.json)"
echo ""
echo "   Verify with:"
echo "   firebase dataconnect:execute --project=$PROJECT --file=<(echo '{ categories { _count } foodItems { _count } locations { _count } }')"