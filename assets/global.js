/* SLIDE UP */
let slideUp = (target, duration = 500) => {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    //alert("!");
  }, duration);
};

/* SLIDE DOWN */
let slideDown = (target, duration = 500) => {
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "block";
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

/* TOOGLE */
var slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === "none") {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = [
    "ARROWUP",
    "ARROWDOWN",
    "ARROWLEFT",
    "ARROWRIGHT",
    "TAB",
    "ENTER",
    "SPACE",
    "ESCAPE",
    "HOME",
    "END",
    "PAGEUP",
    "PAGEDOWN",
  ];
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener("keydown", (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener("mousedown", (event) => {
    mouseClick = true;
  });

  window.addEventListener(
    "focus",
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove("focused");

      if (mouseClick) return;

      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add("focused");
    },
    true
  );
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define("quantity-input", QuantityInput);

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

class HeaderDrawer extends HTMLElement {
  constructor() {
    super();

    this.body = document.body;
    this.drawer = this.querySelector(".menu-drawer");
    this.overlay = this.querySelector(".menu-drawer__overlay");
    this.openMenuButtons = document.querySelectorAll(".js-open-menu");
    this.closeMenuButtons = document.querySelectorAll(".js-close-menu");

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.openMenuButtons.forEach((openButton) =>
      openButton.addEventListener("click", this.openMenuDrawer.bind(this))
    );
    this.closeMenuButtons.forEach((closeButton) =>
      closeButton.addEventListener("click", this.closeMenuDrawer.bind(this))
    );

    [
      ...this.querySelectorAll(
        ".menu-drawer__menu-item--middle .menu-drawer__menu-item"
      ),
    ].forEach((menuItem) => {
      menuItem.addEventListener("click", (event) => {
        const menuItem = event.currentTarget;
        menuItem.classList.toggle("active");
        if (menuItem.nextElementSibling) {
          if (menuItem.classList.contains("active")) {
            menuItem.nextElementSibling.style.display = "block";
          } else {
            menuItem.nextElementSibling.style.display = "none";
          }
        }
      });
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    this.closeMenuDrawer();
  }

  openMenuDrawer() {
    this.drawer.setAttribute("aria-hidden", false);
    this.overlay.classList.add("is-visible");
    document.body.classList.add("scroll-lock");

    this.overlay.addEventListener("click", this.closeMenuDrawer.bind(this));
  }

  closeMenuDrawer() {
    this.drawer.setAttribute("aria-hidden", true);
    this.overlay.classList.remove("is-visible");
    document.body.classList.remove("scroll-lock");
  }
}

customElements.define("header-drawer", HeaderDrawer);

// class HeaderDrawer extends MenuDrawer {
//   constructor() {
//     super();
//   }

//   openMenuDrawer(summaryElement) {
//     this.header = this.header || document.getElementById('shopify-section-header');
//     this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
//     document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`);

//     setTimeout(() => {
//       this.mainDetailsToggle.classList.add('menu-opening');
//     });

//     summaryElement.setAttribute('aria-expanded', true);
//     trapFocus(this.mainDetailsToggle, summaryElement);
//     document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
//   }
// }

// customElements.define('header-drawer', HeaderDrawer);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }

  onVariantChange(event) {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateInfoText(event);

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    );

    console.log(newMedia)
    if (!newMedia) return;
    window.productSlider.slideToLoop(Number(newMedia.dataset.swiperSlideIndex));

    // if (!newMedia) return;
    // const modalContent = document.querySelector(
    //   `#ProductModal-${this.dataset.section} .product-media-modal__content`
    // );
    // const newMediaModal = modalContent.querySelector(
    //   `[data-media-id="${this.currentVariant.featured_media.id}"]`
    // );
    // const parent = newMedia.parentElement;
    // if (parent.firstChild == newMedia) return;
    // modalContent.prepend(newMediaModal);
    // parent.prepend(newMedia);
    // this.stickyHeader =
    //   this.stickyHeader || document.querySelector("sticky-header");
    // if (this.stickyHeader) {
    //   this.stickyHeader.dispatchEvent(new Event("preventHeaderReveal"));
    // }
    // window.setTimeout(() => {
    //   parent.scrollLeft = 0;
    //   parent
    //     .querySelector("li.product__media-item")
    //     .scrollIntoView({ behavior: "smooth" });
    // });
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    );
  }

  updateShareUrl() {
    const shareButton = document.getElementById(
      `Share-${this.dataset.section}`
    );
    if (!shareButton) return;
    shareButton.updateUrl(
      `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`
    );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  updateInfoText(event) {
    let value = event.target.closest("input:checked").value;
    let inventory = Number(
      event.target.closest("input:checked").dataset.inventory
    );
    const initialValue = event.target.closest("input:checked").value;
    const isSize = event.target.classList.contains("product-form__input-size");
    const isProductBar = event.target.classList.contains("is-product-bar");

    if (isSize) {
      switch (value) {
        case "P":
          value = "Petite";
          break;
        case "S":
          value = "Small";
          break;
        case "M":
          value = "Medium";
          break;
        case "L":
          value = "Large";
          break;
        case "V":
          value = "Voluptuous";
          break;
        case "VV":
          value = "Very Voluptuous";
          break;
        case "VVV":
          value = "Very Very Voluptuous";
          break;
        case "OS":
          value = "One Size";
        case "O/S":
          value = "One Size";
          break;
        case "P/S":
          value = "Petite / Small";
          break;
        case "S/M":
          value = "Small / Medium";
          break;
        case "M/L":
          value = "Medium / Large";
          break;
        case "L/V":
          value = "Large / Voluptuous";
          break;

        default:
          value;
      }

      if (inventory > 0 && inventory <= 10) {
        document.getElementById("almost-sold-out").style.display = "block";
      } else {
        document.getElementById("almost-sold-out").style.display = "none";
      }
    }

    if (isProductBar) {
      value =
        `<span class="product-form__input-active-size-bubble">${initialValue}</span> ` +
        value;
    }
    
    const activeTexts = event.target.closest('.product-form__input').querySelectorAll('.product-form__input-active');
    activeTexts.forEach((activeText) => {
      activeText.innerHTML = value;
    });

    const productBar = document.querySelector('.product-bar');
    if (productBar) {
      productBar.querySelector('.product-form__input-active').innerHTML = value;
    }
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  removeErrorMessage() {
    const section = this.closest("section");
    if (!section) return;

    const productForm = section.querySelector("product-form");
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove("visibility-hidden");
        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        );
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
}

customElements.define("variant-radios", VariantRadios);

/*============================================================================
  Functions
==============================================================================*/
function getSectionInnerHTML(html, selector) {
  return new DOMParser()
    .parseFromString(html, "text/html")
    .querySelector(selector).innerHTML;
}

/*================ Add To Cart ================*/
const atcButtons = document.querySelectorAll(".js-add-to-cart");
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-add-to-cart")) {
    event.preventDefault();
    const id = Number(event.target.dataset.id);
    const isPreSalePresent = event.target.dataset?.isPreSale;
    const propertiesObj =
      isPreSalePresent === "true" ? { properties: { _isPreSale: "true" } } : {};
    const body = JSON.stringify({
      items: [
        {
          id: id,
          quantity: 1,
          ...propertiesObj,
        },
      ],
      sections: atcGetSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_add_url}`, { ...fetchConfig("javascript"), body })
      .then((response) => response.json())
      .then((parsedState) => {
        atcGetSectionsToRender().forEach((section) => {
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id);

          elementToReplace.innerHTML = getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        document.querySelector("cart-drawer").open();
      });
  }
});

function atcGetSectionsToRender() {
  return [
    {
      id: "cart-drawer__content",
      section: document.getElementById("cart-drawer__content").dataset.id,
      selector: ".cart-drawer__content",
    },
    {
      id: "cart-icon-bubble",
      section: "cart-icon-bubble",
      selector: ".shopify-section",
    },
    {
      id: "cart-icon-bubble-header",
      section: "cart-icon-bubble",
      selector: ".shopify-section",
    },
  ];
}

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.swatches = this.querySelectorAll(".product-card__swatch");
    this.quickAdd = this.querySelectorAll(".product-card__button");
    this.cardImage = this.querySelector(
      ".product-card__image .initial-image img"
    );
    this.cardHoverImage = this.querySelector(
      ".product-card__image .hover-image img"
    );
    this.productTitle = this.querySelector(".product-card__title");
    this.links = this.querySelectorAll(".product-card__link");
    this.soldout = this.querySelector(".product-card__link .sold-out__tag");
    this.card = this.querySelector(".product-card__image");

    this.handleSwatchClick = (swatch, event) => {
      event.preventDefault();
      this.onSwatchClick(swatch);
    };

    this.swatches.forEach((swatch) => {
      swatch.addEventListener(
        "click",
        this.handleSwatchClick.bind(this, swatch)
      );
    });
  }

  onSwatchClick(swatch, event) {
    if (!swatch.classList.contains("active")) {
      const isVariant = swatch.dataset.isVariant;
      
      this.updateActiveSwatch(swatch);
      this.updateImages(swatch);
      this.updateTitle(swatch);
      this.updateLinks(swatch);
      this.updatePrice(swatch);
      if (isVariant != 'true') {
        this.updateVariants(swatch);
      }
    }
  }

  updateActiveSwatch(swatch) {
    this.swatches.forEach((swatch) => {
      swatch.classList.remove("active");
    });

    swatch.classList.add("active");
  }

  updateVariants(swatch) {
    const variant = swatch.dataset.title;
    this.quickAdd.forEach((button) => {
      if (button.dataset.button == variant) {
        button.style.display = "block";
        button.classList.add("active");
      } else {
        button.style.display = "none";
        button.classList.remove("active");
      }
    });
  }

  updateImages(swatch) {
    const image = swatch.dataset.image;
    const hoverImage = swatch.dataset.hover;
    const available = swatch.dataset.available;

    if (available == "true") {
      this.card.style.opacity = "1";
      this.soldout.style.display = "none";
    } else {
      this.card.style.opacity = "0.5";
      this.soldout.style.display = "block";
    }

    this.cardImage.setAttribute("src", image);
    if (this.cardHoverImage) {
      this.cardHoverImage.setAttribute("src", hoverImage);
    }
  }

  updateTitle(swatch) {
    const title = swatch.dataset.title;

    this.productTitle.innerHTML = title;
  }

  updateLinks(swatch) {
    const url = swatch.dataset.url;

    this.links.forEach((link) => {
      link.setAttribute("href", url);
    });
  }

  updatePrice(swatch) {
    const priceContainer = this.querySelector(".product-card__price-container");
    const currency = swatch.dataset.currency;
    const price = swatch.dataset.price;
    const compareAtPrice = swatch.dataset.comparePrice;

    if (compareAtPrice > price) {
      const priceHTML = `
      <div class="price product-card__price body-small price--on-sale">
        <span class="price-item price-item--regular">
          <span class="money"></span>
        </span>
        <div class="price__sale">
          <span class="visually-hidden visually-hidden--inline">Regular price</span>
          <span>
            <s class="price-item price-item--regular">
              <span class="money">${Shopify.formatMoney(
                compareAtPrice
              )} ${currency}</span>
            </s>
          </span>
          <span class="visually-hidden visually-hidden--inline">Sale price</span>
          <span class="price-item price-item--sale price-item--last">
            <span class="money">${Shopify.formatMoney(price)} ${currency}</span>
          </span>
        </div>
      </div>
      `;

      this.clearElement(priceContainer);
      priceContainer.insertAdjacentHTML("beforeend", priceHTML);
    } else {
      const priceHTML = `
        <div class="price product-card__price body-small">
        <div><div class="price__regular">
            <span class="visually-hidden visually-hidden--inline">Regular price</span>
            <span class="price-item price-item--regular">
              <span class="money">${Shopify.formatMoney(
                price
              )} ${currency}</span>
            </span>
          </div>
          <div class="price__sale">
              <span class="visually-hidden visually-hidden--inline">Regular price</span>
              <span>
                <s class="price-item price-item--regular">
                    <span class="money"></span>
                </s>
              </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
            <span class="price-item price-item--sale price-item--last">
              <span class="money">${Shopify.formatMoney(
                price
              )} ${currency}</span>
            </span>
          </div>
          <small class="unit-price caption hidden">
            <span class="visually-hidden">Unit price</span>
            <span class="price-item price-item--last">
              <span></span>
              <span aria-hidden="true">/</span>
              <span class="visually-hidden">&nbsp;per&nbsp;</span>
              <span>
              </span>
            </span>
          </small>
        </div></div>
      `;

      this.clearElement(priceContainer);
      priceContainer.insertAdjacentHTML("beforeend", priceHTML);
    }
  }

  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

customElements.define("product-card", ProductCard);

/*================ Functions ================*/

/*================ Cookies ================*/
function getCookie(name) {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

/*================ Credits popup ================*/
const creditsButtons = document.querySelectorAll('a[href="#credits"]');
const creditsCloseButtons = document.querySelectorAll(".credits__close");
const credits = document.querySelector(".credits");

creditsButtons.forEach((creditsButton) => {
  creditsButton.addEventListener("click", (event) => {
    event.preventDefault();
    credits.classList.add("is-visible");
  });
});

creditsCloseButtons.forEach((creditsCloseButton) => {
  creditsCloseButton.addEventListener("click", (event) => {
    credits.classList.remove("is-visible");
  });
});

/*================ PDP Size Chart ================*/
const tabs = document.querySelectorAll(".size-chart-dropdown__tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    if (!tab.classList.contains("active")) {
      const chartTab = tab.dataset.tab;

      tab.parentElement.querySelector(".active").classList.remove("active");
      tab.classList.add("active");

      document
        .querySelector(".size-chart-dropdown__chart-wrapper.active")
        .classList.remove("active");
      document
        .querySelector(
          `.size-chart-dropdown__chart-wrapper[data-tab="${chartTab}"]`
        )
        .classList.add("active");
    }
  });
});

/*================ Animations ================*/
gsap.registerPlugin(ScrollTrigger);

(function () {
  const blurProperty = gsap.utils.checkPrefix("filter"),
    blurExp = /blur\((.+)?px\)/,
    getBlurMatch = (target) =>
      (gsap.getProperty(target, blurProperty) || "").match(blurExp) || [];

  gsap.registerPlugin({
    name: "blur",
    get(target) {
      return +getBlurMatch(target)[1] || 0;
    },
    init(target, endValue) {
      let data = this,
        filter = gsap.getProperty(target, blurProperty),
        endBlur = "blur(" + endValue + "px)",
        match = getBlurMatch(target)[0],
        index;
      if (filter === "none") {
        filter = "";
      }
      if (match) {
        index = filter.indexOf(match);
        endValue =
          filter.substr(0, index) +
          endBlur +
          filter.substr(index + match.length);
      } else {
        endValue = filter + endBlur;
        filter += filter ? " blur(0px)" : "blur(0px)";
      }
      data.target = target;
      data.interp = gsap.utils.interpolate(filter, endValue);
    },
    render(progress, data) {
      data.target.style[blurProperty] = data.interp(progress);
    },
  });
})();

// Glow Pulse
gsap.fromTo(
  ".glow",
  {
    scale: 0.5,
  },
  {
    scale: 1.4,
    yoyo: true,
    duration: 3,
    repeat: -1,
    ease: "linear",
  }
);

// Fade In Up
const fadeInUpElems = gsap.utils.toArray(".fade-in-up");
fadeInUpElems.forEach((elem) => {
  gsap.from(elem, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    scrollTrigger: {
      trigger: elem,
      start: "top 80%",
    },
  });
});

/*================ FAQ Component ================*/
const faqs = document.querySelectorAll(".faq__item-question");
faqs.forEach((faq) => {
  faq.addEventListener("click", (event) => {
    const parent = event.currentTarget.parentElement;
    const content = parent.querySelector(".faq__item-answer");

    parent.classList.toggle("active");
    slideToggle(content, 300);
  });
});

/*================ Search ================*/

// $('.header__search.is-visible').parent().parent().find('.')

/*================ Fit guide ================*/

var showFront = document.querySelectorAll(
  `.fit-guide__toggle-desktop .fit-guide__text p[data-id='front']`
);
var showBack = document.querySelectorAll(
  `.fit-guide__toggle-desktop .fit-guide__text p[data-id='back']`
);

showFront.forEach(function (suit) {
  suit.addEventListener("click", (e) => {
    const parent =
      event.currentTarget.parentElement.parentElement.parentElement;
    const front = parent.querySelector(`div[data-id='front']`);
    const back = parent.querySelector(`div[data-id='back']`);
    const blur = event.currentTarget.parentElement.querySelector(".text-blur");
    const blurs =
      event.currentTarget.parentElement.parentElement.querySelectorAll(
        ".text-blur"
      );

    const blurMobile =
      event.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelector(
        `.fit-guide__toggle-mobile .fit-guide__text[data-id='front'] .text-blur`
      );
    const blursMobile =
      event.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
        ".fit-guide__toggle-mobile .text-blur"
      );
    blurs.forEach(function (item) {
      item.style.display = "none";
    });

    blursMobile.forEach(function (item) {
      item.style.display = "none";
    });

    front.style.display = "block";
    back.style.display = "none";
    blur.style.display = "block";
    blurMobile.style.display = "block";
  });
});

showBack.forEach(function (suit) {
  suit.addEventListener("click", (event) => {
    const parent =
      event.currentTarget.parentElement.parentElement.parentElement;
    const front = parent.querySelector(`div[data-id='front']`);
    const back = parent.querySelector(`div[data-id='back']`);
    const blur = event.currentTarget.parentElement.querySelector(".text-blur");
    const blurs =
      event.currentTarget.parentElement.parentElement.querySelectorAll(
        ".text-blur"
      );

    const blurMobile =
      event.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelector(
        `.fit-guide__toggle-mobile .fit-guide__text[data-id='back'] .text-blur`
      );
    const blursMobile =
      event.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
        ".fit-guide__toggle-mobile .text-blur"
      );

    blurs.forEach(function (item) {
      item.style.display = "none";
    });

    blursMobile.forEach(function (item) {
      item.style.display = "none";
    });

    front.style.display = "none";
    back.style.display = "block";
    blur.style.display = "block";
    blurMobile.style.display = "block";
  });
});

var showFrontMobile = document.querySelectorAll(
  `.fit-guide__toggle-mobile .fit-guide__text p[data-id='front']`
);
var showBackMobile = document.querySelectorAll(
  `.fit-guide__toggle-mobile .fit-guide__text p[data-id='back']`
);

showFrontMobile.forEach(function (suit) {
  suit.addEventListener("click", (e) => {
    const parent =
      event.currentTarget.parentElement.parentElement.parentElement;
    const front = parent.querySelector(`div[data-id='front']`);
    const back = parent.querySelector(`div[data-id='back']`);
    const blur = event.currentTarget.parentElement.querySelector(".text-blur");
    const blurs =
      event.currentTarget.parentElement.parentElement.querySelectorAll(
        ".text-blur"
      );

    const blurDesktop =
      event.currentTarget.parentElement.parentElement.parentElement.querySelector(
        `.fit-guide__lifestyle .fit-guide__text[data-id='front'] .text-blur`
      );
    const blursDesktop =
      event.currentTarget.parentElement.parentElement.parentElement.querySelectorAll(
        ".fit-guide__lifestyle .text-blur"
      );
    console.log();
    blurs.forEach(function (item) {
      item.style.display = "none";
    });

    blursDesktop.forEach(function (item) {
      item.style.display = "none";
    });

    front.style.display = "block";
    back.style.display = "none";
    blur.style.display = "block";
    blurDesktop.style.display = "block";
  });
});

showBackMobile.forEach(function (suit) {
  suit.addEventListener("click", (event) => {
    const parent =
      event.currentTarget.parentElement.parentElement.parentElement;
    const front = parent.querySelector(`div[data-id='front']`);
    const back = parent.querySelector(`div[data-id='back']`);
    const blur = event.currentTarget.parentElement.querySelector(".text-blur");
    const blurs =
      event.currentTarget.parentElement.parentElement.querySelectorAll(
        ".text-blur"
      );

    const blurDesktop =
      event.currentTarget.parentElement.parentElement.parentElement.querySelector(
        `.fit-guide__lifestyle .fit-guide__text[data-id='back'] .text-blur`
      );
    const blursDesktop =
      event.currentTarget.parentElement.parentElement.parentElement.querySelectorAll(
        ".fit-guide__lifestyle .text-blur"
      );

    blurs.forEach(function (item) {
      item.style.display = "none";
    });

    blursDesktop.forEach(function (item) {
      item.style.display = "none";
    });

    front.style.display = "none";
    back.style.display = "block";
    blur.style.display = "block";
    blurDesktop.style.display = "block";
  });
});

focusMethod = function getFocus() {
  document.querySelector(".header__search-input").focus();
};

if (!!document.getElementById("checkoutCheckbox")) {
  const checkbox = document.getElementById("checkoutCheckbox");
  checkbox.addEventListener("change", (event) => {
    var checkoutButton = document.getElementById("cart-checkout-button");

    if (event.currentTarget.checked) {
      checkoutButton.classList.remove("inactive");
    } else {
      checkoutButton.classList.add("inactive");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let inputs = document.getElementsByClassName("product-form__input-size");
  let inventory;

  for (var i = 0, l = inputs.length; i < l; ++i) {
    if (inputs[i].checked) {
      inventory = inputs[i].dataset.inventory;
      break;
    }
  }

  if (inventory > 0 && inventory <= 10) {
    if (document.getElementById("almost-sold-out"))
      document.getElementById("almost-sold-out").style.display = "block";
  } else {
    if (document.getElementById("almost-sold-out"))
      document.getElementById("almost-sold-out").style.display = "none";
  }
});
