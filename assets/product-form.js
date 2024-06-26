customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');
    if(!!submitButton) {
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    // const body = JSON.stringify({
    //   ...JSON.parse(serializeForm(this.form)),
    //   sections: this.getSectionsToRender().map((section) => section.section),
    //   sections_url: window.location.pathname
    // });

    // fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
    //   .then((response) => response.json())


    //  USE new settings from dawn theme
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
      formData.append(
        'sections',
        this.getSectionsToRender().map((section) => section.section)
      );
      formData.append('sections_url', window.location.pathname);
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((parsedState) => {

        this.getSectionsToRender().forEach((section => {

          const elementToReplace =
            document.getElementById(section.id)?.querySelector(section.selector) || document.getElementById(section.id);
         
            elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
        this.cartDrawer.open();
      });
    }
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

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
});


// if (!customElements.get('product-form')) {
//   customElements.define('product-form', class ProductForm extends HTMLElement {
//     constructor() {
//       super();

//       this.form = this.querySelector('form');
//       this.form.querySelector('[name=id]').disabled = false;
//       this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
//       this.cartDrawer = document.querySelector('cart-drawer');
//     }

//     onSubmitHandler(evt) {
//       evt.preventDefault();
//       const submitButton = this.querySelector('[type="submit"]');
//       if (submitButton.classList.contains('loading')) return;

//       this.handleErrorMessage();

//       submitButton.setAttribute('aria-disabled', true);
//       submitButton.classList.add('loading');
//       this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

//       const config = fetchConfig('javascript');
//       config.headers['X-Requested-With'] = 'XMLHttpRequest';
//       delete config.headers['Content-Type'];

//       const formData = new FormData(this.form);
//       formData.append('sections', this.cartDrawer.getSectionsToRender().map((section) => section.id));
//       formData.append('sections_url', window.location.pathname);
//       config.body = formData;

//       fetch(`${routes.cart_add_url}`, config)
//         .then((response) => response.json())
//         .then((response) => {
//           if (response.status) {
//             this.handleErrorMessage(response.description);
//             return;
//           }

//           console.log(response)

//           this.cartDrawer.getSectionInnerHTML(response);
//         })
//         .catch((e) => {
//           console.error(e);
//         })
//         .finally(() => {
//           submitButton.classList.remove('loading');
//           submitButton.removeAttribute('aria-disabled');
//           this.querySelector('.loading-overlay__spinner').classList.add('hidden');
//         });
//     }

//     handleErrorMessage(errorMessage = false) {
//       this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
//       this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

//       this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

//       if (errorMessage) {
//         this.errorMessage.textContent = errorMessage;
//       }
//     }
//   });
// }
