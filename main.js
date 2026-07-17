const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const drawer = document.querySelector('#mobileSidebar');
const overlay = document.querySelector('#mobileOverlay');
const openButton = document.querySelector('#openSidebar');
const closeButton = document.querySelector('#closeSidebar');
let previousFocus = null;

document.querySelectorAll('.section-title').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (!panel) return;

    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    button.closest('.collapsible')?.classList.toggle('section-collapsed', expanded);
  });
});

const desktopNavigationLinks = [...document.querySelectorAll('.top-menu .nav-link')];
const mobileNavigationLinks = [...document.querySelectorAll('.mobile-nav a')];
const navigationLinks = [...desktopNavigationLinks, ...mobileNavigationLinks];

function setCurrentNavigation(hash) {
  navigationLinks.forEach((link) => {
    const current = link.getAttribute('href') === hash;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', hash);
    setCurrentNavigation(hash);

    if (drawer?.classList.contains('active')) setDrawer(false, false);
  });
});

function setDrawer(open, restoreFocus = true) {
  if (!drawer || !overlay || !openButton || !closeButton) return;

  drawer.classList.toggle('active', open);
  overlay.classList.toggle('active', open);
  drawer.setAttribute('aria-hidden', String(!open));
  openButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('drawer-open', open);

  if (open) {
    previousFocus = document.activeElement;
    closeButton.focus();
  } else if (restoreFocus && previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }
}

openButton?.addEventListener('click', () => setDrawer(true));
closeButton?.addEventListener('click', () => setDrawer(false));
overlay?.addEventListener('click', () => setDrawer(false));

document.addEventListener('keydown', (event) => {
  if (!drawer?.classList.contains('active')) return;

  if (event.key === 'Escape') {
    setDrawer(false);
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled])')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const observedSections = [...document.querySelectorAll('main > section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setCurrentNavigation(`#${visible.target.id}`);
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .25, .5] });

observedSections.forEach((section) => sectionObserver.observe(section));

function updateHomeNavigation() {
  if (window.scrollY < 80) setCurrentNavigation('#top');
}

window.addEventListener('scroll', updateHomeNavigation, { passive: true });
updateHomeNavigation();

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = image.dataset.fallback;
  });
});
