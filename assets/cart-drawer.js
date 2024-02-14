class CartDrawerRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartDrawer = this.closest('cart-drawer');
      const idx = this.dataset.index;
      const drawerItem = cartDrawer.querySelector(`.cart-drawer__item[data-idx="${idx}"]`);
      const bundleId = drawerItem.dataset.bundle;

      let qtyChanges = {};
      
      if (bundleId) {
        let itemsWithBundleId = cartDrawer.querySelectorAll(`.cart-drawer__item[data-bundle="${bundleId}"]`);
        for (let item of itemsWithBundleId) {
          const itemKey = item.querySelector('cart-drawer-remove-button').dataset.key;
          qtyChanges[itemKey] = 0;
        }
        
        cartDrawer.enableLoading();

        const body = JSON.stringify({
          updates: qtyChanges,
          sections: cartDrawer.getSectionsToRender().map((section) => section.section),
          sections_url: window.location.pathname
        });
    
        fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }})
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            const parsedState = JSON.parse(state);

            cartDrawer.getSectionsToRender().forEach((section => {
              const elementToReplace =
                document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                
              elementToReplace.innerHTML =
              cartDrawer.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            }));

            cartDrawer.disableLoading();
          
          }).catch((error) => {
            cartDrawer.disableLoading();
            console.log(error);
          });

      } else {
        this.closest('cart-drawer').updateQuantity(idx, 0);
      }
    });
  }
}

customElements.define('cart-drawer-remove-button', CartDrawerRemoveButton);

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    
    // Elements
    this.body = document.body;
    this.drawer = document.getElementById('cart-drawer');
    
    this.cartButton = document.querySelectorAll('.js-open-cart');
    this.cartButton.forEach(btn => {
      btn.addEventListener('click', this.handleCartClick.bind(this));
    })

    this.closeIcon = document.getElementById('cart-drawer__close');
    this.closeIcon.addEventListener('click', this.close.bind(this));
    
    this.onBodyClick = this.handleBodyClick.bind(this);
    this.drawer.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());

    this.pageOverlayElement = document.querySelector('.page-overlay');

    // Functionality
    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  open() {
    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    this.pageOverlayElement.classList.add('is-visible');
    document.body.addEventListener('click', this.onBodyClick);

    this.body.classList.add('scroll-lock');
  }

  close() {
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.removeAttribute('aria-expanded', true);

    this.pageOverlayElement.classList.remove('is-visible');
    document.body.removeEventListener('click', this.onBodyClick);

    this.body.classList.remove('scroll-lock');
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            
          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));

        this.disableLoading();
      }).catch(() => {
        this.disableLoading();
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer__content',
        section: document.getElementById('cart-drawer__content').dataset.id,
        selector: '.cart-drawer__content',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-icon-bubble-header',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading() {
    document.getElementById('cart-drawer-loading').classList.remove('hidden');
  }

  disableLoading() {
    document.getElementById('cart-drawer-loading').classList.add('hidden');
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target.classList.contains('page-overlay')) {
      this.close();
      this.pageOverlayElement.classList.remove('is-visible');
      this.body.classList.remove('scroll-lock');
    }
  }

  handleCartClick(evt) {
    evt.preventDefault();
    this.open();
  }
}

customElements.define('cart-drawer', CartDrawer);
