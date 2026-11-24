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

const figureDialog = document.querySelector('.figure-dialog');
const figureContent = document.querySelector('#figure-content');
if (typeof figureDialog.showModal === 'function') {
  document.querySelectorAll('[data-figure-title]').forEach((link) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const preview = link.querySelector('img');
      const fullImage = document.createElement('img');
      fullImage.src = link.href;
      fullImage.alt = preview.alt;
      document.querySelector('#figure-title').textContent = link.dataset.figureTitle;
      figureContent.replaceChildren(fullImage);
      figureDialog.showModal();
    });
  });
  document.querySelector('.figure-close').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', (event) => {
    if (event.target !== figureDialog) return;
    const bounds = figureDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
  });
  figureDialog.addEventListener('close', () => figureContent.replaceChildren());
}

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks.map((link) => document.querySelector(link.hash));
let navigationFramePending = false;
function updateCurrentSection() {
  navigationFramePending = false;
  const focusLine = Math.min(innerHeight * .3, 220);
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 3;
  const section = atBottom ? sections.at(-1) : sections.find((item) => {
    const bounds = item.getBoundingClientRect();
    return bounds.top <= focusLine && bounds.bottom > focusLine;
  });
  sectionLinks.forEach((link) => {
    if (section && link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function queueNavigationUpdate() {
  if (navigationFramePending) return;
  navigationFramePending = true;
  requestAnimationFrame(updateCurrentSection);
}
window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
window.addEventListener('resize', queueNavigationUpdate);
updateCurrentSection();
