// topics.js

document.addEventListener('DOMContentLoaded', function () {
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

      // Sort items alphabetically within each category
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

    // Category display names mapping
    const categoryNames = {
      'fruits': 'FRUITS',
      'vegetables': 'VEGETABLES',
      'flowers': 'FLOWERS',
      'herbs': 'HERBS'
    };

    for (const category in itemsData) {
      // Create section
      const section = document.createElement('section');
      section.className = 'topic-section';

      // Create category header
      const categoryHeader = document.createElement('h2');
      categoryHeader.textContent = categoryNames[category] || category.toUpperCase();
      section.appendChild(categoryHeader);

      // Create grid container
      const grid = document.createElement('div');
      grid.className = 'topic-grid';

      itemsData[category].forEach(item => {
        // Create card
        const card = document.createElement('div');
        card.className = 'topic-card';

        // Create image
        const img = document.createElement('img');
        img.className = 'topic-img';
        img.src = item.Image || 'https://commons.wikimedia.org/wiki/Special:FilePath/No_image_placeholder.svg';
        img.alt = item.Name;
        img.loading = 'lazy';
        img.decoding = 'async';
        card.appendChild(img);

        // Create body
        const body = document.createElement('div');
        body.className = 'topic-body';

        // Create title
        const title = document.createElement('div');
        title.className = 'topic-title';
        title.textContent = item.Name;
        body.appendChild(title);

        // Create description
        const desc = document.createElement('div');
        desc.className = 'topic-desc';
        desc.textContent = item.Desc || '';
        body.appendChild(desc);

        // Create Wikipedia link
        const wikiLink = document.createElement('a');
        wikiLink.className = 'topic-link';
        wikiLink.href = item.Link;
        wikiLink.target = '_blank';
        wikiLink.rel = 'noopener noreferrer';
        wikiLink.textContent = 'Learn more';
        body.appendChild(wikiLink);

        // Create image source link
        const imgLink = document.createElement('a');
        imgLink.className = 'topic-link';
        imgLink.href = item.Image || '#';
        imgLink.target = '_blank';
        imgLink.rel = 'noopener noreferrer';
        imgLink.textContent = 'Image source';
        body.appendChild(imgLink);

        card.appendChild(body);
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
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
