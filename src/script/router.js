import { checkSignup as isSignup, checkAuth as isAuth } from './main';
import notFound from './pagesFunc/404';

// Listen for the custom event to update the auth status;
document.addEventListener('SignupChanged', () => isSignup);
document.addEventListener('AuthChanged', () => isAuth);

const routeModules = {
  '/': () => import('./pagesFunc/multi-steps-form'),
  '/login': () => import('./pagesFunc/login'),
  '/dashboard': () => import('./pagesFunc/dashboard/dashboard'),
};

const routes = {
  '/': 'pages/index.html',
  '/login': 'pages/login.html',
  '/dashboard': 'pages/dashboard.html',
};

async function loadScriptPages(path) {
  if (routeModules[path]) {
    const module = await routeModules[path]();
    if (module.default) {
      module.default();
    }
  }
}

function route(event) {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  const href = event.target.href;
  if (href === window.location.href) return;
  handleLocation();
}

async function handleLocation() {
  let path = window.location.pathname;
  const route = routes[path] || routes[404];

  // NAVIGATION GUARDS
  if (!isAuth() && !isSignup()) {
    if (path === '/dashboard' || path === '/login') {
      path = '/'; // Redirect to root if not authorized
      window.history.replaceState({}, '', path);
      window.location.href = path;
    }
  } else if (path === '/' && isAuth()) {
    path = '/dashboard'; // Redirect authenticated users to dashboard
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/' && !isAuth() && isSignup()) {
    path = '/login'; // Redirect signed-up users to login
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/dashboard' && !isAuth()) {
    path = '/login'; // Redirect unauthorized users to login
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/login' && isAuth()) {
    path = '/dashboard'; // Redirect authenticated users from login to dashboard
    window.history.replaceState({}, '', path);
    window.location.href = path;
  }

  const previousContent = document.querySelector('.page-content');
  if (previousContent) document.body.removeChild(previousContent);


  try {
    const response = await fetch(route);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    const container = document.createElement('section');
    container.className = 'page-content';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const template = doc.querySelector('template');
    if (template && template.content) {
      container.appendChild(template.content.cloneNode(true));
      document.querySelector('.not-found')?.remove();
      document.getElementById('not-found-css')?.remove();
    } else {
      // LOAD NOT FOUND PAGE IF ROUTE NOT FOUND 404
      notFound(() => router('/'));
    }

    document.body.appendChild(container);

    await loadScriptPages(path);
  } catch (err) {
    console.error('Failed to load route:', err);
  }

  targetCurrentLink();
}

function targetCurrentLink() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    link.removeEventListener('click', route);
    link.addEventListener('click', route);
  });
}

export const router = (path) => {
  window.history.pushState({}, '', path);
  handleLocation();
};

window.onpopstate = handleLocation;
window.route = route;
handleLocation();