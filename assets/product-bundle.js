class ProductBundle extends HTMLElement {
  constructor() {
    super();

    this.readyToAdd = false;
    this.totalProducts = this.dataset.total;
    this.title = this.dataset.title;

    this.atcButton = this.querySelector('button[type="submit"]');
    this.atcButton.addEventListener('click', this.addToCart.bind(this));

    this.sizes = this.querySelectorAll('input');
    this.sizes.forEach(size => {
      size.addEventListener('change', this.onVariantChange.bind(this));
    });
  }

  onVariantChange() {
    const totalSelected = this.getSelectedVariants().length;
    console.log(this.totalProducts, totalSelected)

    if (this.totalProducts == totalSelected) {
      this.atcButton.innerHTML = 'Add To Cart';
      this.atcButton.removeAttribute('disabled');

      if (this.readyToAdd == false) {
        this.readyToAdd == true;
      }
    }
  }

  getSelectedVariants() {
    const variants = [];
    this.selected = this.querySelectorAll('input:checked');

    this.selected.forEach(size => {
      variants.push(size.value);
    });

    return variants;
  }

  addToCart(event) {
    event.preventDefault();

    let items = [];
    const bundleId = Date.now().toString(36);

    this.getSelectedVariants().map(variant => {
      items.push({
        id: variant,
        quantity: 1,
        properties: {
          "Bundle": this.title,
          "_bundleId": bundleId
        }
      })
    });

    const body = JSON.stringify({
      items: items,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    console.log(body)

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((parsedState) => {
        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        document.querySelector('cart-drawer').open();
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
      }
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
}

customElements.define('product-bundle', ProductBundle);