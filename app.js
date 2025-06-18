let map;
let allLocations = [];
let markers = [];
let footerTimeout;
let useFontAwesome = true; // Toggle this to switch marker style


// Utility: Safely get DOM elements
function safeGet(id) {
  return document.getElementById(id) || { addEventListener: () => {}, value: '', style: {}, textContent: '' };
}

// Main initializer
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  addStatusMessage('🚀 Initializing application...', 'success');
  debugLibraries();
  initMap();
  fetchData();
}

// Initialize Leaflet map
function initMap() {
  const lewes = [50.873, 0.009];
  map = L.map('map').setView(lewes, 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

// Load JSON data
function fetchData() {
  fetch('locations.json')
    .then(response => response.json())
    .then(data => {
      allLocations = data;
      populateFilters();
      addEventListeners();
      displayAllLocations();
    })
    .catch(error => {
      console.error('Error loading location data:', error);
      alert('Could not load location data. Make sure locations.json is in the correct folder and served via a web server!');
    });
}

function populateFilters() {
  const categorySelect = safeGet('category');
  const itemSelect = safeGet('item');
  const monthSelect = safeGet('month');

  //categorySelect.add(new Option("All Categories", "all"));
  //itemSelect.add(new Option("All Items", "all"));
  //monthSelect.add(new Option("All Months", "all"));

  const categories = [...new Set(allLocations.map(loc => loc.category))];
  const items = [...new Set(allLocations.map(loc => loc.name))];
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

  categories.forEach(category => categorySelect.add(new Option(category, category)));
  items.forEach(item => itemSelect.add(new Option(item, item)));
  months.forEach((month, index) => monthSelect.add(new Option(month, index + 1)));

  addStatusMessage(`📊 Loaded ${categories.length} categories and ${items.length} items`, 'success');
}

function addEventListeners() {
  safeGet('category').addEventListener('change', filterLocations);
  safeGet('item').addEventListener('change', filterLocations);
  safeGet('month').addEventListener('change', filterLocations);

  safeGet('toggle-icon-style').addEventListener('change', (e) => {
  useFontAwesome = e.target.checked;
  filterLocations(); // Refresh display with new icons
});
}

function filterLocations() {
  const category = safeGet('category').value;
  const item = safeGet('item').value;
  const month = parseInt(safeGet('month').value, 10);

  let filtered = allLocations;

  if (category !== 'all') filtered = filtered.filter(loc => loc.category === category);
  if (item !== 'all') filtered = filtered.filter(loc => loc.name === item);
  if (!isNaN(month)) filtered = filtered.filter(loc => loc.season.includes(month));

  displayFilteredLocations(filtered);
  addStatusMessage(`🔍 Filtered to ${filtered.length} locations`, 'success');
}

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

function addMarker(location) {
  const categoryColors = {
    "Fruit": "red",
    "Vegetable": "green",
    "Flower": "purple",
    "Herb": "blue"
  };

  const categoryIcons = {
    "Fruit": "apple-whole",
    "Vegetable": "carrot",
    "Flower": "seedling",
    "Herb": "leaf"
  };

  const color = categoryColors[location.category] || "purple";
  const iconName = categoryIcons[location.category] || "location-dot";

  if (!useFontAwesome || typeof L.AwesomeMarkers === 'undefined') {
    console.warn('Using default colored markers.');
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(`<h3>${location.name}</h3><p>${location.short_description || location.description || "No description available."}</p>`);
    marker.on('click', () => showFooterDetails(location));
    marker.on('mouseover', () => showFooterDetails(location));
    markers.push(marker);
    return;
  }

  // Use Font Awesome marker
  try {
    const icon = L.AwesomeMarkers.icon({
      icon: iconName,
      prefix: 'fa',
      markerColor: color
    });

    const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
    marker.bindPopup(`<h3>${location.name}</h3><p>${location.short_description || location.description || "No description available."}</p>`);
    marker.on('click', () => showFooterDetails(location));
    marker.on('mouseover', () => showFooterDetails(location));
    markers.push(marker);
  } catch (err) {
    console.error("Error creating marker:", err);
  }
}


function displayAllLocations() {
  clearMarkers();
  allLocations.forEach(addMarker);

  safeGet('category').value = 'all';
  safeGet('item').value = 'all';
  safeGet('month').value = 'all';

  addStatusMessage(`📍 Displaying all ${allLocations.length} locations`, 'success');
}

function displayFilteredLocations(locations) {
  clearMarkers();
  locations.forEach(addMarker);
}

function showFooterDetails(location) {
  const footer = safeGet('footer-details');
  safeGet('footer-title').textContent = location.name;
  safeGet('footer-description').textContent = location.description || location.short_description || "No additional info available.";

  const link = safeGet('footer-link');
  if (location.link) {
    link.href = location.link;
    link.style.display = 'inline';
    link.textContent = 'Learn more about ' + location.name;
  } else {
    link.style.display = 'none';
  }

  const image = safeGet('footer-image');
  if (location.image) {
    image.src = location.image;
    image.alt = location.name;
    image.style.display = 'block';
  } else {
    image.style.display = 'none';
  }

  footer.classList.add('visible');

  clearTimeout(footerTimeout);
  footerTimeout = setTimeout(() => {
    if (!footer.matches(':hover')) {
      footer.classList.remove('visible');
    }
  }, 5000);
}

// Debug helper
function debugLibraries() {
  console.log('=== Library Debug Info ===');
  console.log('Leaflet loaded:', typeof L !== 'undefined');
  console.log('AwesomeMarkers loaded:', typeof L.AwesomeMarkers !== 'undefined');
  console.log('Font Awesome CSS loaded:', document.querySelector('link[href*="font-awesome"]') !== null);

  if (typeof L.AwesomeMarkers !== 'undefined') {
    try {
      const testIcon = L.AwesomeMarkers.icon({
        icon: 'leaf',
        prefix: 'fa',
        markerColor: 'green'
      });
      console.log('Test icon created:', testIcon);
    } catch (e) {
      console.error('Error creating test icon:', e);
    }
  }
  console.log('=== End Debug Info ===');
}

// Stub: You can customize this to show messages on screen
function addStatusMessage(msg, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${msg}`);
}
