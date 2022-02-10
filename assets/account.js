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
