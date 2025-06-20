// --- app.js ---
var fileCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_-5xXDk3-S1VfgYvEABOXgGD0zC1WbaGs2PZIQ5Cph3ndo0FNq5KpDRcr0PwUxfLsdwpwf_JeFzrn/pub?output=csv';
var fileExec = 'https://script.google.com/macros/s/AKfycbx4NCdQmCLWdTPgLQuHyUmxg6ajNPbh9jV5BQKvRT50iP9u53TOvyilTb-V7KiDswjl/exec';




document.addEventListener('DOMContentLoaded', initApp);

// --- Global Variables ---
let map;
let allLocations = [];
let markers = [];
let footerTimeout;
let useFontAwesome = true;

// --- Configuration ---
// Set to true to use JSON file, false to use CSV as primary data source
const useJsonAsSource = false; // 👈 Change this to toggle between JSON and CSV

// --- IMPORTANT: Paste your published Google Sheet CSV URL here ---
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_-5xXDk3-S1VfgYvEABOXgGD0zC1WbaGs2PZIQ5Cph3ndo0FNq5KpDRcr0PwUxfLsdwpwf_JeFzrn/pub?output=csv'; // 👈 PASTE YOUR URL HERE
const jsonfile = 'locations.json'; // Assume this JSON file exists with base location data

// --- Initialization ---
function initApp() {
  addStatusMessage('🚀 Initializing application...', 'success');
  debugLibraries();
  initMap();
  fetchData();
}

function initMap() {
  const lewes = [50.873, 0.009];
  map = L.map('map').setView(lewes, 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

// --- Data Fetching and Processing ---

/**
 * Fetches location data based on the useJsonAsSource configuration.
 * If useJsonAsSource is true, loads from JSON and merges feedback from CSV.
 * If useJsonAsSource is false, loads all data from CSV.
 */
function fetchData() {
  if (!sheetURL || sheetURL === 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL') {
    console.error('Error: Google Sheet URL is not set. Please update the `sheetURL` variable in app.js.');
    alert('Application is not configured correctly. The Google Sheet URL is missing.');

    // Fallback to JSON if available (but now with feedback from the sheet if possible)
    if (useJsonAsSource) {
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

  if (useJsonAsSource) {
    // Behavior: JSON as primary source, CSV for feedback
    addStatusMessage('📊 Loading data from JSON with CSV feedback...', 'info');
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
    addStatusMessage('📊 Loading all data from CSV...', 'info');
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

      location = {
        id: parseInt(id), // Store ID as integer in the object
        name: row.name ? row.name.trim() : `Location ${id}`,
        lat: lat,
        lng: lng,
        category: row.category ? row.category.trim() : 'Other',
        description: row.description ? row.description.trim() : '',
        short_description: row.short_description ? row.short_description.trim() : '',
        season: row.season ? parseSeasonData(row.season) : [],
        link: row.link ? row.link.trim() : '',
        image: row.image ? row.image.trim() : '',
        likes: row.likes,    // Initialize likes for new location
        dislikes: row.dislikes  // Initialize dislikes for new location
      };
      locationMap.set(id, location);
      // console.log(`Added new location to map: ${id}`, location);
    }

    // Now, process feedback for this row and add to the *existing* or *newly created* location object
    // This logic allows for feedback to be aggregated even if location details are defined in a different row
    if (row.Approved && row.Approved.trim().toUpperCase() === 'TRUE') {
      const likesToAdd = parseInt(row.likes, 10) || 0;
      const dislikesToAdd = parseInt(row.dislikes, 10) || 0;

      location.likes += likesToAdd;
      location.dislikes += dislikesToAdd;

      // console.log(`Updated location ${id}: likes=${location.likes}, dislikes=${location.dislikes}`);
    } // else if (row.Approved) {
      // console.log(`Feedback for ID ${id} not approved: Approved=${row.Approved}`);
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
 * Parses season data from CSV format (e.g., "1,2,3" or "January,February,March")
 * @param {string} seasonStr - The season string from CSV
 * @returns {Array<number>} Array of month numbers (1-12)
 */
function parseSeasonData(seasonStr) {
  if (!seasonStr) return [];

  const months = ["january", "february", "march", "april", "may", "june",
                 "july", "august", "september", "october", "november", "december"];

  return seasonStr.split(',')
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
 */
function initializeAppData(data) {
  allLocations = data; // Ensure global variable is set
  populateFilters();
  addEventListeners();
  displayAllLocations();

  const dataSource = useJsonAsSource ? 'JSON + CSV feedback' : 'CSV only';
  addStatusMessage(`✅ App ready. Displaying ${allLocations.length} locations from ${dataSource}.`, 'success');
}

/**
 * Handles errors during the fetch process.
 * @param {Error} error - The error object.
 */
function handleFetchError(error) {
  console.error('Error loading data:', error);
  alert('Could not load location data. Please check the console for more details.');
  addStatusMessage('❌ Failed to load data. Check console.', 'error');
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

// --- UI and Map Functions (Mostly Unchanged) ---

function populateFilters() {
  const categorySelect = safeGet('category');
  const itemSelect = safeGet('item');
  const monthSelect = safeGet('month');

  // Clear existing options before populating
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  itemSelect.innerHTML = '<option value="all">All Items</option>';
  monthSelect.innerHTML = '<option value="all">All Months</option>';


  const categories = [...new Set(allLocations.map(loc => loc.category))].sort();
  const items = [...new Set(allLocations.map(loc => loc.name))].sort();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  categories.forEach(category => {
    if (category && category !== 'Other') categorySelect.add(new Option(category, category));
  });
  // Add 'Other' last if it exists
  if (categories.includes('Other')) {
    categorySelect.add(new Option('Other', 'Other'));
  }


  items.forEach(item => {
    if (item) itemSelect.add(new Option(item, item));
  });
  months.forEach((month, index) => monthSelect.add(new Option(month, index + 1)));
}

function addEventListeners() {
  safeGet('category').addEventListener('change', filterLocations);
  safeGet('item').addEventListener('change', filterLocations);
  safeGet('month').addEventListener('change', filterLocations);
  safeGet('toggle-icon-style').addEventListener('change', (e) => {
    useFontAwesome = e.target.checked;
    // Re-render markers to apply new icon style
    filterLocations(); // This will trigger marker recreation
  });
}

function filterLocations() {
  const category = safeGet('category').value;
  const item = safeGet('item').value;
  const month = parseInt(safeGet('month').value, 10);

  let filtered = allLocations;

  if (category !== 'all') filtered = filtered.filter(loc => loc.category === category);
  if (item !== 'all') filtered = filtered.filter(loc => loc.name === item);
  // Ensure season data is an array before checking includes
  if (!isNaN(month)) filtered = filtered.filter(loc => loc.season && Array.isArray(loc.season) && loc.season.includes(month));

  displayFilteredLocations(filtered);
  addStatusMessage(`🔍 Filtered to ${filtered.length} locations`, 'success');
}

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

function addMarker(location) {
  const categoryColors = { "Fruit": "red", "Vegetable": "green", "Flower": "purple", "Herb": "blue", "Other": "gray" }; // Added 'Other'
  const categoryIcons = { "Fruit": "apple-whole", "Vegetable": "carrot", "Flower": "seedling", "Herb": "leaf", "Other": "map-marker-alt" }; // Added 'Other'

  const color = categoryColors[location.category] || "purple";
  const iconName = categoryIcons[location.category] || "location-dot";

  // Use L.divIcon for Font Awesome control if needed, otherwise L.AwesomeMarkers.icon
  let markerIcon;
  if (useFontAwesome) {
    markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color};" class="marker-pin"></div><i class="fa fa-${iconName} fa-lg" style="color:white;text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"></i>`,
      iconSize: [30, 42], // size of the icon
      iconAnchor: [15, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -35] // point from which the popup should open relative to the iconAnchor
    });
  } else {
    // Fallback to L.AwesomeMarkers.icon if not using custom div icons
    markerIcon = L.AwesomeMarkers.icon({ icon: iconName, prefix: 'fa', markerColor: color });
  }

  const marker = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(map);

  // Initialize likes/dislikes to 0 if they don't exist (though processed data should have them)


  
  location.likes = location.likes || 0;
  location.dislikes = location.dislikes || 0;

  

  console.log(`Creating marker for ${location.name} (ID: ${location.id}) with ${location.likes} likes, ${location.dislikes} dislikes`);

  marker.bindPopup(`
    <div class="popup-content">
      <h3>${location.name}</h3>
      <p>${location.short_description || "No description."}</p>
      <div class="popup-actions" data-id="${location.id}">
        <button class="like-btn" title="Like"><i class="fa fa-thumbs-up"></i> <span>${location.likes}</span></button>
        <button class="dislike-btn" title="Dislike"><i class="fa fa-thumbs-down"></i> <span>${location.dislikes}</span></button>
        <button class="flag-btn" title="Report"><i class="fa fa-flag"></i></button>
      </div>
    </div>`);

  marker.on('popupopen', (e) => handlePopupOpen(e, location));
  marker.on('click', () => showFooterDetails(location));
  marker.on('mouseover', () => showFooterDetails(location));
  markers.push(marker);
}

function displayAllLocations() {
  clearMarkers();
  allLocations.forEach(addMarker);
  // Reset filters to "all" when displaying all locations
  safeGet('category').value = 'all';
  safeGet('item').value = 'all';
  safeGet('month').value = 'all';
  if (allLocations.length > 0) {
    map.fitBounds(L.latLngBounds(allLocations.map(loc => [loc.lat, loc.lng])), { padding: [50, 50] });
  } else {
    // If no locations, center on default view
    map.setView([50.873, 0.009], 14);
  }
}

function displayFilteredLocations(locations) {
  clearMarkers();
  locations.forEach(addMarker);
  if (locations.length > 0) {
    map.fitBounds(L.latLngBounds(locations.map(loc => [loc.lat, loc.lng])), { padding: [50, 50] });
  } else {
    // If no filtered locations, center on default view or show a message
    map.setView([50.873, 0.009], 14);
    addStatusMessage('😔 No locations match your filters.', 'warning');
  }
}

function showFooterDetails(location) {
  const footer = safeGet('footer-details');
  safeGet('footer-title').textContent = location.name;
  safeGet('footer-description').textContent = location.description || "No additional info.";
  const link = safeGet('footer-link');
  if (location.link) {
    link.href = location.link;
    link.style.display = 'inline';
    link.textContent = 'Learn more about ' + location.name;
  } else {
    link.style.display = 'none';
  }
  /*
  if (location.likes != '' && location.dislikes != '') {
      safeGet('footer-likes').innerHTML = `<i class="fa fa-thumbs-up"></i> <span>${location.likes}</span>`;
      safeGet('footer-dislikes').innerHTML = `<i class="fa fa-thumbs-down"></i> <span>${location.dislikes}</span>`;
      safeGet('footer-likes').style.display = 'inline';
      safeGet('footer-dislikes').style.display = 'inline';
      safeGet('footer-ratings').style.display = 'inline';
    } else {
      safeGet('footer-likes').style.display = 'none';
      safeGet('footer-dislikes').style.display = 'none';
      safeGet('footer-ratings').style.display = 'none';
    }
*/

  const image = safeGet('footer-image');
  if (location.image) {
    image.src = location.image;
    image.style.display = 'block';
  } else {
    image.style.display = 'none';
  }
  footer.classList.add('visible');
  clearTimeout(footerTimeout);
  footerTimeout = setTimeout(() => {
    if (!footer.matches(':hover')) footer.classList.remove('visible');
  }, 5000);
}

function handlePopupOpen(e, location) {
    const container = e.popup.getElement();
    if (!container) return;
    const locationId = location.id;

    const likeBtn = container.querySelector('.like-btn');
    const dislikeBtn = container.querySelector('.dislike-btn');
    const flagBtn = container.querySelector('.flag-btn');

    // Disable buttons if already submitted in session
    if (sessionStorage.getItem(`${locationId}-like`)) likeBtn.disabled = true;
    if (sessionStorage.getItem(`${locationId}-dislike`)) dislikeBtn.disabled = true;
    if (sessionStorage.getItem(`${locationId}-report`)) flagBtn.disabled = true;

    // Remove old listeners to prevent multiple bindings if popup is reopened
    const newLikeBtn = likeBtn.cloneNode(true);
    const newDislikeBtn = dislikeBtn.cloneNode(true);
    const newFlagBtn = flagBtn.cloneNode(true);

    likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
    dislikeBtn.parentNode.replaceChild(newDislikeBtn, dislikeBtn);
    flagBtn.parentNode.replaceChild(newFlagBtn, flagBtn);
    
    // Add new listeners
    newLikeBtn.addEventListener('click', () => handleFeedbackClick('like', locationId, container));
    newDislikeBtn.addEventListener('click', () => handleFeedbackClick('dislike', locationId, container));
    newFlagBtn.addEventListener('click', () => handleFeedbackClick('report', locationId, container));
}

function handleFeedbackClick(action, id, container) {
    const key = `${id}-${action}`;
    if (sessionStorage.getItem(key)) {
        addStatusMessage(`Already submitted feedback for ${action} on ID ${id}.`, 'warning');
        return; // Prevent multiple submissions
    }

    sessionStorage.setItem(key, 'true'); // Mark as submitted in session
    submitFeedback(id, action);
    updateButtonCount(`.${action}-btn`, container);

    const btn = container.querySelector(`.${action}-btn`);
    if (btn) btn.disabled = true; // Disable button immediately after click
    addStatusMessage(`Submitted feedback: ${action} for ID ${id}.`, 'info');
}

function submitFeedback(id, action) {
  // 🔽 REPLACE THIS URL with the one you copied from your script deployment.
  const formURL = fileExec;

  fetch(formURL, {
    method: 'POST',
    mode: 'no-cors', // Important for avoiding CORS errors with Google Scripts
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ id, action })
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
    return { addEventListener: () => {}, value: '', style: {}, textContent: '', innerHTML: '', add: () => {}, cloneNode: () => ({ addEventListener: () => {} }), parentNode: { replaceChild: () => {} } };
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
  console.log('Data source:', useJsonAsSource ? 'JSON + CSV feedback' : 'CSV only');
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
`;
document.head.appendChild(styleSheet);