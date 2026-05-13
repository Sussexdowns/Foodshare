// Defensive check: initialize BASE_PATH if base.js hasn't run yet
if (typeof window.BASE_PATH === 'undefined') {
  window.BASE_PATH = window.location.pathname.includes('/Foodshare/') ? '/Foodshare/' : '/';
}

// Global data
let allTopics = [];        // All topics from items.json
let categoriesData = [];   // Categories and subcategories from categories.json
let locationData = [];     // Locations from locations.json
let allItems = [];         // Items mapping from items.json
let map;
let markers = [];

// Load categories from JSON
async function loadCategories() {
  try {
    const response = await fetch(window.BASE_PATH + 'categories.json');
    if (response.ok) {
      const data = await response.json();
      categoriesData = data;
      populateCategoryDropdown();
    }
  } catch (error) {
    console.warn('Could not load categories.json:', error);
  }
}

function populateCategoryDropdown() {
  const categoryFilter = document.getElementById('category-filter');
  
  // Clear existing options except "All Categories"
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  if (categoriesData.categories) {
    categoriesData.categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
  }
}

function populateSubcategoryDropdown(categoryId) {
  const subcategoryFilter = document.getElementById('subcategory-filter');
  
  // Clear existing options
  subcategoryFilter.innerHTML = '<option value="all">All Subcategories</option>';
  
  if (!categoryId || categoryId === 'all') {
    subcategoryFilter.disabled = true;
    return;
  }
  
  const category = categoriesData.categories?.find(c => c.id === categoryId);
  if (category && category.subcategories) {
    category.subcategories.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub.id;
      option.textContent = sub.name;
      subcategoryFilter.appendChild(option);
    });
    subcategoryFilter.disabled = false;
  } else {
    subcategoryFilter.disabled = true;
  }
}

async function loadData() {
  try {
    // Load items.json first to get all topics
    const itemsResponse = await fetch(window.BASE_PATH + 'items.json');
    if (!itemsResponse.ok) {
      throw new Error('Failed to load items.json');
    }
    const itemsJson = await itemsResponse.json();
    
    // Store all items mapping
    allItems = itemsJson;
    
    // Flatten items.json and add category info
    allTopics = [];
    for (const category in itemsJson) {
      if (Array.isArray(itemsJson[category])) {
        itemsJson[category].forEach(item => {
          allTopics.push({
            ...item,
            category: category,
            categoryDisplay: category.charAt(0).toUpperCase() + category.slice(1),
            // Map lowercase properties to uppercase for compatibility
            Name: item.name || '',
            Desc: item.desc || '',
            Image: item.image || '',
            Link: item.link || ''
          });
        });
      }
    }
    
    console.log('Loaded ' + allTopics.length + ' topics from items.json');
    
    // Load categories.json
    try {
      const categoriesResponse = await fetch(window.BASE_PATH + 'categories.json');
      if (categoriesResponse.ok) {
        categoriesData = await categoriesResponse.json();
        populateCategoryDropdown();
      }
    } catch (err) {
      console.warn('Could not load categories.json:', err);
    }
    
    // Load locations.json
    try {
      const locationsResponse = await fetch(window.BASE_PATH + 'locations.json');
      if (locationsResponse.ok) {
        locationData = await locationsResponse.json();
        console.log('Loaded ' + locationData.length + ' locations');
      }
    } catch (err) {
      console.warn('Could not load locations.json:', err);
    }
    
    initializePage();
  } catch (error) {
    console.error('Error loading data:', error);
     const grid = document.getElementById('topics-grid');
     if (grid) {
       const errorDiv = document.createElement('div');
       errorDiv.className = 'col-12 text-center';
       const p = document.createElement('p');
       p.className = 'text-danger';
       p.textContent = 'Unable to load topics data: ' + (error.message || 'Unknown error');
       errorDiv.appendChild(p);
       grid.appendChild(errorDiv);
     }
  }
}

function initializePage() {
  initializeMap();
  renderTopics();
  setupFilters();
  setupDarkMode();
}

function initializeMap() {
  map = L.map('map').setView([50.8736, 0.0102], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add markers for topics with locations
  updateMapMarkers();
}

function updateMapMarkers() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  // Add markers for each topic that has a location
  allTopics.forEach(topic => {
    const locations = locationData.filter(loc => 
      loc.name && topic.Name && 
      loc.name.toLowerCase().includes(topic.Name.toLowerCase())
    );
    
    locations.forEach(loc => {
      if (loc.lat && loc.lng) {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: L.AwesomeMarkers.icon({
            icon: 'map-marker-alt',
            markerColor: 'green',
            prefix: 'fa'
          })
        }).addTo(map);
        
        marker.bindPopup(`
          <strong>${topic.Name}</strong><br>
          ${topic.Desc || ''}<br>
          <small>${loc.short_description || ''}</small>
        `);
        
        markers.push(marker);
      }
    });
  });
}

function renderTopics(filteredData = allTopics) {
  const grid = document.getElementById('topics-grid');
  const countEl = document.getElementById('topics-count');
  grid.innerHTML = '';
  
  // Update count
  countEl.textContent = `Showing ${filteredData.length} of ${allTopics.length} topics`;
  
  // Create a map of topic names to their locations
  const topicLocations = new Map();
  locationData.forEach(loc => {
    const key = loc.name ? loc.name.toLowerCase() : '';
    if (!topicLocations.has(key)) {
      topicLocations.set(key, []);
    }
    topicLocations.get(key).push(loc);
  });
  
   filteredData.forEach(topic => {
     const locations = topicLocations.get(topic.Name ? topic.Name.toLowerCase() : '') || [];
     const hasLocation = locations.length > 0;

     const col = document.createElement('div');
     col.className = 'col-md-4 col-lg-3';

     // Use image from items.json or fallback
     const imageUrl = topic.Image || 'https://placehold.co/300x200/1b5e20/e8f5e9?text=' + encodeURIComponent(topic.Name || 'Topic');

     // Build topic card using DOM methods to prevent XSS
     const card = document.createElement('div');
     card.className = `topic-card ${hasLocation ? 'has-location' : 'no-location'}`;
     card.dataset.name = (topic.Name || '').toLowerCase();
     card.dataset.category = (topic.category || '').toLowerCase();
     card.dataset.hasLocation = hasLocation;

     // Image
     const img = document.createElement('img');
     img.src = imageUrl;
     img.alt = topic.Name || 'Topic';
     img.className = 'topic-img';
     img.onerror = function() {
       this.src = `https://placehold.co/300x200/1b5e20/e8f5e9?text=${encodeURIComponent(topic.Name || 'Topic')}`;
     };
     
     // Topic body
     const body = document.createElement('div');
     body.className = 'topic-body';

     const title = document.createElement('h4');
     title.className = 'topic-title';
     title.textContent = topic.Name || 'Unknown';

     const desc = document.createElement('p');
     desc.className = 'topic-desc';
     desc.textContent = topic.Desc || 'No description available.';

     const meta = document.createElement('div');
     meta.className = 'topic-meta';
     meta.innerHTML = `<i class="fas fa-folder"></i> ${SecurityUtils.escapeHtml(topic.categoryDisplay || 'General')}`;

     const badge = document.createElement('span');
     badge.className = `status-badge ${hasLocation ? 'available' : 'coming-soon'}`;
     badge.innerHTML = `<i class="fas fa-${hasLocation ? 'check' : 'clock'}"></i> ${hasLocation ? 'Available' : 'Coming Soon'}`;

     body.appendChild(title);
     body.appendChild(desc);
     body.appendChild(meta);
     body.appendChild(badge);

     if (hasLocation) {
       const locInfo = document.createElement('div');
       locInfo.className = 'location-info';
       locInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${locations.length} location${locations.length > 1 ? 's' : ''} on map`;
       body.appendChild(locInfo);
     }

     card.appendChild(img);
     card.appendChild(body);
     col.appendChild(card);

     // Add click handler for topics with locations
     if (hasLocation) {
       card.addEventListener('click', () => {
         const firstLoc = locations[0];
         if (firstLoc.lat && firstLoc.lng) {
           map.setView([firstLoc.lat, firstLoc.lng], 16);
           map.scrollIntoView({ behavior: 'smooth' });
         }
       });
     }

     grid.appendChild(col);
   });
}

function setupFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const subcategoryFilter = document.getElementById('subcategory-filter');
  const searchInput = document.getElementById('search-input');
  
  // Category change handler - updates subcategories
  categoryFilter.addEventListener('change', function() {
    populateSubcategoryDropdown(this.value);
    filterTopics();
  });
  
  // Subcategory change handler
  subcategoryFilter.addEventListener('change', filterTopics);
  
  // Search filter handler
  searchInput.addEventListener('input', filterTopics);
  
  function filterTopics() {
    const category = categoryFilter.value;
    const subcategory = subcategoryFilter.value;
    const search = searchInput.value.toLowerCase();
    
    const filtered = allTopics.filter(topic => {
      const matchesCategory = category === 'all' || (topic.category || '') === category;
      const matchesSubcategory = subcategory === 'all' || true; // TODO: Add subcategory matching
      const matchesSearch = (topic.Name || '').toLowerCase().includes(search) || 
                           (topic.Desc || '').toLowerCase().includes(search);
      
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
    
    renderTopics(filtered);
  }
}

function setupDarkMode() {
  // Use base.js functions for dark mode
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
    body.classList.add('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '☀️';
    }
  }
  
  // Listen for dark mode changes from other scripts (e.g., base.js)
  const darkModeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && darkModeToggle) {
        if (body.classList.contains('dark-mode')) {
          darkModeToggle.innerHTML = '☀️';
        } else {
          darkModeToggle.innerHTML = '🌙';
        }
      }
    });
  });
  
  if (body) {
    darkModeObserver.observe(body, { attributes: true });
  }
  
  // Expose updateDarkModeIcon globally
  window.updateDarkModeIcon = function() {
    if (darkModeToggle) {
      if (body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '☀️';
      } else {
        darkModeToggle.innerHTML = '🌙';
      }
    }
  };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Wait a brief moment for base.js to load header/footer, then load data
  setTimeout(function() {
    loadData();
  }, 100);
  
  // Setup category dropdown listener
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      populateSubcategoryDropdown(this.value);
    });
  }
});
