import setlucideICON from '../../utils/setlucideICON';
import { router } from '../../router';
import { loadUserData } from '../../main';
import stickWall from './stickWall';
import todoList from './todoList';
import settings from './settings';
import { applyBlurEffect, menuHeaderTemplate } from './dashboardHelpers';

export default function init() {
  // PAGE TITLE
  document.head.childNodes[9].textContent = 'TaskSprint | dashboard';

  const menuHeader = document.querySelector('.menu-header');
  const menuActions = document.querySelector('.menu-actions');
  const dashboardPage = document.querySelector('.dashboard-page');
  const dashboardTitle = document.querySelectorAll('.dashboard-title-page');
  const navBtn = document.querySelector('.icon-btn');

  const user = loadUserData();

  menuHeaderTemplate(menuHeader, user);

  document.querySelectorAll('.menu-list button').forEach((btn, btnInd, arr) => {
    btn.addEventListener('click', () => {
      arr.forEach(btn => btn.classList.remove('active-sec'));
      btn.classList.add('active-sec');

      document.querySelectorAll('.main').forEach((ele) => {
        ele.classList.remove('active-tab');
        if (ele.classList.item(0) === btn.dataset.tab)
          ele.classList.add('active-tab');
      });
    });
  });

  menuHeader?.lastElementChild.addEventListener('click', () => {
    if (dashboardPage.classList.toggle('act-menu_dashboard')) {
      localStorage.setItem('menu_state', 'false');
      dashboardPage?.classList.remove('act-content_dashboard-right');
      toggleCheckBlur();
    } else {
      localStorage.setItem('menu_state', 'true');
    }

    applyBlurEffect();
  });

  function addClass() {
    dashboardTitle?.forEach(title => title.classList.add('toggle-class'));
    navBtn?.classList.add('toggle-class');
  }

  function removeClass() {
    dashboardTitle?.forEach(title => title.classList.remove('toggle-class'));
    navBtn?.classList.remove('toggle-class');
  }
  function toggleClass() {
    JSON.parse(localStorage['settings'])?.background ? addClass() : removeClass();
  }

  document.addEventListener('backgroundChanged', () => {
    toggleClass();
    toggleCheckBlur();
  });

  function toggleCheckBlur() {
    if (!localStorage.getItem('settings')) return;
    if (JSON.parse(localStorage['settings']).background) {
      dashboardPage?.firstElementChild.firstElementChild.classList.add('check-blur');
    } else {
      dashboardPage?.firstElementChild.firstElementChild.classList.remove('check-blur');
    }
  }

  toggleCheckBlur();

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


  stickWall(); // STICK WALL PAGE
  todoList(); // TODO LIST PAGE

  // LOAD DASHBOARD BACKGROUND
  function loadBackground() {
    if (!(dashboardPage instanceof HTMLElement)) return;
    if (!localStorage.getItem('settings')) return;
    const settings = JSON.parse(localStorage['settings']);
    dashboardPage.style.background = `url(${settings?.background}) no-repeat center / cover fixed`;
    if (settings?.background) toggleClass();
  }

  loadBackground();
  applyBlurEffect();

  setlucideICON();
}