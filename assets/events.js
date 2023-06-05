const links = document.querySelectorAll('.events-header__navigation-item');
const navHeight = document.querySelector('.header').clientHeight;

// Highlight on scroll
window.addEventListener('scroll', (event) => {
  const fromTop = window.scrollY;

  links.forEach(link => {
    const section = document.querySelector(`.event-block[data-section="${link.dataset.section}"]`);
    const offset = (section.offsetTop - navHeight) - 50;

    if (section) {
      if (offset <= fromTop && offset + section.clientHeight > fromTop) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// Scroll to link
links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const section = document.querySelector(`.event-block[data-section="${event.currentTarget.dataset.section}"]`);
    const offset = (section.offsetTop - navHeight) - 50;

    window.scrollTo({
      top: offset,
      behavior: "smooth"
    });
  });
});