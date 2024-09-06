import setlucideICON from '../../utils/setlucideICON';
import { router } from '../../router';
import { loadUserData } from '../../main';
import stickWall from './stickWall';
import settings from './settings';

export function menuHeaderTemplate(menuHeader, user) {
  if (menuHeader) {
    menuHeader.firstElementChild.innerHTML = `
    <div class='user-pic'></div>
    <h4>${user.firstName} ${user.lastName}</h4>
  `;

    menuHeader.querySelector('.user-pic')
      .innerHTML =
      user.pic === null
        ?
        '<i data-icon="user" data-size="100%" data-stroke="1"></i>'
        : `<img src='${user.pic}'></img>`;
  }

  setlucideICON();
}

export default function init() {
  // PAGE TITLE
  document.head.childNodes[9].textContent = 'TaskSprint | dashboard';

  const menuHeader = document.querySelector('.menu-header');
  const menuActions = document.querySelector('.menu-actions');
  const dashboardPage = document.querySelector('.dashboard-page');

  const user = loadUserData();

  menuHeaderTemplate(menuHeader, user);

  menuHeader?.lastElementChild.addEventListener('click', () => {
    if (dashboardPage.classList.toggle('act-menu_dashboard')) {
      localStorage.setItem('menu_state', 'false');
      dashboardPage?.classList.remove('act-content_dashboard-right');
    } else {
      localStorage.setItem('menu_state', 'true');
    }
  });

  function loadMenuState() {
    if (!localStorage['menu_state']) return;
    const menuState = JSON.parse(localStorage['menu_state']);

    if (menuState) {
      dashboardPage?.classList.remove('act-menu_dashboard');
    } else {
      dashboardPage?.classList.add('act-menu_dashboard');
    }
  }

  loadMenuState();

  // OPEN DASHBOARD CONTENT RIGHT
  menuActions?.firstElementChild.addEventListener('click', () => {
    dashboardPage?.classList.add('act-content_dashboard-right');
    settings();
  });

  document.querySelector('.content_right-close')
    ?.addEventListener('click', () => {
      dashboardPage?.classList.remove('act-content_dashboard-right');
    });

  // LOGOUT
  menuActions?.lastElementChild.addEventListener('click', () => {
    const logoutConfirm = confirm('Are you sure you want to logout?');
    if (!logoutConfirm) return;
    sessionStorage.clear();
    router('/login');
  });

  // STICK WALL PAGE
  stickWall();

  // LOAD DASHBOARD BACKGROUND
  function loadBackground() {
    if (!(dashboardPage instanceof HTMLElement)) return;
    if (!localStorage.getItem('settings')) return;
    const settings = JSON.parse(localStorage['settings']);
    dashboardPage.style.background = `url(${settings.background}) no-repeat center / cover fixed`;
  }

  loadBackground();

  setlucideICON();
}