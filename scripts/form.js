// form.js

// itemsData is stored on window for cross-script access

// Check if JSON source is enabled (when disabled, use Firebase)
const formUseJsonAsSource = localStorage.getItem('useJsonAsSource') !== 'false';

// Load items data from appropriate source
async function loadItemsData() {
  if (formUseJsonAsSource) {
    // Load from local items.json
    try {
      const response = await fetch(window.BASE_PATH + 'items.json');
      if (!response.ok) throw new Error('Failed to load items.json');
      window.itemsData = await response.json();
    } catch (err) {
      console.error('Error loading items.json:', err);
      // Fallback to Firebase if local JSON fails
      loadItemsFromFirebase();
      return;
    }
  } else {
    // Load from Firebase when JSON source is disabled
    loadItemsFromFirebase();
    return;
  }

  // Sort each category's items alphabetically by name
  processAndSortItemsData();
  populateItemsDropdown(document.getElementById('category').value);
}

// Process and sort items data (normalizes field names and sorts)
function processAndSortItemsData() {
  for (const category in window.itemsData) {
    if (window.itemsData[category] && Array.isArray(window.itemsData[category])) {
      window.itemsData[category].forEach(item => {
        // Normalize field names - ensure both Name and name are set
        if (item.name && !item.Name) item.Name = item.name;
        if (item.icon && !item.Icon) item.Icon = item.icon;
        if (item.link && !item.Link) item.Link = item.link;
        if (item.image && !item.Image) item.Image = item.image;
        if (item.desc && !item.Desc) item.Desc = item.desc;
      });
      window.itemsData[category].sort((a, b) => {
        const nameA = a && (a.Name || a.name) ? (a.Name || a.name) : '';
        const nameB = b && (b.Name || b.name) ? (b.Name || b.name) : '';
        return nameA.localeCompare(nameB);
      });
    }
  }
}

// Load items from Firebase Firestore
function loadItemsFromFirebase() {
  if (typeof firebase === 'undefined' || !firebase.firestore) {
    console.error('Firebase not available. Cannot load items.');
    return;
  }

  const db = firebase.firestore();
  db.collection('items').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const item = doc.data();
        const category = item.category || 'other';
        if (!window.itemsData[category]) {
          window.itemsData[category] = [];
        }
        // Normalize Firebase field names to match items.json format
        window.itemsData[category].push({
          Name: item.name || item.Name,
          Link: item.link || item.Link,
          Image: item.image || item.Image,
          Desc: item.desc || item.Desc
        });
      });

      processAndSortItemsData();
      populateItemsDropdown(document.getElementById('category').value);
    })
    .catch(err => {
      console.error('Error loading items from Firebase:', err);
    });
}

// Initialize items loading
loadItemsData();

const categorySelect = document.getElementById('category');
const itemSelect = document.getElementById('item');
const newItemInput = document.getElementById('new-item');
const itemDetailsContainer = document.getElementById('item-details');

// Populate items dropdown based on selected category
function populateItemsDropdown(categoryKey) {
  if (!itemSelect) return;
  itemSelect.innerHTML = ''; // Clear current items

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select an item --';
  defaultOption.setAttribute('data-link', '');
  defaultOption.setAttribute('data-image', '');
  defaultOption.setAttribute('data-desc', '');
  itemSelect.appendChild(defaultOption);

  const items = window.itemsData[categoryKey];
  if (!items || !Array.isArray(items)) return;

  items.forEach(item => {
    if (!item) return;
    const itemName = item.Name || item.name;
    if (!itemName) return;
    const option = document.createElement('option');
    option.value = itemName.toLowerCase().replace(/\s+/g, '-');
    option.textContent = itemName;
    option.setAttribute('data-link', (item.Link || item.link) || '');
    option.setAttribute('data-image', (item.Image || item.image) || '');
    option.setAttribute('data-desc', (item.Desc || item.desc) || '');
    option.setAttribute('data-name', itemName);
    itemSelect.appendChild(option);
  });

  // Hide new item input on normal category selection
  if (newItemInput) {
    newItemInput.classList.add('d-none');
    newItemInput.value = '';
  }

  // Hide item details
  if (itemDetailsContainer) {
    itemDetailsContainer.style.display = 'none';
  }
}

// Show item details when an item is selected
function showItemDetails(itemData) {
  if (!itemDetailsContainer) return;

  const imageEl = document.getElementById('item-image');
  const nameEl = document.getElementById('item-name');
  const descEl = document.getElementById('item-desc');
  const linkEl = document.getElementById('item-link');

  if (itemData && itemData.name) {
    // Show item details container
    itemDetailsContainer.style.display = 'block';

    // Update image
    if (imageEl && itemData.image) {
      imageEl.src = itemData.image;
      imageEl.alt = itemData.name;
      imageEl.style.display = 'block';
    } else if (imageEl) {
      imageEl.style.display = 'none';
    }

    // Update name
    if (nameEl) {
      nameEl.textContent = itemData.name || '';
    }

    // Update description
    if (descEl) {
      descEl.textContent = itemData.desc || '';
    }

    // Update link
    if (linkEl && itemData.link) {
      linkEl.href = itemData.link;
      linkEl.style.display = 'inline-block';
    } else if (linkEl) {
      linkEl.style.display = 'none';
    }
  } else {
    // Hide item details if no item selected
    itemDetailsContainer.style.display = 'none';
  }
}

// Listen for category change
if (categorySelect) {
  categorySelect.addEventListener('change', () => {
    const selected = categorySelect.value;

    if (window.itemsData[selected]) {
      populateItemsDropdown(selected);
    } else {
      if (itemSelect) itemSelect.innerHTML = '';
      if (newItemInput) newItemInput.classList.remove('d-none'); // Show new item input if needed
      if (itemDetailsContainer) {
        itemDetailsContainer.style.display = 'none';
      }
    }
  });
}

// Listen for item change
if (itemSelect) {
  itemSelect.addEventListener('change', () => {
    const selectedOption = itemSelect.options[itemSelect.selectedIndex];

    if (selectedOption && selectedOption.value) {
      const itemData = {
        name: selectedOption.getAttribute('data-name') || '',
        link: selectedOption.getAttribute('data-link') || '',
        image: selectedOption.getAttribute('data-image') || '',
        desc: selectedOption.getAttribute('data-desc') || ''
      };
      showItemDetails(itemData);

      // Auto-fill the location name if it's empty
      const nameInput = document.getElementById('name');
      if (nameInput && !nameInput.value) {
        nameInput.value = itemData.name;
      }

      // Auto-fill short description if it's empty
      const shortDescInput = document.getElementById('shortDesc');
      if (shortDescInput && !shortDescInput.value && itemData.desc) {
        // Truncate description for short description
        shortDescInput.value = itemData.desc.length > 100 ? itemData.desc.substring(0, 97) + '...' : itemData.desc;
      }

      // Auto-fill link if empty
      const linksInput = document.getElementById('links');
      if (linksInput && !linksInput.value && itemData.link) {
        linksInput.value = itemData.link;
      }

      // Auto-fill image if empty
      const imageInput = document.getElementById('image');
      if (imageInput && !imageInput.value && itemData.image) {
        imageInput.value = itemData.image;
      }
    } else {
      showItemDetails(null);
    }
  });
}
