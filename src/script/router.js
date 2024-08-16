import { checkSignup as isSignup, checkAuth as isAuth } from './main';

// Listen for the custom event to update the auth status;
document.addEventListener('SignupChanged', () => {
  console.log('signup:', isSignup());
});
console.log('signup-2:', isSignup());

document.addEventListener('AuthChanged', () => {
  console.log('isAuth:', isAuth());
});
console.log('isAuth-2:', isAuth());


const routeModules = {
  '/': () => import('./pagesFunc/multi-steps-form'),
  '/login': () => import('./pagesFunc/login'),
};

const routes = {
  404: 'pages/NotFound.html',
  '/': 'pages/index.html',
  '/dashboard': 'pages/dashboard.html',
  '/login': 'pages/login.html',
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
let a = false;
async function handleLocation() {
  let path = window.location.pathname;
  const route = routes[path] || routes[404];

  // if (path === '/' && isAuth()) {
  //   path = '/login';
  //   window.history.replaceState({}, '', path);
  // } else if (path === '/login' && !isAuth()) {
  //   path = '/';
  //   window.history.replaceState({}, '', path);
  // } else if (path === '/login' && a) {
  //   path = '/dashboard';
  //   window.history.replaceState({}, '', path);
  // }

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