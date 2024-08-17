import setlucideICON from '../utils/setlucideICON';
import { router } from '../router';
import { loadUserData } from '../main';

export default function init() {
  // PAGE TITLE
  document.head.childNodes[9].textContent = 'TaskSprint | dashboard';

  const menuHeader = document.querySelector('.menu-header');
  const menuActions = document.querySelector('.menu-actions');
  const dashboardPage = document.querySelector('.dashboard-page');

  const user = loadUserData();

  function menuHeaderTemplate() {
    if (menuHeader) {
      menuHeader.firstElementChild.innerHTML = `
      <div class='user-pic'></div>
      <h4>${user.firstName} ${user.lastName}</h4>
    `;

      menuHeader.querySelector('.user-pic')
        .innerHTML =
        user.pic === null
          ? '<i data-icon="user" data-size="100%" data-stroke="1"></i>'
          : `<img src='${user.pic}'></img>`;
    }
  }

  menuHeaderTemplate();

  menuHeader?.lastElementChild.addEventListener('click', () => {
    if (dashboardPage.classList.toggle('act-menu_dashboard')) {
      localStorage.setItem('menu_state', 'false');
    } else {
      localStorage.setItem('menu_state', 'true');
    }
  });

  function loadMenuState() {
    const menuState = JSON.parse(localStorage['menu_state']);

    if (menuState) {
      dashboardPage?.classList.remove('act-menu_dashboard');
    } else {
      dashboardPage?.classList.add('act-menu_dashboard');
    }
  }

  loadMenuState();

  // LOGOUT
  menuActions?.lastElementChild.addEventListener('click', () => {
    sessionStorage.clear();
    router('/login');
  });

  setlucideICON();
}