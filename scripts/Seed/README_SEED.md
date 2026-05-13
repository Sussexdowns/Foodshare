# Foodshare Database Seeding Scripts

This directory contains scripts to seed and manage the Firebase Data Connect database for the Foodshare application.

## Prerequisites

1. **Firebase CLI** installed and authenticated:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Node.js 18+** installed

3. **Firebase project** set up with Data Connect enabled

## Scripts

### `scripts/seed_database.mjs` — SDK-based seed script
Uses the generated `@dataconnect/generated` SDK. Run from the `web-app/` directory.

```bash
# From web-app/ directory
npm run seed                  # Seed all tables (production)
npm run seed:dev              # Seed the emulator
npm run seed:clear            # Clear all data, then seed
npm run seed:categories       # Seed only categories
npm run seed:users            # Seed only users
npm run seed:verify           # Seed without verification
```

### `scripts/seed_rest.mjs` — Standalone REST API seed script
Uses raw REST API calls — no SDK dependency. Can be run from anywhere.

```bash
# From project root
npx tsx scripts/seed_rest.mjs               # Seed all tables
FDC_EMULATOR_HOST=localhost:8080 npx tsx scripts/seed_rest.mjs  # Seed emulator
npx tsx scripts/seed_rest.mjs --clear       # Clear and re-seed
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FDC_PROJECT_ID` | Firebase project ID | `foodshare-50695` |
| `FDC_LOCATION` | Data Connect location | `us-east4` |
| `FDC_EMULATOR_HOST` | Emulator host (e.g., `localhost:8080`) | _(empty — production)_ |
| `FDC_AUTH_TOKEN` | Firebase ID token (production) | _(empty)_ |

## Emulator Usage

1. Start the emulator:
   ```bash
   firebase emulators:start --only dataconnect
   ```

2. Run the seed script:
   ```bash
   FDC_EMULATOR_HOST=localhost:8080 npm run seed:dev
   ```

## Production Usage

1. **Authenticate** and get an access token:
   ```bash
   export FDC_AUTH_TOKEN=$(firebase auth:tokens:create \
     --project=foodshare-1 | jq -r '.idToken')
   ```

2. **Run the seed**:
   ```bash
   npm run seed
   ```

3. **Or use the Firebase CLI** with the GQL seed file:
   ```bash
   fdc dev seed --project foodshare-50695 --schema ../dataconnect/seed_data_updated.gql
   ```

## Database Schema

The seed scripts populate the following tables:

| Table | Description | Record Count |
|-------|-------------|:------------:|
| `Category` | Food categories with parent-child hierarchy | 21 |
| `User` | Platform users with roles (user, donor, admin, editor) | 6 |
| `FoodItem` | Available food items posted by users | 5 |
| `Location` | Foraging/free food locations with coordinates | 6 |
| `Request` | Food item requests from users | 3 |
| `Community` | Local food sharing communities | 2 |
| `Review` | User reviews after transactions | 2 |
| `Report` | Reports on items/issues | 2 |

## Schema Files

- **`dataconnect/schema/schema.gql`** — Updated schema with all table definitions
- **`dataconnect/seed_data_updated.gql`** — GQL seed file for use with `fdc` CLI
- **`dataconnect/schema/schema.gql`** — Schema definition (source of truth)

## Flags

| Flag | Description |
|------|-------------|
| `--clear` / `-c` | Clear all existing data before seeding |
| `--no-verify` / `-n` | Skip post-seed verification |
| `--categories-only` | Seed only the Category table |
| `--users-only` | Seed only the User table |