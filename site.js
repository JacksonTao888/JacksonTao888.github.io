const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.querySelector('img').src = 'assets/menu.svg';
  if (returnFocus) menuButton.focus();
}

menuButton.hidden = false;
header.classList.add('menu-ready');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
    return;
  }
  navigation.classList.add('is-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation');
  menuButton.querySelector('img').src = 'assets/x.svg';
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());

const filters = document.querySelectorAll('[data-filter]');
const publications = [...document.querySelectorAll('.publication[data-kind]')];
const count = document.querySelector('#publication-count');
document.querySelector('.publication-toolbar').hidden = false;
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    publications.forEach((publication) => {
      publication.hidden = selected !== 'all' && publication.dataset.kind !== selected;
    });
    const visibleCount = publications.filter((publication) => !publication.hidden).length;
    count.textContent = `${visibleCount} publication${visibleCount === 1 ? '' : 's'}`;
  });
});
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
