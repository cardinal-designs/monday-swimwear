customElements.define('look-book', class LookBook extends HTMLElement {
  constructor() {
    super();

    this.body = document.body;
    this.lookbook = this.querySelector('.lookbook');

    this.openButtons = this.querySelectorAll('[data-open]');
    this.openButtons.forEach(button => button.addEventListener('click', this.open.bind(this)));

    this.closeButtons = this.querySelectorAll('[data-close]');
    this.closeButtons.forEach(button => button.addEventListener('click', this.close.bind(this)));

    this.addToCartButtons = this.querySelectorAll('.js-add-to-cart');
    this.addToCartButtons.forEach(button => button.addEventListener('click', this.close.bind(this)));
  }

  open(event) {
    const index = event.currentTarget.dataset.index;

    this.querySelector('.lookbook__slideout-item.active').classList.remove('active');
    this.querySelector(`.lookbook__slideout-item[data-index="${index}"]`).classList.add('active');

    this.lookbook.classList.add('open');
    this.body.classList.add('scroll-lock');
  }

  close() {
    this.lookbook.classList.remove('open');
    this.body.classList.remove('scroll-lock');

    this.querySelector('.lookbook__slideout').scrollTop = 0;
  }
});