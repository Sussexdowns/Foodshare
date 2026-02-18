// --- app.js ---
var fileCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_-5xXDk3-S1VfgYvEABOXgGD0zC1WbaGs2PZIQ5Cph3ndo0FNq5KpDRcr0PwUxfLsdwpwf_JeFzrn/pub?output=csv';
var fileExec = 'https://script.google.com/macros/s/AKfycbx4NCdQmCLWdTPgLQuHyUmxg6ajNPbh9jV5BQKvRT50iP9u53TOvyilTb-V7KiDswjl/exec';



document.addEventListener('DOMContentLoaded', initApp);

// --- Global Variables ---
let map;
let allLocations = [];
let markers = [];
let heatLayer = null;
let footerTimeout;
let useFontAwesome = true;
let footerDetailsLoaded = false;
let itemsData = {}; // Store items from items.json
let ukCounties = []; // Store UK counties data
let loadedCounties = new Set(); // Track which county CSVs have been loaded
let userLocation = null; // Store user's detected location
const ZOOM_THRESHOLD = 13; // Show heatmap when zoomed out beyond this level
const COUNTY_LOAD_ZOOM_THRESHOLD = 10; // Zoom level at which to load county data

// Category to FontAwesome icon mapping for dropdowns
const categoryIcons = {
  'fruits': '🍎',
  'vegetables': '🥕',
  'flowers': '🌸',
  'herbs': '🌿',
  'mushrooms': '🍄',
  'other': '⬤'
};



// --- Configuration ---
// Check localStorage for saved settings, otherwise use default
const configUseJson = localStorage.getItem('useJsonAsSource');
const configSheetURL = localStorage.getItem('sheetURL');
const configUserAddress = localStorage.getItem('userAddress');

// Use local CSV file for test data
const useLocalCSV = true;
const localCSVFile = 'data/sussex_free_food_locations.csv';

// Default center - Lewes, East Sussex, UK
const DEFAULT_CENTER = [50.873, 0.009];
const DEFAULT_ZOOM = 12;

// Nominatim API for geocoding
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

// --- IMPORTANT: Paste your published Google Sheet CSV URL here ---
// Use saved URL from localStorage if available, otherwise use default
const sheetURL = configSheetURL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_-5xXDk3-S1VfgYvEABOXgGD0zC1WbaGs2PZIQ5Cph3ndo0FNq5KpDRcr0PwUxfLsdwpwf_JeFzrn/pub?output=csv'; // 👈 PASTE YOUR URL HERE
const jsonfile = 'locations.json'; // Assume this JSON file exists with base location data

// --- Initialization ---
function initApp() {
  addStatusMessage('🚀 Initializing application...', 'success');
  debugLibraries();

  // Load categories.json, items.json, and uk_counties.json in parallel
  Promise.all([
    fetch('categories.json').then(res => res.json()).catch(() => null),
    fetch('items.json').then(res => res.json()).catch(() => null),
    fetch('uk_counties.json').then(res => res.json()).catch(() => null)
  ])
    .then(([categoriesData, itemsData, countiesData]) => {
      window.categoriesData = categoriesData;
      window.itemsData = itemsData || {};
      ukCounties = countiesData?.counties || [];

      console.log('Loaded items data:', window.itemsData);
      console.log('Loaded UK counties:', ukCounties.length);

      // Continue with other initialization
      loadFooterDetailsTemplate().then(() => {
        initMap();
        detectUserLocationAndLoadData();
      });
    })
    .catch(error => {
      console.error('Error loading config files:', error);
      window.itemsData = {};
      // Continue without config data
      loadFooterDetailsTemplate().then(() => {
        initMap();
        fetchData(); // Fallback to default data loading
      });
    });
}

/**
 * Loads the footer-details.html template
 */
function loadFooterDetailsTemplate() {
  return fetch('footer-details.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById('footer-details-container');
      if (container) {
        // Extract the HTML content (without the script tag)
        const htmlWithoutScript = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '');
        container.innerHTML = htmlWithoutScript;
        footerDetailsLoaded = true;
        console.log('Footer details template loaded');

        // Attach close button event listener
        attachFooterDetailsCloseListener();
      }
    })
    .catch(error => {
      console.error('Error loading footer-details template:', error);
      // Create fallback template
      createFallbackFooterTemplate();
    });
}

/**
 * Attaches close button listener for footer details
 */
function attachFooterDetailsCloseListener() {
  const closeBtn = document.getElementById('footer-close');
  const footer = document.getElementById('footer-details');

  if (closeBtn && footer) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      footer.classList.remove('open');
    });
  }

  // Also attach click-to-open handler
  const overlay = document.getElementById('footer-closed-overlay');
  if (overlay) {
    overlay.addEventListener('click', function () {
      footer.classList.add('open');
    });
  }
}

/**
 * Creates a fallback footer template if the file can't be loaded
 */
function createFallbackFooterTemplate() {
  const container = document.getElementById('footer-details-container');
  if (container) {
    container.innerHTML = `
      <div id="footer-details">
        <button type="button" id="footer-close" class="footer-close-btn" aria-label="Close" title="Close details">
          <i class="fas fa-times"></i>
        </button>
        
        <!-- Click to open overlay -->
        <div id="footer-closed-overlay" class="footer-overlay">
          <span><i class="fa fa-info-circle"></i> Click to see location details</span>
        </div>
        
        <img id="footer-image" src="" alt="Location Image" style="display: none; max-width: 120px; max-height: 120px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
        <div class="footer-content" style="flex: 1;">
          <div class="d-flex align-items-center mb-2 flex-wrap gap-2">
            <h5 id="footer-title" class="mb-0 me-2">Click on a pin to see details</h5>
            <span id="footer-category" class="badge bg-secondary">Other</span>
          </div>
          <p id="footer-description" class="mb-2 text-muted"></p>
          <div id="footer-actions" class="footer-actions" data-id="" style="display: none; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button class="footer-like-btn btn btn-sm btn-outline-success" title="Like">
              <i class="fa fa-thumbs-up"></i> <span>0</span>
            </button>
            <button class="footer-dislike-btn btn btn-sm btn-outline-danger" title="Dislike">
              <i class="fa fa-thumbs-down"></i> <span>0</span>
            </button>
            <button class="footer-report-btn btn btn-sm btn-outline-warning" title="Report">
              <i class="fa fa-flag"></i>
            </button>
          </div>
          <div class="footer-links" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <a id="footer-directions" href="#" target="_blank" class="btn btn-sm btn-outline-primary" style="display: none;">
              <i class="fa fa-map-marker-alt"></i> Get Directions
            </a>
            <a id="footer-link" href="#" class="btn btn-sm btn-outline-primary" target="_blank" style="display: none;">
              <i class="fa fa-info-circle"></i> Learn more
            </a>
          </div>
        </div>
      </div>
      <style>
        .footer-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #6c757d;
          background-color: rgba(255, 255, 255, 0.95);
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .footer-close-btn:hover {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }
        .footer-close-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.4);
          border-color: #dc3545;
        }
        .footer-close-btn:active {
          transform: scale(0.95);
        }
        
        /* Footer overlay when closed */
        .footer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          z-index: 10;
          transition: background-color 0.2s ease;
        }

        .footer-overlay:hover {
          background: rgba(230, 230, 230, 0.95);
        }

        .footer-overlay span {
          font-size: 14px;
          color: #6c757d;
          pointer-events: none;
        }

        /* Footer open state */
        #footer-details {
          visibility: hidden;
          opacity: 0;
        }

        #footer-details.open {
          visibility: visible;
          opacity: 1;
        }

        #footer-details.open .footer-overlay {
          display: none;
        }

        #footer-details.open #footer-actions {
          display: flex !important;
        }
      </style>
    `;
    footerDetailsLoaded = true;
    console.log('Fallback footer template created');

    // Attach close button event listener
    attachFooterDetailsCloseListener();

    // Attach click-to-open handler
    const footer = document.getElementById('footer-details');
    const overlay = document.getElementById('footer-closed-overlay');
    if (footer && overlay) {
      overlay.addEventListener('click', function () {
        footer.classList.add('open');
      });
    }
  }
}

function initMap() {
  const lewes = [50.873, 0.009];

  // Check if dark mode is enabled
  const isDarkMode = document.body.classList.contains('dark-mode');

  // Choose tile layer based on dark mode
  const tileUrl = isDarkMode
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Use CartoDB Dark Matter for dark mode, standard OSM for light mode
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  map = L.map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }
  }).setView(lewes, 14);

  // Add tile layer - use dark theme in dark mode
  const currentTileUrl = isDarkMode ? darkTileUrl : lightTileUrl;
  L.tileLayer(currentTileUrl, {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | © <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  // Add zoom event listener to toggle between markers and heatmap
  map.on('zoomend', handleZoomChange);

  // Add moveend event listener to load counties when map moves
  map.on('moveend', handleMapMove);

  // Listen for dark mode changes to switch tile layer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        updateMapTheme();
      }
    });
  });
  observer.observe(document.body, { attributes: true });

  // Center map on user's location if set
  centerMapOnUserLocation();
}

/**
 * Centers the map on the user's saved location or defaults to Lewes
 */
function centerMapOnUserLocation() {
  const userAddress = configUserAddress || localStorage.getItem('userAddress');

  if (userAddress && userAddress.trim()) {
    geocodeAddress(userAddress)
      .then(coords => {
        if (coords) {
          map.setView(coords, 12);
          addStatusMessage(`📍 Map centered on: ${userAddress}`, 'info');
        } else {
          // Fallback to default if geocoding fails
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        }
      })
      .catch(() => {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      });
  } else {
    // Default to Lewes
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  }
}

/**
 * Detects user location and loads appropriate county data
 * Uses browser geolocation API if available, otherwise falls back to saved address
 */
function detectUserLocationAndLoadData() {
  // First check if user has a saved address
  const savedAddress = configUserAddress || localStorage.getItem('userAddress');

  if (savedAddress && savedAddress.trim()) {
    geocodeAddress(savedAddress)
      .then(coords => {
        if (coords) {
          userLocation = coords;
          map.setView(coords, 12);
          addStatusMessage(`📍 Location detected from saved address: ${savedAddress}`, 'info');
          loadCountiesForMapView();
        } else {
          tryBrowserGeolocation();
        }
      })
      .catch(() => {
        tryBrowserGeolocation();
      });
  } else {
    tryBrowserGeolocation();
  }
}

/**
 * Attempts to get user location via browser geolocation API
 */
function tryBrowserGeolocation() {
  if ('geolocation' in navigator) {
    addStatusMessage('📍 Detecting your location...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 12);
        addStatusMessage(`📍 Location detected via browser`, 'success');
        loadCountiesForMapView();
      },
      (error) => {
        console.log('Geolocation error:', error.message);
        addStatusMessage('📍 Could not detect location, using default', 'warning');
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        loadCountiesForMapView();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  } else {
    addStatusMessage('📍 Geolocation not supported, using default', 'warning');
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    loadCountiesForMapView();
  }
}

/**
 * Handles map move events - loads county data when user pans/zooms
 */
function handleMapMove() {
  const currentZoom = map.getZoom();

  // Only load counties when zoomed in enough
  if (currentZoom >= COUNTY_LOAD_ZOOM_THRESHOLD) {
    loadCountiesForMapView();
  }
}

/**
 * Loads county CSV files for counties visible in the current map view
 */
function loadCountiesForMapView() {
  if (ukCounties.length === 0) {
    console.warn('No UK counties data loaded');
    fetchData(); // Fallback to default data loading
    return;
  }

  const bounds = map.getBounds();
  const currentZoom = map.getZoom();
  const countiesToLoad = [];

  // Find counties that intersect with the current map view
  ukCounties.forEach(county => {
    // Check if county bounds intersect with map bounds
    if (county.bounds) {
      const countyBounds = county.bounds;
      const countyNorth = countyBounds.north;
      const countySouth = countyBounds.south;
      const countyEast = countyBounds.east;
      const countyWest = countyBounds.west;

      // Check for intersection
      const intersects = (
        countyNorth >= bounds.getSouth() &&
        countySouth <= bounds.getNorth() &&
        countyEast >= bounds.getWest() &&
        countyWest <= bounds.getEast()
      );

      if (intersects && county.csvFile && !loadedCounties.has(county.id)) {
        countiesToLoad.push(county);
      }
    }
  });

  if (countiesToLoad.length > 0) {
    addStatusMessage(`🗺️ Loading ${countiesToLoad.length} county dataset(s)...`, 'info');
    loadCountyCSVFiles(countiesToLoad);
  } else if (loadedCounties.size === 0) {
    // No counties to load and none loaded yet - try to find nearest county with data
    loadNearestCountyWithData();
  }
}

/**
 * Loads the nearest county with data based on map center
 */
function loadNearestCountyWithData() {
  const center = map.getCenter();
  let nearestCounty = null;
  let minDistance = Infinity;

  ukCounties.forEach(county => {
    if (county.csvFile && county.center) {
      const distance = Math.sqrt(
        Math.pow(center.lat - county.center[0], 2) +
        Math.pow(center.lng - county.center[1], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCounty = county;
      }
    }
  });

  if (nearestCounty) {
    addStatusMessage(`🗺️ Loading nearest county: ${nearestCounty.name}`, 'info');
    loadCountyCSVFiles([nearestCounty]);
  } else {
    // No county data available, fallback to default
    addStatusMessage('📍 No county data available for this area', 'warning');
    fetchData();
  }
}

/**
 * Loads multiple county CSV files with graceful failure
 * @param {Array} counties - Array of county objects to load
 */
async function loadCountyCSVFiles(counties) {
  const loadPromises = counties.map(county =>
    loadSingleCountyCSV(county)
      .then(data => ({ county, data, success: true }))
      .catch(error => ({ county, error, success: false }))
  );

  const results = await Promise.all(loadPromises);

  let successCount = 0;
  let failCount = 0;
  const newLocations = [];

  results.forEach(result => {
    if (result.success && result.data) {
      loadedCounties.add(result.county.id);
      newLocations.push(...result.data);
      successCount++;
      console.log(`✅ Loaded ${result.county.name}: ${result.data.length} locations`);
    } else {
      failCount++;
      console.warn(`❌ Failed to load ${result.county.name}:`, result.error);
    }
  });

  if (newLocations.length > 0) {
    // Merge with existing locations (avoid duplicates by ID)
    const existingIds = new Set(allLocations.map(loc => loc.id));
    const uniqueNewLocations = newLocations.filter(loc => !existingIds.has(loc.id));
    allLocations = [...allLocations, ...uniqueNewLocations];

    // Re-render markers (pass true for isAdditionalData to avoid resetting filters)
    initializeAppData(allLocations, true);
  }

  if (successCount > 0) {
    addStatusMessage(`✅ Loaded ${successCount} county dataset(s), ${newLocations.length} locations`, 'success');
  }
  if (failCount > 0) {
    addStatusMessage(`⚠️ ${failCount} county dataset(s) not available yet`, 'warning');
  }
}

/**
 * Loads a single county CSV file with graceful error handling
 * @param {Object} county - County object with csvFile property
 * @returns {Promise<Array>} Array of location objects
 */
async function loadSingleCountyCSV(county) {
  if (!county.csvFile) {
    throw new Error(`No CSV file defined for ${county.name}`);
  }

  try {
    const response = await fetch(county.csvFile);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Empty CSV file');
    }

    const parsedData = parseCSV(csvText);

    if (parsedData.length === 0) {
      throw new Error('No data rows in CSV');
    }

    const processedData = processCSVData(parsedData);

    // Add county info to each location
    return processedData.map(loc => ({
      ...loc,
      county: county.name,
      countyId: county.id
    }));
  } catch (error) {
    // Graceful failure - log but don't throw
    console.warn(`Failed to load ${county.name} CSV:`, error.message);
    throw error;
  }
}

/**
 * Geocodes an address using Nominatim API
 * @param {string} address - The address to geocode
 * @returns {Promise<[number, number]|null>} - Returns [lat, lng] or null if not found
 */
async function geocodeAddress(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${NOMINATIM_API}?q=${encodedAddress}&format=json&limit=1&countrycodes=gb`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return [parseFloat(result.lat), parseFloat(result.lon)];
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Updates the map tile layer based on dark mode state
 */
function updateMapTheme() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const newTileUrl = isDarkMode ? darkTileUrl : lightTileUrl;

  // Remove existing tile layer and add new one
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
      L.tileLayer(newTileUrl, {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | © <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
    }
  });

  addStatusMessage(isDarkMode ? '🌙 Dark mode: Using dark map theme' : '☀️ Light mode: Using light map theme', 'info');
}

// --- Data Fetching and Processing ---

/**
 * Fetches location data based on the useJsonAsSource configuration.
 * If useLocalCSV is true, loads from local CSV file.
 * If useJsonAsSource is true, loads from JSON and merges feedback from CSV.
 * If useJsonAsSource is false, loads all data from CSV.
 */
function fetchData() {
  if (useLocalCSV) {
    // Load from local CSV file
    addStatusMessage('Loading data from local CSV file...', 'info');
    fetch(localCSVFile)
      .then(res => res.text())
      .then(csvData => {
        const parsedData = parseCSV(csvData);
        const processedData = processCSVData(parsedData);
        allLocations = processedData;
        initializeAppData(allLocations);
      })
      .catch(handleFetchError);
    return;
  }

  if (!sheetURL || sheetURL === 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL') {
    console.error('Error: Google Sheet URL is not set. Please update the `sheetURL` variable in app.js.');
    alert('Application is not configured correctly. The Google Sheet URL is missing.');

    // Fallback to JSON if available (but now with feedback from the sheet if possible)
    if (configUseJson) {
      Promise.all([
        fetch(jsonfile).then(res => res.json()),
        fetch(sheetURL).then(res => res.text()).catch(() => '') // Fetch sheet data, but don't fail if sheet is unreachable for feedback
      ])
        .then(([locationsData, csvData]) => {
          const feedbackRows = csvData ? parseCSV(csvData) : [];
          const processedData = processJSONData(locationsData, feedbackRows); // Use new processJSONData
          allLocations = processedData;
          initializeAppData(allLocations);
        })
        .catch(handleFetchError);
    }
    return;
  }

  if (configUseJson) {
    // Behavior: JSON as primary source, CSV for feedback
    addStatusMessage('Loading data from JSON with CSV feedback...', 'info');
    Promise.all([
      fetch(jsonfile).then(res => res.json()),
      fetch(sheetURL).then(res => res.text()) // Always try to get CSV feedback
    ])
      .then(([locationsData, csvData]) => {
        const feedbackRows = parseCSV(csvData);
        const processedData = processJSONData(locationsData, feedbackRows); // Use new processJSONData
        allLocations = processedData;
        initializeAppData(allLocations);
      })
      .catch(handleFetchError);
  } else {
    // Behavior: CSV as primary source (current working mode)
    addStatusMessage('Loading all data from CSV...', 'info');
    fetch(sheetURL)
      .then(res => res.text())
      .then(csvData => {
        const parsedData = parseCSV(csvData);
        const processedData = processCSVData(parsedData);
        allLocations = processedData;
        initializeAppData(allLocations);
      })
      .catch(handleFetchError);
  }
}

/**
 * Processes CSV data to extract both location information and feedback.
 * Expects CSV to have columns for location data (id, name, lat, lng, etc.) and feedback data.
 * @param {Array} csvData - The parsed CSV data (array of objects)
 * @returns {Array} Processed location data with aggregated feedback
 */
function processCSVData(csvData) {
  console.log('Processing CSV data with', csvData.length, 'rows');

  const locationMap = new Map(); // Map to store locations, keyed by ID

  csvData.forEach((row, index) => {
    // console.log(`Row ${index}:`, row); // Keep for detailed row inspection if needed

    if (!row.id) {
      // console.log(`Row ${index} skipped: no ID`); // Commented out to reduce console noise unless needed
      return;
    }

    const id = String(row.id).trim(); // Ensure ID is a string for consistent map keys

    let location = locationMap.get(id);

    if (!location) {
      // If it's a new location, create the base object
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for location ${id}: lat=${row.lat}, lng=${row.lng}. Skipping location creation for this row.`);
        return; // Skip this row if core location data is invalid for a new location
      }

      // Map CSV columns to app format:
      // - category (CSV) -> food category (fruits, vegetables, herbs) for app category
      // - sub-category -> item name for filtering
      // - type -> stored as originalType for reference
      // - name -> locationName for display
      // Handle both hyphenated (sub-category) and underscore (sub_category) column names
      const subCategoryValue = row.sub_category || row['sub-category'] || '';
      const foodCategory = row.category ? row.category.trim() : 'other';

      location = {
        id: parseInt(id), // Store ID as integer in the object
        name: subCategoryValue || foodCategory, // Use sub-category or food category as name
        locationName: row.name ? row.name.trim() : `Location ${id}`, // Store location name separately
        lat: lat,
        lng: lng,
        category: foodCategory, // Use food category (fruits, vegetables, herbs)
        originalType: row.type ? row.type.trim() : '', // Store original type for reference
        description: row.description ? row.description.trim() : '',
        short_description: row.short_description ? row.short_description.trim() : (row.short_description ? row.short_description.trim() : ''),
        season: parseSeasonData(row.months || row.season), // Parse months column (supports both formats)
        // Ensure image and link are trimmed to avoid leading/trailing spaces
        image: row.image ? row.image.trim() : '',
        likes: parseInt(row.likes) || 0,    // Initialize likes for new location
        dislikes: parseInt(row.dislikes) || 0, // Initialize dislikes for new location
        // Ensure link is trimmed to avoid leading/trailing spaces
        link: row.link ? row.link.trim() : '',
        // Additional fields from CSV
        town: row.town ? row.town.trim() : '',
        county: row.county ? row.county.trim() : '',
        postcode: row.postcode ? row.postcode.trim() : '',
        address: row.address ? row.address.trim() : '',
        tags: row.tags ? row.tags.trim() : ''
      };

      // Use short_description from CSV if available
      if (row.short_description) {
        location.short_description = row.short_description.trim();
      }

      locationMap.set(id, location);
      // console.log(`Added new location to map: ${id}`, location);
    }

    // Now, process feedback for this row and add to the *existing* or *newly created* location object
    // This logic allows for feedback to be aggregated even if location details are defined in a different row
    // Handle both 'approved' (lowercase from local CSV) and 'Approved' (from Google Sheets)
    const approvedValue = row.approved || row.Approved;
    if (approvedValue && approvedValue.trim().toUpperCase() === 'TRUE') {
      const likesToAdd = parseInt(row.likes, 10) || 0;
      const dislikesToAdd = parseInt(row.dislikes, 10) || 0;

      location.likes += likesToAdd;
      location.dislikes += dislikesToAdd;

      // console.log(`Updated location ${id}: likes=${location.likes}, dislikes=${location.dislikes}`);
    } // else if (approvedValue) {
    // console.log(`Feedback for ID ${id} not approved: approved=${approvedValue}`);
    // }
  });

  console.log(`Finished processing CSV. Found ${locationMap.size} unique locations.`);
  const finalLocations = Array.from(locationMap.values());
  // console.log('Final processed locations:', finalLocations); // Uncomment for full debug
  return finalLocations;
}


/**
 * Processes JSON location data and merges feedback from CSV.
 * @param {Array} jsonData - The array of locations from locations.json.
 * @param {Array} feedbackRows - The parsed array of data (feedback) from the Google Sheet CSV.
 * @returns {Array} The processed location data with aggregated feedback.
 */
function processJSONData(jsonData, feedbackRows) {
  console.log('Processing JSON data and merging CSV feedback...');

  const locationMap = new Map();

  // 1. Populate locationMap with initial JSON data
  jsonData.forEach(loc => {
    // Ensure base likes/dislikes are initialized for JSON items too
    loc.likes = loc.likes || 0;
    loc.dislikes = loc.dislikes || 0;
    loc.id = loc.id ? parseInt(loc.id) : 0; // Ensure ID is integer
    loc.season = loc.season ? parseSeasonData(loc.season) : []; // Parse seasons if present in JSON

    locationMap.set(String(loc.id), loc); // Use string ID for consistency
  });

  console.log(`Finished processing JSON with CSV feedback. Total locations: ${locationMap.size}`);
  const finalLocations = Array.from(locationMap.values());
  // console.log('Final processed locations (JSON source):', finalLocations); // Uncomment for full debug
  return finalLocations;
}


/**
 * Parses season data from CSV format (e.g., "1,2,3" or "January,February,March" or "7;8;9")
 * @param {string} seasonStr - The season string from CSV
 * @returns {Array<number>} Array of month numbers (1-12)
 */
function parseSeasonData(seasonStr) {
  if (!seasonStr) return [];

  const months = ["january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"];

  return seasonStr.split(/[,;]/)  // Support both comma and semicolon separators
    .map(s => s.trim().toLowerCase())
    .map(s => {
      // Try parsing as number first
      const num = parseInt(s);
      if (!isNaN(num) && num >= 1 && num <= 12) return num;

      // Try parsing as month name
      const monthIndex = months.indexOf(s);
      return monthIndex >= 0 ? monthIndex + 1 : null;
    })
    .filter(n => n !== null);
}

// >>>>>>>>> DELETED: mergeSheetData function is no longer needed <<<<<<<<<
// /**
//  * Merges the likes/dislikes from the Google Sheet into the location data.
//  * @param {Array} locations - The array of locations from locations.json.
//  * @param {Array} feedback - The parsed array of data from the Google Sheet.
//  * @returns {Array} The merged location data.
//  */
// function mergeSheetData(locations, feedback) {
//   // ... (deleted content)
// }


/**
 * Once all data is fetched and processed, this function populates the UI.
 * @param {Array} data - The final location data.
 * @param {boolean} isAdditionalData - If true, data is being added to existing data
 */
function initializeAppData(data, isAdditionalData = false) {
  allLocations = data; // Ensure global variable is set

  if (!isAdditionalData) {
    // Only reset filters and re-add event listeners on initial load
    populateFilters();
    addEventListeners();
  }

  displayAllLocations();

  const dataSource = configUseJson ? 'JSON + CSV feedback' : 'CSV only';
  const countyInfo = loadedCounties.size > 0 ? ` from ${loadedCounties.size} count${loadedCounties.size === 1 ? 'y' : 'ies'}` : '';
  addStatusMessage(`✅ App ready. Displaying ${allLocations.length} locations${countyInfo}.`, 'success');
}

/**
 * Handles errors during the fetch process.
 * @param {Error} error - The error object.
 */
function handleFetchError(error) {
  console.error('Error loading data:', error);

  // If JSON fetch failed and we were using JSON, try fallback to CSV
  if (configUseJson && error.message && error.message.includes('Failed to fetch')) {
    addStatusMessage('⚠️ JSON load failed, falling back to CSV...', 'warning');
    // Force CSV mode
    fetch(sheetURL)
      .then(res => res.text())
      .then(csvData => {
        const parsedData = parseCSV(csvData);
        const processedData = processCSVData(parsedData);
        allLocations = processedData;
        initializeAppData(allLocations);
      })
      .catch(csvError => {
        alert('Could not load location data from either JSON or CSV.');
        addStatusMessage('❌ Failed to load data from both JSON and CSV.', 'error');
      });
  } else {
    alert('Could not load location data. Please check the console for more details.');
    addStatusMessage('❌ Failed to load data. Check console.', 'error');
  }
}

/**
 * Parses a CSV string into an array of objects with proper quote handling.
 * @param {string} csvText - The CSV data as a string.
 * @returns {Array<Object>}
 */
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) {
    console.warn('CSV has fewer than 2 lines (headers + data):', lines.length);
    return [];
  }

  const headers = parseCSVLine(lines[0]);
  const result = [];

  // console.log('CSV Headers:', headers); // Uncomment for debug

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = parseCSVLine(lines[i]);
    const obj = {};

    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] !== undefined ? values[index].trim() : ''; // Handle missing values
    });

    result.push(obj);
  }

  // console.log(`Parsed ${result.length} CSV rows`); // Uncomment for debug
  // if (result.length > 0) {
  //   console.log('First CSV row:', result[0]); // Uncomment for debug
  // }

  return result;
}

/**
 * Parses a single CSV line, handling quoted values properly.
 * @param {string} line - A single CSV line
 * @returns {Array<string>} Array of values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current);

  return result;
}

// --- UI and Map Functions ---

function populateFilters() {
  const categorySelect = safeGet('category');
  const itemSelect = safeGet('item');

  // Check if category dropdown already has options
  // If it does, don't overwrite it
  if (categorySelect.options.length <= 1) {
    // Populate categories from items.json if available
    if (window.itemsData && Object.keys(window.itemsData).length > 0) {
      categorySelect.innerHTML = '<option value="all">All Categories</option>';

      // Add categories from items.json in a consistent order
      const categoryOrder = ['fruits', 'vegetables', 'flowers', 'herbs', 'mushrooms', 'other'];
      const categories = categoryOrder.filter(cat => window.itemsData[cat] && window.itemsData[cat].length > 0);

      categories.forEach(categoryKey => {
        const displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
        const icon = categoryIcons[categoryKey] || '⬤';
        categorySelect.add(new Option(`${icon} ${displayName}`, categoryKey));
      });
    } else {
      // Fallback: populate from location data
      categorySelect.innerHTML = '<option value="all">All Categories</option>';
      const categories = [...new Set(allLocations.map(loc => loc.category))].sort();

      categories.forEach(category => {
        if (category && category !== 'Other') categorySelect.add(new Option(category, category));
      });
      if (categories.includes('Other')) {
        categorySelect.add(new Option('Other', 'Other'));
      }
    }
  }

  // Item dropdown starts with "All Items"
  itemSelect.innerHTML = '<option value="all">All Items</option>';
}

function addEventListeners() {
  const categorySelect = safeGet('category');
  const itemSelect = safeGet('item');

  // Category change listener - populate items from items.json
  categorySelect.addEventListener('change', function () {
    populateItemsForCategory(this.value);
    filterLocations();
  });

  itemSelect.addEventListener('change', filterLocations);

  // Month filter is handled by the custom month picker in index.html
  safeGet('toggle-icon-style').addEventListener('change', (e) => {
    useFontAwesome = e.target.checked;
    // Re-render markers to apply new icon style
    filterLocations(); // This will trigger marker recreation
  });
}

/**
 * Populates the item dropdown based on the selected category
 * Uses items.json to get all items for the category
 * Disables items that don't exist in the location data
 * Shows items in optgroups by category
 */
function populateItemsForCategory(categoryId) {
  const itemSelect = safeGet('item');

  // Clear existing options except first
  itemSelect.innerHTML = '<option value="all">All Items</option>';

  // If "all" is selected, show all items in optgroups
  if (!categoryId || categoryId === 'all') {
    populateAllItemsWithOptgroups();
    return;
  }

  // Get items from items.json for this category
  const items = window.itemsData?.[categoryId] || [];

  if (items.length === 0) {
    // No items found for this category, fall back to location data
    populateItemsFromLocationData(categoryId);
    return;
  }

  // Get items that exist in location data for this category
  const existingItems = new Set();
  allLocations.forEach(loc => {
    if (loc.category && loc.category.toLowerCase() === categoryId.toLowerCase() && loc.name) {
      existingItems.add(loc.name.toLowerCase());
    }
  });

  // Create optgroup for this category
  const optgroup = document.createElement('optgroup');
  const displayName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  const icon = categoryIcons[categoryId.toLowerCase()] || '⬤';
  optgroup.label = `${icon} ${displayName}`;

  // Add items to optgroup
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = item.name;

    // Check if item exists in database (case-insensitive)
    const exists = existingItems.has(item.name.toLowerCase());

    if (!exists) {
      option.disabled = true;
      option.textContent = `${item.name}`;
    }

    optgroup.appendChild(option);
  });

  itemSelect.appendChild(optgroup);
}

/**
 * Populates all items from all categories with optgroups
 * Called when "All Categories" is selected
 */
function populateAllItemsWithOptgroups() {
  const itemSelect = safeGet('item');

  // Clear existing options
  itemSelect.innerHTML = '<option value="all">All Items</option>';

  if (!window.itemsData || Object.keys(window.itemsData).length === 0) {
    return;
  }

  // Get all items from all categories
  const categoryOrder = ['fruits', 'vegetables', 'flowers', 'herbs', 'mushrooms', 'other'];

  // Get items that exist in location data
  const existingItems = new Set();
  allLocations.forEach(loc => {
    if (loc.name) {
      existingItems.add(loc.name.toLowerCase());
    }
  });

  categoryOrder.forEach(categoryKey => {
    const items = window.itemsData[categoryKey] || [];

    if (items.length === 0) return;

    // Create optgroup for this category
    const optgroup = document.createElement('optgroup');
    const displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    const icon = categoryIcons[categoryKey] || '⬤';
    optgroup.label = `${icon} ${displayName}`;

    // Add items to optgroup
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.name;
      option.textContent = item.name;

      // Check if item exists in database
      const exists = existingItems.has(item.name.toLowerCase());

      if (!exists) {
        option.disabled = true;
        option.textContent = `${item.name}`;
      }

      optgroup.appendChild(option);
    });

    itemSelect.appendChild(optgroup);
  });
}

/**
 * Fallback: populate items from location data when items.json doesn't have data for category
 */
function populateItemsFromLocationData(categoryId) {
  const itemSelect = safeGet('item');

  // Map category keys to display names for matching
  const categoryDisplayNames = {
    'fruits': 'Fruit',
    'vegetables': 'Vegetable',
    'flowers': 'Flower',
    'herbs': 'Herb',
    'mushrooms': 'Mushroom',
    'other': 'Other'
  };

  const displayName = categoryDisplayNames[categoryId.toLowerCase()] || categoryId;

  // Get items from location data for this category
  const items = [...new Set(allLocations
    .filter(loc => {
      const locCat = loc.category ? loc.category.toLowerCase() : '';
      return locCat === categoryId.toLowerCase() || locCat === displayName.toLowerCase();
    })
    .map(loc => loc.name)
  )].sort();

  // Create optgroup
  const optgroup = document.createElement('optgroup');
  const icon = categoryIcons[categoryId.toLowerCase()] || '⬤';
  optgroup.label = `${icon} ${displayName}`;

  items.forEach(item => {
    if (item) {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      optgroup.appendChild(option);
    }
  });

  itemSelect.appendChild(optgroup);
}

// Global month filter function called by the custom month picker
window.updateMonthFilter = function (months) {
  filterLocationsByMonths(months);
};

function filterLocations() {
  const category = safeGet('category').value;
  const item = safeGet('item').value;

  let filtered = allLocations;

  if (category !== 'all') {
    // Map dropdown category keys to display names used in location data
    const categoryDisplayNames = {
      'fruits': 'Fruit',
      'vegetables': 'Vegetable',
      'flowers': 'Flower',
      'herbs': 'Herb',
      'mushrooms': 'Mushroom',
      'other': 'Other'
    };
    const displayName = categoryDisplayNames[category.toLowerCase()] || category;
    filtered = filtered.filter(loc => loc.category === displayName || loc.category === category);
  }

  if (item !== 'all') filtered = filtered.filter(loc => loc.name === item);

  // Get selected months from the custom month picker
  const monthSelect = safeGet('month');
  const month = monthSelect ? parseInt(monthSelect.value, 10) : null;

  // If using the old month dropdown, handle it
  if (monthSelect && month > 0) {
    filtered = filtered.filter(loc => loc.season && Array.isArray(loc.season) && loc.season.includes(month));
  }

  displayFilteredLocations(filtered);
  addStatusMessage(`🔍 Filtered to ${filtered.length} locations`, 'success');
}

function filterLocationsByMonths(months) {
  const category = safeGet('category').value;
  const item = safeGet('item').value;

  let filtered = allLocations;

  if (category !== 'all') {
    // Map dropdown category keys to display names used in location data
    const categoryDisplayNames = {
      'fruits': 'Fruit',
      'vegetables': 'Vegetable',
      'flowers': 'Flower',
      'herbs': 'Herb',
      'mushrooms': 'Mushroom',
      'other': 'Other'
    };
    const displayName = categoryDisplayNames[category.toLowerCase()] || category;
    filtered = filtered.filter(loc => loc.category === displayName || loc.category === category);
  }

  if (item !== 'all') filtered = filtered.filter(loc => loc.name === item);

  // Filter by selected months
  if (months && months.length > 0) {
    const monthMap = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    const selectedMonthNumbers = months.map(m => monthMap[m]).filter(m => m);

    filtered = filtered.filter(loc =>
      loc.season && Array.isArray(loc.season) &&
      loc.season.some(s => selectedMonthNumbers.includes(s))
    );
  }

  displayFilteredLocations(filtered);
  addStatusMessage(`🔍 Filtered to ${filtered.length} locations`, 'success');
}

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

/**
 * Creates a heatmap layer from the given locations
 * @param {Array} locations - Array of location objects
 */
function createHeatmap(locations) {
  if (!L.heatLayer) {
    console.warn('Leaflet.heat plugin not loaded');
    return null;
  }

  // Create heat data array: [lat, lng, intensity]
  const heatData = locations.map(loc => [loc.lat, loc.lng, 0.5]);

  // Create heat layer with custom options
  const heat = L.heatLayer(heatData, {
    radius: 25,
    blur: 15,
    maxZoom: ZOOM_THRESHOLD - 1,
    gradient: {
      0.2: '#00ff00',  // Green (low)
      0.5: '#ffff00',  // Yellow (medium)
      0.8: '#ff0000',  // Red (high)
      1.0: '#800080'   // Purple (very high)
    }
  });

  return heat;
}

/**
 * Handles zoom changes to switch between markers and heatmap
 */
function handleZoomChange() {
  const currentZoom = map.getZoom();

  if (currentZoom <= ZOOM_THRESHOLD) {
    // Zoomed out - show heatmap, hide markers
    showHeatmap();
  } else {
    // Zoomed in - show markers, hide heatmap
    showMarkers();
  }
}

/**
 * Switches to heatmap view (hides markers, shows heat layer)
 */
function showHeatmap() {
  // Only show heatmap if we have locations
  if (allLocations.length === 0) return;

  // Hide markers
  clearMarkers();

  // Remove existing heat layer if any
  if (heatLayer) {
    map.removeLayer(heatLayer);
  }

  // Create and add new heat layer
  heatLayer = createHeatmap(allLocations);
  if (heatLayer) {
    heatLayer.addTo(map);
    addStatusMessage('🗺️ Switched to heatmap view (zoom in to see markers)', 'info');
  }
}

/**
 * Switches to marker view (hides heatmap, shows markers)
 */
function showMarkers() {
  // Remove heat layer
  if (heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
  }

  // Show markers
  allLocations.forEach(addMarker);
  addStatusMessage(`📍 Showing ${markers.length} markers (zoom out for heatmap)`, 'info');
}

/**
 * Updates the heatmap with filtered locations
 * @param {Array} filteredLocations - Array of filtered location objects
 */
function updateHeatmap(filteredLocations) {
  if (heatLayer) {
    map.removeLayer(heatLayer);
  }

  if (filteredLocations.length > 0) {
    heatLayer = createHeatmap(filteredLocations);
    if (heatLayer) {
      heatLayer.addTo(map);
    }
  }
}

function addMarker(location) {
  const categoryColors = {
    "Fruit": "red",
    "Vegetable": "green",
    "Flower": "purple",
    "Herb": "blue",
    "Mushroom": "orange",
    "Other": "gray"
  };
  const categoryIcons = {
    "Fruit": "apple-whole",
    "Vegetable": "carrot",
    "Flower": "seedling",
    "Herb": "leaf",
    "Mushroom": "mushroom",
    "Other": "map-marker-alt"
  };

  const color = categoryColors[location.category] || "purple";
  const iconName = categoryIcons[location.category] || "location-dot";

  // Use L.divIcon for Font Awesome control if needed, otherwise L.AwesomeMarkers.icon
  let markerIcon;
  if (useFontAwesome) {
    markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color};" class="marker-pin"></div><i class="fa fa-${iconName} fa-lg" style="color:white;text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -35]
    });
  } else {
    markerIcon = L.AwesomeMarkers.icon({ icon: iconName, prefix: 'fa', markerColor: color });
  }

  const marker = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(map);

  // Initialize likes/dislikes
  location.likes = location.likes || 0;
  location.dislikes = location.dislikes || 0;

  // Store location data on marker for easy access
  marker.locationData = location;

  // Click handler - show details in footer AND popup
  marker.on('click', () => {
    showFooterDetails(location);

    // Check if map is in fullscreen mode
    const isFullscreen = document.fullscreenElement !== null ||
      document.webkitFullscreenElement !== null ||
      map.isFullscreen === true;

    // Check if images should be shown
    const showImages = localStorage.getItem('showImages') !== 'false';

    // Build popup content based on fullscreen state
    let popupContent;

    if (isFullscreen) {
      // Enhanced popup for fullscreen mode with image, category badge, and links
      const imageHtml = showImages ? `
        <div style="margin-bottom: 8px;">
          <img src="${location.image || 'images/Image-not-found.png'}" 
               alt="Location" 
               style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px;"
               onerror="this.src='images/Image-not-found.png'">
        </div>
      ` : '';

      const categoryBadge = `
        <span class="badge bg-${getCategoryColor(location.category)}" style="margin-bottom: 8px;">
          ${location.originalType || location.category || 'Other'}
        </span>
      `;

      const directionsHtml = location.lat && location.lng ? `
        <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=walking" 
           target="_blank" 
           class="btn btn-sm btn-outline-primary"
           style="text-decoration: none; margin-right: 5px;">
          <i class="fa fa-map-marker-alt"></i> Get Directions
        </a>
      ` : '';

      const linkHtml = location.link ? `
        <a href="${location.link}" target="_blank" class="btn btn-sm btn-outline-primary" style="text-decoration: none;">
          <i class="fa fa-info-circle"></i> Learn more
        </a>
      ` : '';

      popupContent = `
        <div class="leaflet-popup-content" style="max-width: 280px;">
          ${imageHtml}
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <strong>${location.locationName || location.name}</strong>
            ${categoryBadge}
          </div>
          <small style="display: block; margin-bottom: 8px;">${location.short_description || location.description || ''}</small>
          <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
            ${directionsHtml}
            ${linkHtml}
          </div>
          <div class="popup-buttons" style="display: flex; gap: 5px;">
            <button class="btn btn-sm btn-outline-success popup-like" data-id="${location.id}" title="Like">
              <i class="fas fa-thumbs-up"></i> <span>${location.likes || 0}</span>
            </button>
            <button class="btn btn-sm btn-outline-danger popup-dislike" data-id="${location.id}" title="Dislike">
              <i class="fas fa-thumbs-down"></i> <span>${location.dislikes || 0}</span>
            </button>
            <button class="btn btn-sm btn-outline-warning popup-flag" data-id="${location.id}" title="Report">
              <i class="fas fa-flag"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      // Simple popup for normal mode
      popupContent = `
        <div class="leaflet-popup-content">
          <strong>${location.locationName || location.name}</strong><br>
          <small>${location.short_description || location.description || ''}</small>
          <div class="popup-buttons" style="margin-top: 8px; display: flex; gap: 5px;">
            <button class="btn btn-sm btn-outline-success popup-like" data-id="${location.id}" title="Like">
              <i class="fas fa-thumbs-up"></i> <span>${location.likes || 0}</span>
            </button>
            <button class="btn btn-sm btn-outline-danger popup-dislike" data-id="${location.id}" title="Dislike">
              <i class="fas fa-thumbs-down"></i> <span>${location.dislikes || 0}</span>
            </button>
            <button class="btn btn-sm btn-outline-warning popup-flag" data-id="${location.id}" title="Report">
              <i class="fas fa-flag"></i>
            </button>
          </div>
        </div>
      `;
    }

    marker.bindPopup(popupContent).openPopup();
  });

  // Hover handler - also show details on hover
  marker.on('mouseover', () => {
    showFooterDetails(location);
  });

  markers.push(marker);
}

// Event delegation for popup buttons (using document because popups are dynamically created)
document.addEventListener('click', function (e) {
  // Handle popup like button
  if (e.target.closest('.popup-like')) {
    const btn = e.target.closest('.popup-like');
    const id = btn.dataset.id;
    handleFeedbackClick('like', id, btn.closest('.leaflet-popup-content'));
  }
  // Handle popup dislike button
  if (e.target.closest('.popup-dislike')) {
    const btn = e.target.closest('.popup-dislike');
    const id = btn.dataset.id;
    handleFeedbackClick('dislike', id, btn.closest('.leaflet-popup-content'));
  }
  // Handle popup flag button
  if (e.target.closest('.popup-flag')) {
    const btn = e.target.closest('.popup-flag');
    const id = btn.dataset.id;
    handleFeedbackClick('report', id, btn.closest('.leaflet-popup-content'));
  }
});

function displayAllLocations() {
  clearMarkers();
  allLocations.forEach(addMarker);
  // Reset filters to "all" when displaying all locations
  safeGet('category').value = 'all';
  safeGet('item').value = 'all';

  // Reset the custom month picker
  const monthPickerInput = safeGet('month-picker-input');
  const selectedMonthsDisplay = safeGet('selected-months-display');
  if (monthPickerInput) {
    monthPickerInput.value = '';
    monthPickerInput.placeholder = 'Select months...';
  }
  if (selectedMonthsDisplay) {
    selectedMonthsDisplay.textContent = '';
  }
  // Uncheck all month checkboxes
  document.querySelectorAll('.month-checkbox').forEach(cb => cb.checked = false);

  // Only fit bounds if we have locations and this is initial load
  // Don't auto-zoom when loading additional county data
  if (allLocations.length > 0 && loadedCounties.size <= 1) {
    map.fitBounds(L.latLngBounds(allLocations.map(loc => [loc.lat, loc.lng])), { padding: [50, 50] });
  } else if (allLocations.length === 0) {
    // If no locations, center on default view
    map.setView([50.873, 0.009], 14);
  }
}

function displayFilteredLocations(locations) {
  clearMarkers();

  const currentZoom = map.getZoom();

  if (currentZoom <= ZOOM_THRESHOLD && locations.length > 0) {
    // Show heatmap when zoomed out
    updateHeatmap(locations);
  } else {
    // Show markers when zoomed in
    if (heatLayer) {
      map.removeLayer(heatLayer);
      heatLayer = null;
    }
    locations.forEach(addMarker);
  }

  if (locations.length > 0) {
    map.fitBounds(L.latLngBounds(locations.map(loc => [loc.lat, loc.lng])), { padding: [50, 50] });
  } else {
    // If no filtered locations, center on default view or show a message
    map.setView([50.873, 0.009], 14);
    addStatusMessage('😔 No locations match your filters.', 'warning');
  }
}

function showFooterDetails(location) {
  // Wait for footer template to be loaded
  if (!footerDetailsLoaded) {
    // Retry after a short delay
    setTimeout(() => showFooterDetails(location), 100);
    return;
  }

  const footerContainer = document.getElementById('footer-details-container');
  if (!footerContainer) return;

  const footer = footerContainer.querySelector('#footer-details');
  if (!footer) return;

  // Update content
  const title = footer.querySelector('#footer-title');
  const description = footer.querySelector('#footer-description');
  const categoryBadge = footer.querySelector('#footer-category');
  const directionsLink = footer.querySelector('#footer-directions');
  const link = footer.querySelector('#footer-link');
  const image = footer.querySelector('#footer-image');
  const footerActions = footer.querySelector('#footer-actions');
  const closeBtn = footer.querySelector('#footer-close');

  // Update title - show location name and item name
  if (title) {
    const locationName = location.locationName || location.name;
    const itemName = location.name && location.name !== locationName ? location.name : '';
    if (itemName) {
      title.textContent = `${locationName} - ${itemName}`;
    } else {
      title.textContent = locationName;
    }
  }

  if (description) {
    description.textContent = location.description || location.short_description || "No additional info.";
  }

  // Update category badge
  if (categoryBadge) {
    // Use originalType if available, otherwise use category
    const categoryText = location.originalType || location.category || 'Other';
    categoryBadge.textContent = categoryText;
    categoryBadge.className = `badge bg-${getCategoryColor(location.category)}`;
  }

  // Handle "Get Directions" link visibility based on coordinates
  if (directionsLink && location.lat && location.lng) {
    const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=walking`;
    directionsLink.href = directionsURL;
    directionsLink.style.display = 'inline-block';
    directionsLink.innerHTML = '<i class="fa fa-map-marker-alt"></i> Get Directions';
    directionsLink.title = `Get directions to ${location.locationName || location.name}`;
  } else if (directionsLink) {
    directionsLink.style.display = 'none';
  }

  // Handle "Learn more" link visibility based on link presence
  if (link) {
    if (location.link) {
      link.href = location.link;
      link.style.display = 'inline-block';
      link.innerHTML = '<i class="fa fa-info-circle"></i> Learn more';
      link.title = `Learn more about ${location.locationName || location.name}`;
    } else {
      link.style.display = 'none';
    }
  }

  // Handle image - show image from CSV or fallback to Image-not-found.png
  // Respect the showImages setting
  const showImages = localStorage.getItem('showImages') !== 'false';

  if (image) {
    if (showImages) {
      if (location.image && location.image.trim() !== '') {
        image.src = location.image;
        image.onerror = function () {
          // If image fails to load, show fallback
          this.src = 'images/Image-not-found.png';
        };
        image.style.display = 'block';
      } else {
        // No image in CSV, show fallback image
        image.src = 'images/Image-not-found.png';
        image.style.display = 'block';
      }
    } else {
      // Images disabled in settings
      image.style.display = 'none';
    }
  }

  // Update footer actions with location ID
  if (footerActions) {
    footerActions.setAttribute('data-id', location.id);
    footerActions.style.display = 'flex';

    // Update button counts
    const likeCount = footerActions.querySelector('.footer-like-btn span');
    const dislikeCount = footerActions.querySelector('.footer-dislike-btn span');
    if (likeCount) likeCount.textContent = location.likes || 0;
    if (dislikeCount) dislikeCount.textContent = location.dislikes || 0;

    // Check session storage and disable buttons if already submitted
    const locationId = location.id;
    const footerLikeBtn = footerActions.querySelector('.footer-like-btn');
    const footerDislikeBtn = footerActions.querySelector('.footer-dislike-btn');
    const footerReportBtn = footerActions.querySelector('.footer-report-btn');

    if (sessionStorage.getItem(`${locationId}-like`)) {
      footerLikeBtn.disabled = true;
      footerLikeBtn.style.opacity = '0.5';
    }
    if (sessionStorage.getItem(`${locationId}-dislike`)) {
      footerDislikeBtn.disabled = true;
      footerDislikeBtn.style.opacity = '0.5';
    }
    if (sessionStorage.getItem(`${locationId}-report`)) {
      footerReportBtn.disabled = true;
      footerReportBtn.style.opacity = '0.5';
    }
  }

  // Show the footer when user clicks on it (add 'open' class)
  footer.classList.add('open');

  // Add close button handler
  if (closeBtn) {
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      footer.classList.remove('open');
    };
  }

  // Auto-hide after 10 seconds (only if footer is still open)
  clearTimeout(footerTimeout);
  footerTimeout = setTimeout(() => {
    if (footer.classList.contains('open') && !footer.matches(':hover')) {
      footer.classList.remove('open');
    }
  }, 10000);
}

/**
 * Get category color class
 */
function getCategoryColor(category) {
  const colors = {
    "Fruit": "danger",
    "Vegetable": "success",
    "Flower": "primary",
    "Herb": "info",
    "Mushroom": "warning",
    "Other": "secondary"
  };
  return colors[category] || 'secondary';
}

/**
 * Handle footer action button clicks
 */
function handleFooterActionClick(action, locationId) {
  const key = `${locationId}-${action}`;
  if (sessionStorage.getItem(key)) {
    addStatusMessage(`Already submitted ${action} for this location.`, 'warning');
    return;
  }

  const btn = document.querySelector(`.footer-${action}-btn`);
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  }

  sessionStorage.setItem(key, 'true');
  submitFeedback(locationId, action);
  addStatusMessage(`Submitted ${action} for location ID ${locationId}.`, 'info');
}
function handlePopupOpen(e, location) {
  const container = e.popup.getElement();
  if (!container) return;
  const locationId = location.id;

  const likeBtn = container.querySelector('.like-btn');
  const dislikeBtn = container.querySelector('.dislike-btn');
  const reportBtn = container.querySelector('.report-btn');

  // Check session storage and disable buttons if already submitted
  if (sessionStorage.getItem(`${locationId}-like`)) {
    likeBtn.disabled = true;
    likeBtn.style.opacity = '0.5';
    likeBtn.style.cursor = 'not-allowed';
  }
  if (sessionStorage.getItem(`${locationId}-dislike`)) {
    dislikeBtn.disabled = true;
    dislikeBtn.style.opacity = '0.5';
    dislikeBtn.style.cursor = 'not-allowed';
  }
  if (sessionStorage.getItem(`${locationId}-report`)) {
    reportBtn.disabled = true;
    reportBtn.style.opacity = '0.5';
    reportBtn.style.cursor = 'not-allowed';
  }

  // Remove old listeners to prevent multiple bindings if popup is reopened
  const newLikeBtn = likeBtn.cloneNode(true);
  const newDislikeBtn = dislikeBtn.cloneNode(true);
  const newReportBtn = reportBtn.cloneNode(true);

  // Preserve disabled state when cloning
  if (likeBtn.disabled) {
    newLikeBtn.disabled = true;
    newLikeBtn.style.opacity = '0.5';
    newLikeBtn.style.cursor = 'not-allowed';
  }
  if (dislikeBtn.disabled) {
    newDislikeBtn.disabled = true;
    newDislikeBtn.style.opacity = '0.5';
    newDislikeBtn.style.cursor = 'not-allowed';
  }
  if (reportBtn.disabled) {
    newReportBtn.disabled = true;
    newReportBtn.style.opacity = '0.5';
    newReportBtn.style.cursor = 'not-allowed';
  }

  likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
  dislikeBtn.parentNode.replaceChild(newDislikeBtn, dislikeBtn);
  reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);

  // Add new listeners only if buttons are not disabled
  if (!newLikeBtn.disabled) {
    newLikeBtn.addEventListener('click', () => handleFeedbackClick('like', locationId, container));
  }
  if (!newDislikeBtn.disabled) {
    newDislikeBtn.addEventListener('click', () => handleFeedbackClick('dislike', locationId, container));
  }
  if (!newReportBtn.disabled) {
    newReportBtn.addEventListener('click', () => handleFeedbackClick('report', locationId, container));
  }
}

function handleFeedbackClick(action, id, container) {
  const key = `${id}-${action}`;
  if (sessionStorage.getItem(key)) {
    addStatusMessage(`Already submitted feedback for ${action} on ID ${id}.`, 'warning');
    return; // Prevent multiple submissions
  }

  // Disable button IMMEDIATELY when clicked to prevent double-clicking
  const btn = container.querySelector(`.${action}-btn`);
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5'; // Visual feedback that it's disabled
    btn.style.cursor = 'not-allowed';
  }

  sessionStorage.setItem(key, 'true'); // Mark as submitted in session
  submitFeedback(id, action);
  updateButtonCount(`.${action}-btn`, container);

  addStatusMessage(`Submitted feedback: ${action} for ID ${id}.`, 'info');
}


function submitFeedback(id, action) {

  // Map the action to the correct column name in your spreadsheet
  const actionMapping = {
    'like': 'likes',
    'dislike': 'dislikes',
    'report': 'reports'
  };

  const columnName = actionMapping[action] || action;

  const formURL = fileExec;

  fetch(formURL, {
    method: 'POST',
    mode: 'no-cors', // Important for avoiding CORS errors with Google Scripts
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      id: id,
      action: columnName  // Send the mapped column name instead of the raw action
    })
  })
    .then(() => {
      console.log(`✅ Submission sent for action '${action}' on ID ${id}`);
      // Note: We cannot read the response from the server in 'no-cors' mode,
      // but the data will be sent successfully.
    })
    .catch(err => {
      console.error('❌ Submission error:', err);
      addStatusMessage('❌ Failed to submit feedback.', 'error');
    });
}

function updateButtonCount(buttonSelector, popupEl) {
  const span = popupEl.querySelector(`${buttonSelector} span`);
  if (!span) return;
  span.textContent = (parseInt(span.textContent) || 0) + 1;
}

// --- Utilities ---
function safeGet(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found. Returning a mock object.`);
    return { addEventListener: () => { }, value: '', style: {}, textContent: '', innerHTML: '', add: () => { }, cloneNode: () => ({ addEventListener: () => { } }), parentNode: { replaceChild: () => { } } };
  }
  return element;
}

function addStatusMessage(msg, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${msg}`);
  const statusEl = safeGet('status-message');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.className = `status-message ${type}`; // Apply type class for styling
    clearTimeout(statusEl.timeoutId);
    statusEl.timeoutId = setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status-message';
    }, 5000); // Clear message after 5 seconds
  }
}

function debugLibraries() {
  console.log('=== Library Debug Info ===');
  console.log('Leaflet loaded:', typeof L !== 'undefined');
  console.log('AwesomeMarkers loaded:', typeof L.AwesomeMarkers !== 'undefined');
  console.log('Heat plugin loaded:', typeof L.heatLayer !== 'undefined');
  console.log('Fullscreen plugin loaded:', typeof L.Control.FullScreen !== 'undefined');
  console.log('Data source:', configUseJson ? 'JSON + CSV feedback' : 'CSV only');
  console.log('Zoom threshold for heatmap:', ZOOM_THRESHOLD);
  console.log('=== End Debug Info ===');
}

// Add a simple CSS for the custom marker if useFontAwesome is true
// This would ideally be in your style.css
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
.custom-div-icon {
  background-color: transparent;
  border-radius: 50%;
  text-align: center;
  position: relative;
}
.custom-div-icon .marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  transform: rotate(-45deg);
}
.custom-div-icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

/* Heatmap styles */
.leaflet-heat-layer {
  pointer-events: none;
}

/* Status message styles */
.status-message {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.status-message.warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}
.status-message.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* Footer details styles */
#footer-details {
  visibility: hidden;
  opacity: 0;
}

#footer-details.open {
  visibility: visible;
  opacity: 1;
}

#footer-details.open .footer-overlay {
  display: none !important;
}

#footer-details.open #footer-actions {
  display: flex !important;
}
`;
document.head.appendChild(styleSheet);
