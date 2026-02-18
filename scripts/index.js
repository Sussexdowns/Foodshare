// Global data
let categoriesData = [];
let locationData = [];
let allItems = [];

// Load categories and items data
async function loadData() {
  try {
    // Load categories and locations in parallel
    const [categoriesResponse, locationsResponse] = await Promise.all([
      fetch('categories.json'),
      fetch('locations.json').catch(() => null)
    ]);
    
    if (categoriesResponse.ok) {
      categoriesData = await categoriesResponse.json();
    }
    
    if (locationsResponse && locationsResponse.ok) {
      locationData = await locationsResponse.json();
    }
    
    // Load items from items.json for item mapping
    const itemsResponse = await fetch('items.json');
    if (itemsResponse.ok) {
      const itemsJson = await itemsResponse.json();
      allItems = itemsJson;
    }
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  
  const categorySelect = document.getElementById('category');
  const itemSelect = document.getElementById('item');
  
  // Both dropdowns are simple native selects - no Select2 needed
  if (categorySelect) {
    // Category change listener - populate items and filter
    categorySelect.addEventListener('change', function() {
      if (typeof populateItemsForCategory === 'function') {
        populateItemsForCategory(this.value);
      }
      if (typeof filterLocations === 'function') {
        filterLocations();
      }
    });
  }
  
  if (itemSelect) {
    itemSelect.addEventListener('change', function() {
      if (typeof filterLocations === 'function') {
        filterLocations();
      }
    });
  }
});

// Month picker functionality
const monthPickerInput = document.getElementById('month-picker-input');
const monthPickerDropdown = document.getElementById('month-picker-dropdown');
const selectedMonthsDisplay = document.getElementById('selected-months-display');
const monthCheckboxes = document.querySelectorAll('.month-checkbox');
let selectedMonths = [];

// Toggle dropdown
monthPickerInput.addEventListener('click', () => {
  monthPickerDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!monthPickerInput.contains(e.target) && !monthPickerDropdown.contains(e.target)) {
    monthPickerDropdown.classList.remove('show');
  }
});

// Handle month selection
monthCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    updateSelectedMonths();
  });
});

function updateSelectedMonths() {
  selectedMonths = Array.from(monthCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  if (selectedMonths.length === 0) {
    monthPickerInput.placeholder = 'Select months...';
    selectedMonthsDisplay.textContent = '';
  } else if (selectedMonths.length <= 3) {
    monthPickerInput.value = selectedMonths.join(', ');
    selectedMonthsDisplay.textContent = selectedMonths.join(', ');
  } else {
    monthPickerInput.value = `${selectedMonths.length} months selected`;
    selectedMonthsDisplay.textContent = `${selectedMonths.length} months selected`;
  }
  
  // Trigger filter update - call the global function from app.js
  if (typeof window.updateMonthFilter === 'function') {
    window.updateMonthFilter(selectedMonths);
  }
}

// Footer close button - footer is loaded asynchronously, so check if elements exist
const footer = safeGet('footer-details');
const closefooter = safeGet('footer-close');

if (closefooter && footer) {
  closefooter.addEventListener('click', function() {
    footer.classList.remove('visible');
  });
}

// --- Dark Mode ---
// Dark mode is handled by base.js which waits for footer to load
// The footer is loaded asynchronously, so dark mode toggle is attached there

// --- Settings Modal ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const cancelSettingsBtn = document.getElementById('cancelSettings');
const useJsonAsSourceCheckbox = document.getElementById('useJsonAsSource');
const sheetURLInput = document.getElementById('sheetURL');

// Load saved settings - read from localStorage directly
const modalUseJson = localStorage.getItem('useJsonAsSource');
const modalSheetURL = localStorage.getItem('sheetURL');

if (modalUseJson === 'true' && useJsonAsSourceCheckbox) {
  useJsonAsSourceCheckbox.checked = true;
}
if (modalSheetURL && sheetURLInput) {
  sheetURLInput.value = modalSheetURL;
}

// Open settings modal
if (settingsBtn && settingsModal) {
  settingsBtn.addEventListener('click', function() {
    settingsModal.classList.remove('hidden');
    settingsModal.style.display = 'flex';
  });
}

// Close settings modal
if (closeSettingsBtn && settingsModal) {
  closeSettingsBtn.addEventListener('click', function() {
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
  });
}

if (cancelSettingsBtn && settingsModal) {
  cancelSettingsBtn.addEventListener('click', function() {
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
  });
}

// Close modal when clicking outside
if (settingsModal) {
  settingsModal.addEventListener('click', function(e) {
    if (e.target === settingsModal) {
      settingsModal.classList.add('hidden');
      settingsModal.style.display = 'none';
    }
  });
}

// Save settings
if (saveSettingsBtn && useJsonAsSourceCheckbox && sheetURLInput) {
  saveSettingsBtn.addEventListener('click', function() {
    localStorage.setItem('useJsonAsSource', useJsonAsSourceCheckbox.checked);
    localStorage.setItem('sheetURL', sheetURLInput.value);
    
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
    
    // Reload page to apply new settings
    addStatusMessage('Settings saved. Reloading to apply changes...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
      console.log('ServiceWorker registration successful with scope: ', reg.scope);
    }).catch(function(err) {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}
