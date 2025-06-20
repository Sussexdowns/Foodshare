


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

  // show links in the footer
  function showLinks() {
    const footerLinks = $('#footer-link');
    links.forEach(link => {
      const listItem = $('<li></li>');
      const anchor = $(`<a href="${link.url}" target="_blank">${link.name}</a>`);
      listItem.append(anchor);
      footerLinks.append(listItem);
    });
  }


let links = [
    { name: 'Lewes District Council', url: 'https://www.lewes-eastbourne.gov.uk/' },
    { name: 'Sussex Wildlife Trust', url: 'https://sussexwildlifetrust.org.uk/' },
    { name: 'Visit Lewes', url: 'https://www.visitlewes.co.uk/' },
    { name: 'Lewes Farmers Market', url: 'https://www.lewesfarmersmarket.co.uk/' },
    { name: 'Lewes Bonfire Society', url: 'https://www.lewesbonfirecelebrations.com/' }
  ];  

  let categorylinks = [
    { name: 'Fruit', url: 'https://example.com/fruit' },
    { name: 'Vegetable', url: 'https://example.com/vegetable' },
    { name: 'Flower', url: 'https://example.com/flower' },
    { name: 'Herb', url: 'https://example.com/herb' }
  ];

  let itemLinks = [
    { name: 'Apple', url: 'https://example.com/apple' },
    { name: 'Carrot', url: 'https://example.com/carrot' },
    { name: 'Rose', url: 'https://example.com/rose' },
    { name: 'Basil', url: 'https://example.com/basil' }
  ];

  // Call the function to populate footer links  
  showLinks();
