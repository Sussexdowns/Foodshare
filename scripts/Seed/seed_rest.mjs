/**
 * Foodshare Database Seed Script (Standalone REST API version)
 * 
 * This script seeds the Firebase Data Connect database using raw REST API calls.
 * No dependency on @dataconnect/generated SDK required.
 * 
 * Usage:
 *   npm run seed:rest          # Seed with default settings
 *   npm run seed:rest:dev      # Seed the emulator
 *   npm run seed:rest:clear    # Clear and re-seed
 * 
 * Or run directly:
 *   npx tsx scripts/seed_rest.mjs
 *   FDC_EMULATOR_HOST=localhost:8080 npx tsx scripts/seed_rest.mjs
 */

// ──────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────
const PROJECT_ID = process.env.FDC_PROJECT_ID || "foodshare-50695";
const LOCATION = process.env.FDC_LOCATION || "us-east4";
const EMULATOR_HOST = process.env.FDC_EMULATOR_HOST || "";
const AUTH_TOKEN = process.env.FDC_AUTH_TOKEN || "";

const isEmulator = EMULATOR_HOST !== "";
const baseUrl = isEmulator
  ? `http://${EMULATOR_HOST}/${PROJECT_ID}/${LOCATION}`
  : `https://dataconnect.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/services/foodshare`;

// ──────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (AUTH_TOKEN) {
    headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  }
  return headers;
}

async function executeMutation(document, variables = {}) {
  const body = JSON.stringify({ document, variables });
  const response = await fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers: getAuthHeaders(),
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
  }
  return result.data;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────
// Console UI
// ──────────────────────────────────────────
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function logStep(message) { console.log(`${BLUE}ℹ${RESET} ${message}`); }
function logSuccess(message) { console.log(`${GREEN}✔${RESET} ${message}`); }
function logWarning(message) { console.log(`${YELLOW}⚠${RESET} ${message}`); }
function logError(message) { console.error(`${RED}✘${RESET} ${message}`); }
function logHeader(message) {
  console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  ${message}${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}`);
}

// ──────────────────────────────────────────
// GraphQL Documents
// ──────────────────────────────────────────
const MUTATION_CATEGORY_INSERT = `
  mutation InsertCategory($data: [Category_Data!]!) {
    category_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_USER_INSERT = `
  mutation InsertUser($data: [User_Data!]!) {
    user_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_FOODITEM_INSERT = `
  mutation InsertFoodItem($data: [FoodItem_Data!]!) {
    foodItem_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_LOCATION_INSERT = `
  mutation InsertLocation($data: [Location_Data!]!) {
    location_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_REQUEST_INSERT = `
  mutation InsertRequest($data: [Request_Data!]!) {
    request_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_COMMUNITY_INSERT = `
  mutation InsertCommunity($data: [Community_Data!]!) {
    community_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_REVIEW_INSERT = `
  mutation InsertReview($data: [Review_Data!]!) {
    review_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_REPORT_INSERT = `
  mutation InsertReport($data: [Report_Data!]!) {
    report_insertMany(data: $data) {
      id
    }
  }
`;

const MUTATION_CHECK = `
  mutation CheckData {
    categories { _count }
    users { _count }
    foodItems { _count }
    locations { _count }
    requests { _count }
    communities { _count }
    reviews { _count }
    reports { _count }
  }
`;

// ──────────────────────────────────────────
// Seed Data
// ──────────────────────────────────────────
function generateCategories() {
  return [
    { categoryId: "cat_fruit", categoryName: "Fruits", categoryLink: "/categories/fruits", categoryParentId: null, categoryIcon: "fa-solid fa-apple-whole", categoryImage: "/images/categories/fruits.jpg" },
    { categoryId: "cat_vegetables", categoryName: "Vegetables", categoryLink: "/categories/vegetables", categoryParentId: null, categoryIcon: "fa-solid fa-carrot", categoryImage: "/images/categories/vegetables.jpg" },
    { categoryId: "cat_flowers", categoryName: "Flowers", categoryLink: "/categories/flowers", categoryParentId: null, categoryIcon: "fa-solid fa-flower", categoryImage: "/images/categories/flowers.jpg" },
    { categoryId: "cat_herbs", categoryName: "Herbs", categoryLink: "/categories/herbs", categoryParentId: null, categoryIcon: "fa-solid fa-spa", categoryImage: "/images/categories/herbs.jpg" },
    { categoryId: "cat_mushrooms", categoryName: "Mushrooms", categoryLink: "/categories/mushrooms", categoryParentId: null, categoryIcon: "fa-solid fa-mushroom", categoryImage: "/images/categories/mushrooms.jpg" },
    { categoryId: "cat_nuts", categoryName: "Nuts", categoryLink: "/categories/nuts", categoryParentId: null, categoryIcon: "fa-solid fa-seedling", categoryImage: "/images/categories/nuts.jpg" },
    { categoryId: "cat_other", categoryName: "Other", categoryLink: "/categories/other", categoryParentId: null, categoryIcon: "fa-solid fa-ellipsis", categoryImage: "/images/categories/other.jpg" },
    { categoryId: "cat_berries", categoryName: "Berries", categoryLink: "/categories/fruits/berries", categoryParentId: "cat_fruit", categoryIcon: "fa-solid fa-seedling", categoryImage: "/images/categories/berries.jpg" },
    { categoryId: "cat_stone_fruits", categoryName: "Stone Fruits", categoryLink: "/categories/fruits/stone-fruits", categoryParentId: "cat_fruit", categoryIcon: "fa-solid fa-lemon", categoryImage: "/images/categories/stone-fruits.jpg" },
    { categoryId: "cat_tree_fruits", categoryName: "Tree Fruits", categoryLink: "/categories/fruits/tree-fruits", categoryParentId: "cat_fruit", categoryIcon: "fa-solid fa-tree", categoryImage: "/images/categories/tree-fruits.jpg" },
    { categoryId: "cat_hedgerow", categoryName: "Hedgerow Fruits", categoryLink: "/categories/fruits/hedgerow", categoryParentId: "cat_fruit", categoryIcon: "fa-solid fa-leaf", categoryImage: "/images/categories/hedgerow.jpg" },
    { categoryId: "cat_root_vegetables", categoryName: "Root Vegetables", categoryLink: "/categories/vegetables/root-vegetables", categoryParentId: "cat_vegetables", categoryIcon: "fa-solid fa-carrot", categoryImage: "/images/categories/root-vegetables.jpg" },
    { categoryId: "cat_leafy_greens", categoryName: "Leafy Greens", categoryLink: "/categories/vegetables/leafy-greens", categoryParentId: "cat_vegetables", categoryIcon: "fa-solid fa-leaf", categoryImage: "/images/categories/leafy-greens.jpg" },
    { categoryId: "cat_cruciferous", categoryName: "Cruciferous", categoryLink: "/categories/vegetables/cruciferous", categoryParentId: "cat_vegetables", categoryIcon: "fa-solid fa-seedling", categoryImage: "/images/categories/cruciferous.jpg" },
    { categoryId: "cat_alliums", categoryName: "Alliums", categoryLink: "/categories/vegetables/alliums", categoryParentId: "cat_vegetables", categoryIcon: "fa-solid fa-pepper-hot", categoryImage: "/images/categories/alliums.jpg" },
    { categoryId: "cat_other_vegetables", categoryName: "Other Vegetables", categoryLink: "/categories/vegetables/other", categoryParentId: "cat_vegetables", categoryIcon: "fa-solid fa-bowl-food", categoryImage: "/images/categories/other-vegetables.jpg" },
    { categoryId: "cat_edible_flowers", categoryName: "Edible Flowers", categoryLink: "/categories/flowers/edible", categoryParentId: "cat_flowers", categoryIcon: "fa-solid fa-flower-tulip", categoryImage: "/images/categories/edible-flowers.jpg" },
    { categoryId: "cat_medicinal_flowers", categoryName: "Medicinal Flowers", categoryLink: "/categories/flowers/medicinal", categoryParentId: "cat_flowers", categoryIcon: "fa-solid fa-mortar-pestle", categoryImage: "/images/categories/medicinal-flowers.jpg" },
    { categoryId: "cat_wildflowers", categoryName: "Wildflowers", categoryLink: "/categories/flowers/wildflowers", categoryParentId: "cat_flowers", categoryIcon: "fa-solid fa-clover", categoryImage: "/images/categories/wildflowers.jpg" },
    { categoryId: "cat_culinary_herbs", categoryName: "Culinary Herbs", categoryLink: "/categories/herbs/culinary", categoryParentId: "cat_herbs", categoryIcon: "fa-solid fa-utensils", categoryImage: "/images/categories/culinary-herbs.jpg" },
    { categoryId: "cat_medicinal_herbs", categoryName: "Medicinal Herbs", categoryLink: "/categories/herbs/medicinal", categoryParentId: "cat_herbs", categoryIcon: "fa-solid fa-pills", categoryImage: "/images/categories/medicinal-herbs.jpg" },
    { categoryId: "cat_tea_herbs", categoryName: "Tea Herbs", categoryLink: "/categories/herbs/tea", categoryParentId: "cat_herbs", categoryIcon: "fa-solid fa-mug-hot", categoryImage: "/images/categories/tea-herbs.jpg" },
    { categoryId: "cat_edible_mushrooms", categoryName: "Edible Mushrooms", categoryLink: "/categories/mushrooms/edible", categoryParentId: "cat_mushrooms", categoryIcon: "fa-solid fa-plate-wheat", categoryImage: "/images/categories/edible-mushrooms.jpg" },
    { categoryId: "cat_medicinal_mushrooms", categoryName: "Medicinal Mushrooms", categoryLink: "/categories/mushrooms/medicinal", categoryParentId: "cat_mushrooms", categoryIcon: "fa-solid fa-kit-medical", categoryImage: "/images/categories/medicinal-mushrooms.jpg" },
    { categoryId: "cat_tree_nuts", categoryName: "Tree Nuts", categoryLink: "/categories/nuts/tree-nuts", categoryParentId: "cat_nuts", categoryIcon: "fa-solid fa-tree", categoryImage: "/images/categories/tree-nuts.jpg" },
    { categoryId: "cat_wild_nuts", categoryName: "Wild Nuts", categoryLink: "/categories/nuts/wild", categoryParentId: "cat_nuts", categoryIcon: "fa-solid fa-leaf", categoryImage: "/images/categories/wild-nuts.jpg" },
    { categoryId: "cat_wild_foods", categoryName: "Wild Foods", categoryLink: "/categories/other/wild-foods", categoryParentId: "cat_other", categoryIcon: "fa-solid fa-leaf", categoryImage: "/images/categories/wild-foods.jpg" },
    { categoryId: "cat_community_resources", categoryName: "Community Resources", categoryLink: "/categories/other/community-resources", categoryParentId: "cat_other", categoryIcon: "fa-solid fa-hand-holding-heart", categoryImage: "/images/categories/community-resources.jpg" },
    { categoryId: "cat_miscellaneous", categoryName: "Miscellaneous", categoryLink: "/categories/other/miscellaneous", categoryParentId: "cat_other", categoryIcon: "fa-solid fa-question", categoryImage: "/images/categories/miscellaneous.jpg" },
  ];
}

function generateUsers() {
  return [
    { id: "user001", displayName: "John Donor", email: "john.donor@example.com", role: "donor", userType: "donor", phoneNumber: "+44 7700 900001", address: "123 High Street, London", bio: "Local restaurant owner looking to reduce food waste" },
    { id: "user002", displayName: "Sarah Receiver", email: "sarah.receiver@example.com", role: "user", userType: "receiver", phoneNumber: "+44 7700 900002", address: "456 Oak Avenue, Manchester", bio: "Community center coordinator" },
    { id: "user003", displayName: "Mike Baker", email: "mike.baker@example.com", role: "donor", userType: "donor", phoneNumber: "+44 7700 900003", address: "789 Bread Lane, Birmingham", bio: "Bakery owner with daily surplus" },
    { id: "user004", displayName: "Emma Green", email: "emma.green@example.com", role: "user", userType: "receiver", phoneNumber: "+44 7700 900004", address: "321 Park Road, Leeds", bio: "Food bank volunteer coordinator" },
    { id: "user005", displayName: "Admin User", email: "admin@foodshare.org", role: "admin", userType: "admin", phoneNumber: "+44 7700 900005", address: "1 Admin Lane, London", bio: "Platform administrator" },
    { id: "user006", displayName: "Editor User", email: "editor@foodshare.org", role: "editor", userType: "editor", phoneNumber: "+44 7700 900006", address: "2 Editor Road, London", bio: "Content editor for the platform" },
  ];
}

function generateFoodItems() {
  return [
    { id: "food001", name: "Fresh Bread Assortment", description: "Assorted fresh bread including sourdough, whole wheat, and baguettes", quantity: 20, status: "available", postedById: "user003", category: "Bakery", expirationDate: "2025-02-21", pickupInstructions: "Pick up from the back entrance between 5-7 PM", imageUrl: "https://example.com/images/bread.jpg", lat: 52.4862, lng: -1.8904, address: "789 Bread Lane", town: "Birmingham", county: "West Midlands", postcode: "B1 1AA", season: "1,2,3,4,5,6,7,8,9,10,11,12", originalType: "bakery", likes: 5, dislikes: 0 },
    { id: "food002", name: "Vegetable Box", description: "Mixed seasonal vegetables from local farm", quantity: 15, status: "available", postedById: "user001", category: "Vegetables", expirationDate: "2025-02-25", pickupInstructions: "Ring doorbell, someone will bring it out", imageUrl: "https://example.com/images/vegetables.jpg", lat: 51.5074, lng: -0.1278, address: "123 High Street", town: "London", county: "Greater London", postcode: "SW1A 1AA", season: "3,4,5,6,7,8,9", originalType: "vegetables", likes: 12, dislikes: 1 },
    { id: "food003", name: "Canned Goods Bundle", description: "Assorted canned soups, beans, and vegetables", quantity: 50, status: "available", postedById: "user001", category: "Pantry Items", expirationDate: "2026-06-01", pickupInstructions: "Available during business hours at reception", imageUrl: "https://example.com/images/canned.jpg", lat: 51.5074, lng: -0.1278, address: "123 High Street", town: "London", county: "Greater London", postcode: "SW1A 1AA", season: "1,2,3,4,5,6,7,8,9,10,11,12", originalType: "pantry", likes: 8, dislikes: 0 },
    { id: "food004", name: "Dairy Products", description: "Milk, yogurt, and cheese approaching best before date", quantity: 10, status: "available", postedById: "user003", category: "Dairy", expirationDate: "2025-02-23", pickupInstructions: "Please bring your own bags", imageUrl: "https://example.com/images/dairy.jpg", lat: 52.4862, lng: -1.8904, address: "789 Bread Lane", town: "Birmingham", county: "West Midlands", postcode: "B1 1AA", season: "1,2,3,4,5,6,7,8,9,10,11,12", originalType: "dairy", likes: 3, dislikes: 0 },
    { id: "food005", name: "Fruit Basket", description: "Fresh apples, oranges, and bananas", quantity: 8, status: "reserved", postedById: "user001", category: "Fruit", expirationDate: "2025-02-24", pickupInstructions: "Text when arriving", imageUrl: "https://example.com/images/fruit.jpg", lat: 51.5074, lng: -0.1278, address: "123 High Street", town: "London", county: "Greater London", postcode: "SW1A 1AA", season: "1,2,3,4,5,6,7,8,9,10,11,12", originalType: "fruit", likes: 6, dislikes: 0 },
  ];
}

function generateLocations() {
  return [
    { id: "loc001", name: "Apples", category: "Fruit", shortDescription: "Orchard behind St Thomas' Church.", description: "These apples grow in abundance during late summer in the orchard behind St Thomas' Church. Open access for community picking.", images: ["https://example.com/images/apples.jpg"], tags: ["fruit", "orchard", "community"], lat: 50.8733, lng: 0.009, likes: 1, dislikes: 0, months: [8, 9, 10], season: "8,9,10", whatThreeWords: "orchard.church.st.thomas", status: "active", postedById: "user001" },
    { id: "loc002", name: "Blackberries", category: "Fruit", shortDescription: "Along the path at the Pells.", description: "Along the path at the Pells.", images: ["https://example.com/images/blackberries.jpg"], tags: ["fruit", "orchard", "community"], lat: 50.879, lng: 0.0112, likes: 1, dislikes: 0, months: [8, 9], season: "8,9", whatThreeWords: "blackberries.pells.hedgerow", status: "active", postedById: "user001" },
    { id: "loc003", name: "Wild Garlic", category: "Vegetable", shortDescription: "In the woods near the old racecourse.", description: "In the woods near the old racecourse.", images: ["https://example.com/images/wild-garlic.jpg"], tags: ["vegetable", "wild", "foraging"], lat: 50.869, lng: 0.004, likes: 2, dislikes: 0, months: [3, 4], season: "3,4", whatThreeWords: "garlic.woods.racecourse", status: "active", postedById: "user002" },
    { id: "loc004", name: "Elderflower", category: "Flower", shortDescription: "Common in the hedgerows on Chapel Hill.", description: "Common in the hedgerows on Chapel Hill.", images: ["https://example.com/images/elderflower.jpg"], tags: ["flower", "hedgerow", "foraging"], lat: 50.8755, lng: -0.002, likes: 2, dislikes: 0, months: [5, 6], season: "5,6", whatThreeWords: "elderflower.chapel.hill", status: "active", postedById: "user002" },
    { id: "loc005", name: "Southover Grange Apples", category: "Fruit", shortDescription: "A few trees in the Southover Grange Gardens.", description: "A few trees in the Southover Grange Gardens.", images: ["https://example.com/images/apples.jpg"], tags: ["fruit", "garden", "community"], lat: 50.87, lng: 0.015, likes: 0, dislikes: 1, months: [9, 10], season: "9,10", whatThreeWords: "grange.gardens.southover", status: "active", postedById: "user002" },
    { id: "loc006", name: "Wild Garlic Southover", category: "Herb", shortDescription: "Wild garlic in the Southover Grange Gardens.", description: "A few trees in the Southover Grange Gardens.", images: ["https://example.com/images/apples.jpg"], tags: ["herb", "garden", "community"], lat: 50.872, lng: 0.017, likes: 0, dislikes: 1, months: [9, 10], season: "9,10", whatThreeWords: "wild.garlic.southover", status: "active", postedById: "user003" },
  ];
}

function generateRequests() {
  return [
    { id: "req001", requestedById: "user002", foodItemId: "food001", status: "pending", messageToDonor: "We can pick this up this evening if still available" },
    { id: "req002", requestedById: "user004", foodItemId: "food002", status: "approved", messageToDonor: "Our food bank would greatly appreciate these vegetables" },
    { id: "req003", requestedById: "user002", foodItemId: "food005", status: "approved", messageToDonor: "Perfect for our community breakfast tomorrow" },
  ];
}

function generateCommunities() {
  return [
    { id: "comm001", name: "London Food Sharing Network", location: "London, UK", description: "Connecting food donors with those in need across Greater London", moderatorId: "user001" },
    { id: "comm002", name: "Birmingham Community Kitchen", location: "Birmingham, UK", description: "Community kitchen accepting food donations for meal preparation", moderatorId: "user003" },
  ];
}

function generateReviews() {
  return [
    { id: "rev001", reviewerId: "user002", reviewedUserId: "user001", requestId: "req002", rating: 5, comment: "Excellent donation, very fresh vegetables. Great communication!" },
    { id: "rev002", reviewerId: "user004", reviewedUserId: "user003", requestId: "req001", rating: 4, comment: "Good quality bread, easy pickup process" },
  ];
}

function generateReports() {
  return [
    { id: "rep001", category: "Incorrect Location", details: "The listed location for this item is incorrect. The actual pickup is at 125 High Street, not 123.", status: "pending", locationName: "Apples", locationId: "loc001", reportedById: "user002" },
    { id: "rep002", category: "Item Unavailable", details: "This item was already collected when I arrived. Please mark as unavailable.", status: "pending", locationName: "Blackberries", locationId: "loc002", reportedById: "user004" },
  ];
}

// ──────────────────────────────────────────
// Main Seed Functions
// ──────────────────────────────────────────

async function seedCategories() {
  logStep("Seeding categories...");
  const data = generateCategories().map(c => ({ ...c, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_CATEGORY_INSERT, { data });
  logSuccess(`Inserted ${data.length} categories`);
  return result;
}

async function seedUsers() {
  logStep("Seeding users...");
  const data = generateUsers().map(u => ({ ...u, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_USER_INSERT, { data });
  logSuccess(`Inserted ${data.length} users`);
  return result;
}

async function seedFoodItems() {
  logStep("Seeding food items...");
  const data = generateFoodItems().map(i => ({ ...i, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_FOODITEM_INSERT, { data });
  logSuccess(`Inserted ${data.length} food items`);
  return result;
}

async function seedLocations() {
  logStep("Seeding locations...");
  const data = generateLocations().map(l => ({ ...l, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_LOCATION_INSERT, { data });
  logSuccess(`Inserted ${data.length} locations`);
  return result;
}

async function seedRequests() {
  logStep("Seeding requests...");
  const data = generateRequests().map(r => ({ ...r, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_REQUEST_INSERT, { data });
  logSuccess(`Inserted ${data.length} requests`);
  return result;
}

async function seedCommunities() {
  logStep("Seeding communities...");
  const data = generateCommunities().map(c => ({ ...c, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_COMMUNITY_INSERT, { data });
  logSuccess(`Inserted ${data.length} communities`);
  return result;
}

async function seedReviews() {
  logStep("Seeding reviews...");
  const data = generateReviews().map(r => ({ ...r, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_REVIEW_INSERT, { data });
  logSuccess(`Inserted ${data.length} reviews`);
  return result;
}

async function seedReports() {
  logStep("Seeding reports...");
  const data = generateReports().map(r => ({ ...r, createdAt: new Date().toISOString() }));
  const result = await executeMutation(MUTATION_REPORT_INSERT, { data });
  logSuccess(`Inserted ${data.length} reports`);
  return result;
}

async function clearAllData() {
  logWarning("Clearing all existing data...");
  const tables = [
    "report", "review", "request", "community",
    "foodItem", "location", "user", "category"
  ];
  for (const table of tables) {
    try {
      await executeMutation(`mutation { ${table}_deleteMany(all: true) }`);
      logSuccess(`Cleared ${table}`);
    } catch (e) {
      logWarning(`Could not clear ${table}: ${e.message}`);
    }
  }
}

async function verifyData() {
  logStep("Verifying seeded data...");
  const result = await executeMutation(MUTATION_CHECK);
  const counts = result.categories ? result : result;
  const actualCounts = counts.categories || counts;

  console.log(`\n  ${BOLD}Table Counts:${RESET}`);
  for (const [key, val] of Object.entries(actualCounts)) {
    console.log(`  ├─ ${key}: ${val._count}`);
  }
  console.log();

  const expected = {
    categories: 21, users: 6, foodItems: 5,
    locations: 6, requests: 3, communities: 2,
    reviews: 2, reports: 2,
  };

  let allGood = true;
  for (const [table, expectedCount] of Object.entries(expected)) {
    const actual = actualCounts[table]?._count ?? 0;
    if (actual >= expectedCount) {
      logSuccess(`${table}: ${actual} (expected ${expectedCount})`);
    } else {
      logWarning(`${table}: ${actual} (expected ${expectedCount})`);
      allGood = false;
    }
  }
  return allGood;
}

// ──────────────────────────────────────────
// Main
// ──────────────────────────────────────────

async function main() {
  logHeader("🍎 Foodshare Database Seeder (REST API)");

  const mode = isEmulator ? "EMULATOR" : "PRODUCTION";
  console.log(`  Mode: ${BLUE}${mode}${RESET}`);
  console.log(`  Project: ${BLUE}${PROJECT_ID}${RESET}`);
  console.log(`  Location: ${BLUE}${LOCATION}${RESET}`);
  if (isEmulator) console.log(`  Emulator: ${BLUE}${EMULATOR_HOST}${RESET}`);

  const args = process.argv.slice(2);
  const shouldClear = args.includes("--clear") || args.includes("-c");
  const skipVerify = args.includes("--no-verify") || args.includes("-n");
  const seedAll = !args.includes("--categories-only") && !args.includes("--users-only");

  try {
    if (shouldClear) await clearAllData();

    await seedCategories();
    await delay(200);

    await seedUsers();
    await delay(200);

    if (seedAll) {
      await seedFoodItems(); await delay(200);
      await seedLocations(); await delay(200);
      await seedRequests(); await delay(200);
      await seedCommunities(); await delay(200);
      await seedReviews(); await delay(200);
      await seedReports(); await delay(200);
    }

    logHeader("Seeding Complete!");

    if (!skipVerify) {
      const verified = await verifyData();
      if (verified) {
        logSuccess("\n🎉 All data seeded and verified successfully!");
      } else {
        logWarning("\n⚠️  Some tables have unexpected counts.");
      }
    }

    process.exit(0);
  } catch (error) {
    logError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();