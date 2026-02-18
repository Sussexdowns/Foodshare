// form.js

let itemsData = {};

// Load JSON data from items.json
fetch('items.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load items.json');
    return response.json();
  })
  .then(data => {
    itemsData = data;

    // Sort each category's items alphabetically by Name (with null checks)
    for (const category in itemsData) {
      if (itemsData[category] && Array.isArray(itemsData[category])) {
        itemsData[category].sort((a, b) => {
          const nameA = a && a.Name ? a.Name : '';
          const nameB = b && b.Name ? b.Name : '';
          return nameA.localeCompare(nameB);
        });
      }
    }

    populateItemsDropdown(document.getElementById('category').value);
  })
  .catch(err => {
    console.error('Error loading items.json:', err);
  });

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

  const items = itemsData[categoryKey];
  if (!items || !Array.isArray(items)) return;

  items.forEach(item => {
    if (!item || !item.Name) return;
    const option = document.createElement('option');
    option.value = item.Name.toLowerCase().replace(/\s+/g, '-');
    option.textContent = item.Name;
    option.setAttribute('data-link', item.Link || '');
    option.setAttribute('data-image', item.Image || '');
    option.setAttribute('data-desc', item.Desc || '');
    option.setAttribute('data-name', item.Name || '');
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
  
  if (itemData && itemData.link) {
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

    if (itemsData[selected]) {
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
