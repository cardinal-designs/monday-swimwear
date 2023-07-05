class CollectionFilters extends HTMLElement {
  constructor() {
    super();
    
    this.categoryButtons = this.querySelectorAll('.collection-filters__button');
    this.tagButtons = this.querySelectorAll('.collection-filters__tag');
    this.overlay = this.querySelector('.collection-filters__overlay');
    this.clearButtons = this.querySelectorAll('.collection-filters__clear');
    this.clearAllButtons = this.querySelectorAll('.collection-filters__clear-all');
    this.applyButtons = this.querySelectorAll('.collection-filters__apply');
    this.activeTagsContainer = this.querySelector('.collection-filters__active-tags');
    this.sortButtons = this.querySelectorAll('.collection-filters__sort');

    this.mobileFilterContainer = this.querySelector('.collection-filters__categories');
    this.mobileSortContainer = this.querySelector('.collection-filters__sorting');
    
    this.collectionURL = this.dataset.collectionUrl;
    this.currentTags = this.dataset.currentTags.split('+');
    this.temporaryTags = this.currentTags.slice();
    this.sortBy = this.dataset.currentSort;

    this.setListeners();
  }

  setListeners() {
     // Functionality to click out of dropdown
    this.overlay.addEventListener('click', event => {
      document.querySelector('.collection-filters__item.active').classList.remove('active');
      this.overlay.classList.remove('active');

      if (window.innerWidth < 769) {
        this.mobileFilterContainer.classList.remove('active');
      }
    });

    // Handle Button/Category Click
    this.categoryButtons.forEach(categoryButton => {
      categoryButton.addEventListener('click', this.handleButtonClick.bind(this, categoryButton));
    });

    // Handle Filter Click
    this.tagButtons.forEach(tagButton => {
      tagButton.addEventListener('click', this.handleFilterClick.bind(this, tagButton));
    });

    // Clear filters by category
    this.clearButtons.forEach(clearButton => {
      clearButton.addEventListener('click', this.clearByCategory.bind(this, clearButton));
    });

    // Clear all filters
    this.clearAllButtons.forEach(clearAllButton => {
      clearAllButton.addEventListener('click', this.clearAllFilters.bind(this, clearAllButton));
    });

    // Apply filters close dropdown
    this.applyButtons.forEach(applyButton => {
      applyButton.addEventListener('click', () => {
        const activeItem = document.querySelector('.collection-filters__item.active');

        if (activeItem) {
          activeItem.classList.remove('active');
        }

        if (window.innerWidth < 769) {
          document.querySelector('.collection-filters__categories.active').classList.remove('active');
        }

        this.overlay.classList.remove('active');
      });
    });

    // Remove active tag
    this.activeTagsContainer.addEventListener('click', event => {
      if (event.target.classList.contains('collection-filters__active-tag-remove')) {
        const tag = event.target.parentElement.dataset.value;
        this.removeTag(tag);
      }
    });

    // Handle Sort Click
    this.sortButtons.forEach(sortButton => {
      sortButton.addEventListener('click', this.handleSortClick.bind(this, sortButton));
    });

    // Mobile Filter Open
    this.querySelectorAll('.open-filters').forEach( o => {
      o.addEventListener('click', (e) => {
        this.openMobileFilters(e);
      });
    })

    // Mobile Sort Open
    this.querySelector('.open-sort').addEventListener('click', () => {
      this.openMobileSort();
    });

    // Mobile Sort Apply
    this.querySelector('.collection-filters__sort-apply').addEventListener('click', () => {
      this.closeMobileSort();
    });
  }

  handleButtonClick(categoryButton, event) {
    const parent = categoryButton.parentElement;
    const activeItem = document.querySelector('.collection-filters__item.active');

    // Toggle dropdowns
    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
      this.overlay.classList.remove('active');
    } else {
      if (activeItem) {
        activeItem.classList.remove('active');
      }

      parent.classList.add('active');
      this.overlay.classList.add('active');
    }
  }

  openMobileFilters(e) {
    const closeFilterContainer = document.querySelector('.collection-filters__close');

    const button = e.target
    const category = button.dataset.openFilterCategory

    const dropdown = document.querySelector(`.collection-filters__item[data-filter-category="${ category }"]`)


    // open menu
    this.mobileFilterContainer.classList.add('active');
    this.overlay.classList.add('active');
    this.overlay.addEventListener('click', () => {
      this.closeMobileFilters();
    });

    // find current open dropdown
    const activeItem = document.querySelector('.collection-filters__item.active');

    // Toggle dropdowns
    if (activeItem) {
      activeItem.classList.remove('active');
    }
    dropdown.classList.add('active');

    closeFilterContainer.addEventListener('click', () => {
      this.closeMobileFilters();
    });
  }

  closeMobileFilters() {
    this.mobileFilterContainer.classList.remove('active');
    this.overlay.classList.remove('active');
  }

  openMobileSort() {
    const closeSortContainer = document.querySelector('.collection-filters__sort-close');

    this.mobileSortContainer.classList.add('active');
    this.overlay.classList.add('active');
    this.overlay.addEventListener('click', () => {
      this.closeMobileSort();
    });
    closeSortContainer.addEventListener('click', () => {
      this.closeMobileSort();
    });
  }

  closeMobileSort() {
    this.mobileSortContainer.classList.remove('active');
    this.overlay.classList.remove('active');
  }

  handleFilterClick(tagButton, event) {
    const filter = tagButton.dataset.value;
    
    if (tagButton.classList.contains('active')) {
       // Delete the tag if already active
      this.temporaryTags.splice(this.temporaryTags.indexOf(filter), 1);
    } else {
      const activeSibling = tagButton.closest('.collection-filters__item').querySelector('.active');

      if (activeSibling) {
        this.temporaryTags.splice(this.temporaryTags.indexOf(activeSibling.dataset.value), 1);
      }

      // Add if not previously active
      this.temporaryTags.push(filter);
    }

    this.updateActiveButtons();
    this.applyFilters();
  }

  updateActiveButtons() {
    this.tagButtons.forEach(tagButton => {
      const filter = tagButton.dataset.value;

      if (this.temporaryTags.includes(filter)) {
        tagButton.classList.add('active');
      } else {
        tagButton.classList.remove('active');
      }
    });
  }

  applyFilters() {
    // Only reload sections if tags have changed
    this.currentTags = this.currentTags.filter(el => el != '');
    this.temporaryTags = this.temporaryTags.filter(el => el != '');
    if (this.currentTags.sort().join(',') !== this.temporaryTags.sort().join(',')) {
      this.currentTags = this.temporaryTags.slice();
      this.reloadSections();
    }
  }

  clearByCategory(clearButton) {
    const category = clearButton.dataset.category;
    const activeFilterButton = this.querySelector(`.collection-filters__dropdown-list[data-category="${category}"] .collection-filters__tag.active`);
    const tag = activeFilterButton.dataset.value;

    if (activeFilterButton) {
      // Remove active class
      activeFilterButton.classList.remove('active');

      // Remove from array
      this.temporaryTags.splice(this.temporaryTags.indexOf(tag), 1);

      this.updateActiveButtons();
      this.applyFilters();
    }
  }

  clearAllFilters() {
    this.temporaryTags = [];
    document.querySelector('.collection-filters__categories.active')?.classList.remove('active');

    this.updateActiveButtons();
    this.applyFilters();
  }

  removeTag(tag) {
    this.temporaryTags.splice(this.temporaryTags.indexOf(tag), 1);

    this.updateActiveButtons();
    this.applyFilters();
  }

  handleSortClick(sortButton) {
    const sort = sortButton.dataset.value;

    // Make clicked button active
    if (!sortButton.classList.contains('active')) {
      this.querySelector('.collection-filters__sort.active').classList.remove('active');
      sortButton.classList.add('active');

      this.sortBy = sort;

      this.currentTags = this.currentTags.filter(el => el != '');
      this.reloadSections();
    }
  }

  reloadSections() {
    // Change URL
    const tags = this.currentTags.length > 0 ?  '/' + this.currentTags.join('+') : '';
    const newUrl = window.location.protocol + '//' + window.location.host + this.collectionURL + tags + '?sort_by=' + this.sortBy;
    
    if (history.replaceState) {
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    // Get section rendering URL 
    const url = newUrl + `/?section_id=main-collection-product-grid`;
    console.log(location.pathname)

    // Fetch and replace sections
    this.enableLoading();
    fetch(location.pathname + '?sort_by=' + this.sortBy)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;

        this.getSectionsToRender().forEach((section => {
            document.getElementById(section.id).innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById(section.id).innerHTML;
        }));

        const categoryClearButtons = document.querySelectorAll('.category-clear-wrapper')
        if(categoryClearButtons) {
          categoryClearButtons.forEach( b => {
            document.getElementById(b.id).innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById(b.id).innerHTML;
          })

          const newButtons = this.querySelectorAll('.collection-filters__clear');
          newButtons.forEach(b => {
            b.addEventListener('click', this.clearByCategory.bind(this, b));
          })
          
        }
      
        this.disableLoading();
      })
      .catch(() => {
        this.disableLoading();
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'ProductGridContainer'
      },
      {
        id: 'CollectionFilterActiveTags'
      },
      {
        id: 'CollectionFilterActiveTagsMobile'
      },
      {
        id: 'CollectionFilterProductTotal'
      },
      {
        id: 'ActiveFilterCount'
      },
      {
        id: 'ActiveFilterCountButton'
      }
    ]
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading() {
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
  }

  disableLoading() {
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.remove('loading');
  }
}

customElements.define('collection-filters', CollectionFilters);