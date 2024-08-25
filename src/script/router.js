import { checkSignup as isSignup, checkAuth as isAuth } from './main';

// Listen for the custom event to update the auth status;
document.addEventListener('SignupChanged', () => isSignup);
document.addEventListener('AuthChanged', () => isAuth);

const routeModules = {
  '/': () => import('./pagesFunc/multi-steps-form'),
  '/login': () => import('./pagesFunc/login'),
  '/dashboard': () => import('./pagesFunc/dashboard/dashboard'),
  '/NotFound': () => import('./pagesFunc/NotFound'),
};

const routes = {
  404: 'pages/NotFound.html',
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
    // Protect both dashboard and login routes for users who are neither authenticated nor signed up
    if (path === '/dashboard' || path === '/login') {
      path = '/'; // Redirect to root or any other route as needed
      window.history.replaceState({}, '', path);
      window.location.href = path;
    }
  } else if (path === '/' && isAuth()) {
    // Redirect authenticated users from root to dashboard
    path = '/dashboard';
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/' && !isAuth() && isSignup()) {
    // Redirect unauthenticated users who have signed up to login
    path = '/login';
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/dashboard' && !isAuth()) {
    // Protect the dashboard route for unauthorized users
    path = '/login';
    window.history.replaceState({}, '', path);
    window.location.href = path;
  } else if (path === '/login' && isAuth()) {
    // Redirect authenticated users from login to dashboard
    path = '/dashboard';
    window.history.replaceState({}, '', path);
    window.location.href = path;
  }

  const previousContent = document.querySelector('.page-content');
  if (previousContent) {
    document.body.removeChild(previousContent);
  }

  try {
    const response = await fetch(route);
    const html = await response.text();

    const container = document.createElement('section');
    container.className = 'page-content';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const template = doc.head.lastElementChild.content.cloneNode(true);
    container.appendChild(template);

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