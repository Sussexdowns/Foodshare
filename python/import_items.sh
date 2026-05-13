#!/bin/bash
# ──────────────────────────────────────────────────────────
# import_items.sh – Import items.json into Firebase Firestore
#
# Prerequisites:
#   - Firebase CLI installed:        npm install -g firebase-tools
#   - Authenticated:                 firebase login
#   - A Firebase project set up
#
# Usage:
#   chmod +x import_items.sh
#   ./import_items.sh <YOUR_PROJECT_ID>
# ──────────────────────────────────────────────────────────

set -e

PROJECT="${1:?Error: provide your Firebase project ID as the first argument.}"
IMPORT_DIR="$(mktemp -d)"
JSON_OUT="$IMPORT_DIR/items_import.json"

trap 'rm -rf "$IMPORT_DIR"' EXIT

echo "▸ Transforming items.json → Firestore import format..."

# Pass the output file path as an env var so the heredoc can reference it
export JSON_OUT

python3 - "$PROJECT" << 'PYEOF'
import json, sys, os

project = sys.argv[1]
out_path = os.environ["JSON_OUT"]

with open("items.json") as f:
    data = json.load(f)

# firestore:set expects keys to be the target document path
docs = {}
for category, items in data.items():
    for item in items:
        doc_id = f"{category}_{item['id']}"
        doc_data = {k: v for k, v in item.items() if k != "id"}
        doc_data["category"] = category
        # Use the format: projects/<pid>/databases/(default)/documents/<collection>/<docId>
        key = f"projects/{project}/databases/(default)/documents/items/{doc_id}"
        docs[key] = doc_data

with open(out_path, "w") as f:
    json.dump(docs, f, indent=2)

print(json.dumps({"status": "ok", "documents_written": len(docs)}))
PYEOF

echo "▸ Importing into Firestore project '$PROJECT'..."
firebase firestore:set --project="$PROJECT" "$JSON_OUT" --merge 2>&1

echo ""
echo "✔ Import complete. All items are now in the 'items' collection."
echo "  Verify in the Firebase Console or run:"
echo "  firebase firestore:query --project=$PROJECT --collection=items"