  $(document).ready(function () {
    // Apply dark mode from localStorage if it was enabled previously
    if (localStorage.getItem('darkMode') === 'true') {
      $('body').addClass('dark-mode');
      $('#darkModeToggle').prop('checked', true);
    }

    $('#darkModeToggle').on('change', function () {
      const isDark = $(this).is(':checked');
      $('body').toggleClass('dark-mode', isDark);
      localStorage.setItem('darkMode', isDark);
    });

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
    minimumResultsForSearch: Infinity // hides search box
  });
});
