
// Base path for GitHub Pages deployment (globally accessible)
var BASE_PATH = window.location.pathname.includes('/Foodshare/') ? '/Foodshare/' : '/';
// Make it globally accessible
window.BASE_PATH = BASE_PATH;

// Footer links data
const footerLinksData = [
  { name: 'Lewes District Council', url: 'https://www.lewes-eastbourne.gov.uk/' },
  { name: 'Sussex Wildlife Trust', url: 'https://sussexwildlifetrust.org.uk/' },
  { name: 'Visit Lewes', url: 'https://www.visitlewes.co.uk/' },
  { name: 'Lewes Farmers Market', url: 'https://www.lewesfarmersmarket.co.uk/' },
  { name: 'Lewes Bonfire Society', url: 'https://www.lewesbonfirecelebrations.com/' }
];

// Show links in the footer
function showFooterLinks() {
  const footerLinksList = document.getElementById('footer-links-list');
  if (footerLinksList) {
    footerLinksList.innerHTML = '';
    footerLinksData.forEach(link => {
      const li = document.createElement('li');
      li.innerHTML = '<a href="' + link.url + '" target="_blank">' + link.name + '</a>';
      footerLinksList.appendChild(li);
    });
  }
}

/**
 * Load HTML fragment into a placeholder element
 * @param {string} placeholderId - ID of the placeholder element
 * @param {string} fragmentUrl - URL of the HTML fragment to load
 * @param {function} callback - Optional callback after loading
 */
function loadFragment(placeholderId, fragmentUrl, callback) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.warn(`Placeholder #${placeholderId} not found`);
    if (callback) callback(null);
    return;
  }

  fetch(fragmentUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      placeholder.innerHTML = html;
      console.log(`Loaded ${fragmentUrl} into #${placeholderId}`);
      if (callback) callback(placeholder);
    })
    .catch(error => {
      console.error(`Error loading ${fragmentUrl}:`, error);
      if (callback) callback(null);
    });
}

/**
 * Load header and footer into the page
 */
function loadHeaderFooter() {
  // Load header
  loadFragment('header-placeholder', BASE_PATH + 'header.html', () => {
    // Initialize Bootstrap collapse after header loads
    if (typeof bootstrap !== 'undefined') {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarMenu = document.getElementById('navbarMenu');
      if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener('click', () => {
          navbarMenu.classList.toggle('show');
        });
      }
    }
  });

  // Load footer
  loadFragment('footer-placeholder', BASE_PATH + 'footer.html', () => {
    showFooterLinks();
    applyDarkModeFromStorage();
    attachFooterEventListeners();
  });

  // Load settings modal content directly into settingsModal
  loadSettingsModal();
}

/**
 * Load settings modal content
 */
function loadSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  if (!settingsModal) return;

  fetch(BASE_PATH + 'settings_modal.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      return response.text();
    })
    .then(html => {
      settingsModal.innerHTML = html;
      console.log('Loaded settings_modal.html into #settingsModal');
      // Attach event listeners for settings modal buttons after content loads
      attachSettingsModalEventListeners();
    })
    .catch(error => {
      console.error('Error loading settings_modal.html:', error);
    });
}

/**
 * Attach event listeners for settings modal
 */
function attachSettingsModalEventListeners() {
  const closeSettingsBtn = document.getElementById('closeSettings');
  if (closeSettingsBtn && !closeSettingsBtn.hasAttribute('data-listener-attached')) {
    closeSettingsBtn.addEventListener('click', closeSettings);
    closeSettingsBtn.setAttribute('data-listener-attached', 'true');
  }

  const cancelSettingsBtn = document.getElementById('cancelSettings');
  if (cancelSettingsBtn && !cancelSettingsBtn.hasAttribute('data-listener-attached')) {
    cancelSettingsBtn.addEventListener('click', closeSettings);
    cancelSettingsBtn.setAttribute('data-listener-attached', 'true');
  }

  const saveSettingsBtn = document.getElementById('saveSettings');
  if (saveSettingsBtn && !saveSettingsBtn.hasAttribute('data-listener-attached')) {
    saveSettingsBtn.addEventListener('click', saveSettings);
    saveSettingsBtn.setAttribute('data-listener-attached', 'true');
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
  // Save user address
  const userAddressInput = document.getElementById('userAddress');
  if (userAddressInput) {
    localStorage.setItem('userAddress', userAddressInput.value.trim());
  }

  // Save JSON source preference
  const useJsonAsSourceInput = document.getElementById('useJsonAsSource');
  if (useJsonAsSourceInput) {
    localStorage.setItem('useJsonAsSource', useJsonAsSourceInput.checked);
  }

  // Save sheet URL
  const sheetURLInput = document.getElementById('sheetURL');
  if (sheetURLInput) {
    localStorage.setItem('sheetURL', sheetURLInput.value.trim());
  }

  // Save icon style preference
  const toggleIconStyleInput = document.getElementById('toggle-icon-style');
  if (toggleIconStyleInput) {
    localStorage.setItem('useFontAwesome', toggleIconStyleInput.checked);
  }

  // Save show images preference
  const showImagesInput = document.getElementById('show-images');
  if (showImagesInput) {
    localStorage.setItem('showImages', showImagesInput.checked);
  }

  // Close modal
  closeSettings();

  // Reload page to apply changes
  location.reload();
}

// Dark mode toggle function - exposed globally
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');

  // Update button icon
  const darkModeBtn = document.getElementById('darkModeToggle');
  if (darkModeBtn) {
    const icon = darkModeBtn.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // Call shared update function if available
  if (typeof window.updateDarkModeIcon === 'function') {
    window.updateDarkModeIcon();
  }

  return isDark;
}

// Settings modal functions - exposed globally
function openSettings() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('visible');

    // Populate fields with saved values
    const userAddressInput = document.getElementById('userAddress');
    if (userAddressInput) {
      userAddressInput.value = localStorage.getItem('userAddress') || '';
    }

    const useJsonAsSourceInput = document.getElementById('useJsonAsSource');
    if (useJsonAsSourceInput) {
      useJsonAsSourceInput.checked = localStorage.getItem('useJsonAsSource') !== 'false';
    }

    const sheetURLInput = document.getElementById('sheetURL');
    if (sheetURLInput) {
      sheetURLInput.value = localStorage.getItem('sheetURL') || '';
    }

    const toggleIconStyleInput = document.getElementById('toggle-icon-style');
    if (toggleIconStyleInput) {
      toggleIconStyleInput.checked = localStorage.getItem('useFontAwesome') !== 'false';
    }

    const showImagesInput = document.getElementById('show-images');
    if (showImagesInput) {
      showImagesInput.checked = localStorage.getItem('showImages') !== 'false';
    }
  }
}

function closeSettings() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('visible');
    modal.classList.add('hidden');
  }
}

// Footer details panel functions - exposed globally
function openFooterDetails() {
  const panel = document.getElementById('footer-details-panel');
  if (panel) {
    panel.classList.add('visible');
  }
}

function closeFooterDetails() {
  const panel = document.getElementById('footer-details-panel');
  if (panel) {
    panel.classList.remove('visible');
  }
}

// Apply dark mode on page load
function applyDarkModeFromStorage() {
  const isDarkStored = localStorage.getItem('darkMode') === 'enabled';
  if (isDarkStored) {
    document.body.classList.add('dark-mode');
  }

  // Update button icon
  const darkModeBtn = document.getElementById('darkModeToggle');
  if (darkModeBtn) {
    const icon = darkModeBtn.querySelector('i');
    if (icon) {
      icon.className = isDarkStored ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}

// Attach event listeners for footer buttons
function attachFooterEventListeners() {
  const darkModeBtn = document.getElementById('darkModeToggle');
  if (darkModeBtn && !darkModeBtn.hasAttribute('data-listener-attached')) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
    darkModeBtn.setAttribute('data-listener-attached', 'true');
  }

  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn && !settingsBtn.hasAttribute('data-listener-attached')) {
    settingsBtn.addEventListener('click', openSettings);
    settingsBtn.setAttribute('data-listener-attached', 'true');
  }

  const footerDetailsBtn = document.getElementById('footerDetailsBtn');
  if (footerDetailsBtn && !footerDetailsBtn.hasAttribute('data-listener-attached')) {
    footerDetailsBtn.addEventListener('click', openFooterDetails);
    footerDetailsBtn.setAttribute('data-listener-attached', 'true');
  }

  const footerClose = document.getElementById('footer-close');
  if (footerClose && !footerClose.hasAttribute('data-listener-attached')) {
    footerClose.addEventListener('click', closeFooterDetails);
    footerClose.setAttribute('data-listener-attached', 'true');
  }

  // Close modal when clicking outside
  const settingsModal = document.getElementById('settingsModal');
  if (settingsModal) {
    settingsModal.addEventListener('click', function (e) {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });
  }

  // Close footer details when clicking outside
  const footerDetailsPanel = document.getElementById('footer-details-panel');
  if (footerDetailsPanel) {
    footerDetailsPanel.addEventListener('click', function (e) {
      if (e.target === footerDetailsPanel) {
        closeFooterDetails();
      }
    });
  }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  // Load header and footer
  loadHeaderFooter();
});
