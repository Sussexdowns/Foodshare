
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
      // Sort each category array alphabetically
      for (const category in itemsData) {
        itemsData[category].sort((a, b) => a.localeCompare(b));
      }
      populateItemsDropdown(document.getElementById('category').value);
    })
    .catch(err => {
      console.error('Error loading items.json:', err);
    });

  const categorySelect = document.getElementById('category');
  const itemSelect = document.getElementById('item');
  const newItemInput = document.getElementById('new-item');

  // Populate items dropdown based on selected category
  function populateItemsDropdown(categoryKey) {
    itemSelect.innerHTML = ''; // Clear current items

    if (!itemsData[categoryKey]) return;

    itemsData[categoryKey].forEach(item => {
      const option = document.createElement('option');
      option.value = item.toLowerCase().replace(/\s+/g, '-');
      option.textContent = item;
      itemSelect.appendChild(option);
    });

    // Hide new item input on normal category selection
    newItemInput.classList.add('d-none');
    newItemInput.value = '';
  }

  // Listen for category change
  categorySelect.addEventListener('change', () => {
    const selected = categorySelect.value;

    if (itemsData[selected]) {
      populateItemsDropdown(selected);
    } else {
      itemSelect.innerHTML = '';
      newItemInput.classList.remove('d-none'); // Show new item input if needed
    }
  });

    $(document).ready(function () {
    $('#month').select2({
        placeholder: 'Select months',
        width: '100%'
    });
    });