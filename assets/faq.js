const links = document.querySelectorAll('.faq__navigation-button');
const navHeight = document.querySelector('.header').clientHeight;

// Highlight on scroll
window.addEventListener('scroll', (event) => {
  const fromTop = window.scrollY;

  links.forEach(link => {
    const section = document.querySelector(`.faq__component[data-section="${link.dataset.section}"]`);

    if (section) {
      if ((section.offsetTop - navHeight) <= fromTop && (section.offsetTop - navHeight) + section.clientHeight > fromTop) {
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
    const section = document.querySelector(`.faq__component[data-section="${event.currentTarget.dataset.section}"]`)

    window.scrollTo({
      top: section.offsetTop - navHeight,
      behavior: "smooth"
    });
  });
});