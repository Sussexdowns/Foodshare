
  $(document).ready(function () {
    // 1. Apply dark mode on page load if previously set
    const isDarkStored = localStorage.getItem('darkMode') === 'true';
    if (isDarkStored) {
      applyDarkMode(true);
      $('#darkModeToggle').prop('checked', true);
    }

    // 2. Toggle dark mode when user interacts with checkbox
    $('#darkModeToggle').on('change', function () {
      const isDark = $(this).is(':checked');
      applyDarkMode(isDark);
      localStorage.setItem('darkMode', isDark);
    });

    // 3. Dark mode toggling logic
    function applyDarkMode(enable) {
      $('body').toggleClass('dark-mode', enable);
      $('nav').toggleClass('navbar-dark bg-dark', enable);
      $('button.btn-close').toggleClass('btn-close-white', enable);
    }

    // 4. Select2 with icons for category dropdown
    function formatOptionWithIcon(state) {
      if (!state.id) return state.text;

      const iconMap = {
        "Fruit": "fa-apple-whole",
        "Vegetable": "fa-carrot",
        "Flower": "fa-seedling",
        "Herb": "fa-leaf"
      };

      const iconClass = iconMap[state.text] || "fa-tag";
      return $(`<span><i class="fa-solid ${iconClass} me-2"></i>${state.text}</span>`);
    }

    $('#category').select2({
      width: '100%',
      templateResult: formatOptionWithIcon,
      templateSelection: formatOptionWithIcon,
      minimumResultsForSearch: Infinity
    });
  });


  $( '#select-field' ).select2( {
    theme: 'bootstrap-5'
} );