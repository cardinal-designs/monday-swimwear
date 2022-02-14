const tabButtons = document.querySelectorAll('.customer-wrapper .btn.tab');
const tabContents = document.querySelectorAll('.customer-wrapper .right-side');

function clearStatus() {
  tabButtons.forEach((btn) => {
    btn.classList.remove('active');
  });

  tabContents.forEach((tab) =>  {
    tab.classList.add('hidden');
  });
}

if (tabButtons.length > 0) {
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      let tabContent = document.getElementById(btn.dataset.section);

      clearStatus();
      btn.classList.add('active');
      tabContent.classList.remove('hidden');
    });
  })
}

const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'a[aria-expanded]',
  cancelAddressButton: 'a[type="reset"]',
  deleteAddressButton: 'a[data-confirm-message]'
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message'
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container ? {
      container,
      addressContainer: container.querySelector(selectors.addressContainer),
      toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
      cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
      deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
      countrySelects: container.querySelectorAll(selectors.addressCountrySelect)
    } : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  _toggleExpanded(target) {
    target.setAttribute(
      attributes.expanded,
      (target.getAttribute(attributes.expanded) === 'false').toString()
    );
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget);
  }

  _handleCancelButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(
      currentTarget
        .closest(selectors.addressContainer)
        .querySelector(`[${attributes.expanded}]`)
    )
  }

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  }
}
