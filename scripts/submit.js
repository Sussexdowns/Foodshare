// Global data
let categoriesData = [];
let locationData = [];
let allItems = [];

// Load categories and items data
async function loadData() {
  try {
    // Load categories and locations in parallel
    const [categoriesResponse, locationsResponse] = await Promise.all([
      fetch(window.BASE_PATH + 'categories.json'),
      fetch(window.BASE_PATH + 'locations.json').catch(() => null)
    ]);

    if (categoriesResponse.ok) {
      categoriesData = await categoriesResponse.json();
      populateCategoryDropdown();
    }

    if (locationsResponse && locationsResponse.ok) {
      locationData = await locationsResponse.json();
    }

    // Load items from items.json for item mapping
    const itemsResponse = await fetch(window.BASE_PATH + 'items.json');
    if (itemsResponse.ok) {
      const itemsJson = await itemsResponse.json();
      allItems = itemsJson;
    }

  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function populateCategoryDropdown() {
  const categorySelect = document.getElementById('category');

  // Clear existing options except first
  while (categorySelect.options.length > 1) {
    categorySelect.remove(1);
  }

  // Add "All" option at the top
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categorySelect.appendChild(allOption);

  if (categoriesData.categories) {
    categoriesData.categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }
}

function populateItemDropdown(categoryId) {
  const itemSelect = document.getElementById('item');

  // Clear existing options
  itemSelect.innerHTML = '<option value="">Select an item...</option>';

  // If no category selected, show message
  if (!categoryId) {
    itemSelect.disabled = true;
    return;
  }

  // Find the selected category
  const selectedCategory = categoriesData.categories?.find(c => c.id === categoryId);

  if (!selectedCategory || !selectedCategory.subcategories) {
    itemSelect.disabled = true;
    return;
  }

  // Create optgroups for each subcategory
  selectedCategory.subcategories.forEach(subcat => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = subcat.name;

    subcat.items.forEach(itemName => {
      // Find item details from allItems
      let itemDetails = null;
      Object.values(allItems).forEach(categoryItems => {
        const found = categoryItems.find(i => i.Name === itemName);
        if (found) itemDetails = found;
      });

      const option = document.createElement('option');
      option.value = itemName.toLowerCase();
      option.textContent = itemName;

      if (itemDetails) {
        option.dataset.link = itemDetails.Link || '';
        option.dataset.image = itemDetails.Image || '';
        option.dataset.desc = itemDetails.Desc || '';
      }

      optgroup.appendChild(option);
    });

    itemSelect.appendChild(optgroup);
  });

  itemSelect.disabled = false;
}

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
}

// --- Dark Mode Toggle ---
// Use base.js functions for dark mode
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
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

// Expose updateDarkModeIcon globally for other scripts to call
window.updateDarkModeIcon = function () {
  if (darkModeToggle) {
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.innerHTML = '☀️';
    } else {
      darkModeToggle.innerHTML = '🌙';
    }
  }
};

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(window.BASE_PATH + 'sw.js').then(function (reg) {
      console.log('ServiceWorker registration successful with scope: ', reg.scope);
    }).catch(function (err) {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Wait a brief moment for base.js to load header/footer, then load data
  setTimeout(function () {
    loadData();
  }, 100);

  const categorySelect = document.getElementById('category');
  const itemSelect = document.getElementById('item');

  categorySelect.addEventListener('change', function () {
    populateItemDropdown(this.value);
  });
});
