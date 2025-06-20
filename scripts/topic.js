// topics.js

document.addEventListener('DOMContentLoaded', function () {
  // Your entire script goes here...

  let itemsData = {};

  const categorySelect = document.getElementById('category');
  const itemSelect = document.getElementById('item');
  const newItemInput = document.getElementById('new-item');

  fetch('items.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load items.json');
      return response.json();
    })
    .then(data => {
      itemsData = data;

      for (const category in itemsData) {
        itemsData[category].sort((a, b) => a.Name.localeCompare(b.Name));
      }

      if (categorySelect) {
        populateItemsDropdown(categorySelect.value);
      }

      showItemCategories();
    })
    .catch(err => {
      console.error('Error loading items.json:', err);
    });

  function populateItemsDropdown(categoryKey) {
    itemSelect.innerHTML = '';
    if (!itemsData[categoryKey]) return;

    itemsData[categoryKey].forEach(item => {
      const option = document.createElement('option');
      option.value = item.Name.toLowerCase().replace(/\s+/g, '-');
      option.textContent = item.Name;
      itemSelect.appendChild(option);
    });

    newItemInput.classList.add('d-none');
    newItemInput.value = '';
  }

  function showItemCategories() {
    const container = document.getElementById('item-link');
    if (!container) return;

    container.innerHTML = '';

    for (const category in itemsData) {
      const categoryHeader = document.createElement('h1');
      categoryHeader.textContent = category.toUpperCase();
      container.appendChild(categoryHeader);

      const list = document.createElement('ul');
        list.className = 'list-group mb-4';

      itemsData[category].forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        const link = document.createElement('a');
        link.className = 'stretched-link';
        link.href = item.Link;
        link.textContent = item.Name;
        link.target = '_blank';
        listItem.appendChild(link);
        list.appendChild(listItem);
      });

      container.appendChild(list);
    }
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const selected = categorySelect.value;

      if (itemsData[selected]) {
        populateItemsDropdown(selected);
      } else {
        itemSelect.innerHTML = '';
        newItemInput.classList.remove('d-none');
      }
    });
  }

  $('#month').select2({
    placeholder: 'Select months',
    width: '100%'
  });
});
