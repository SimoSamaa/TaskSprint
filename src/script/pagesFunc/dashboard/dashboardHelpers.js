import setlucideICON from '../../utils/setlucideICON';

function applyBlurEffect(cb) {
  document.querySelectorAll
    (`
    :is(
    .header-container header, 
    .dashboard-content_right, 
    .add-stick-wall
    )
  `)
    .forEach((ele, ind) => {
      if (localStorage.getItem('settings')) {
        if ((JSON.parse(localStorage['settings']).background === null)) return;
        ele.classList.add('bg-blur');

        if (localStorage.getItem('menu_state')) {
          if (!JSON.parse(localStorage['menu_state']) && ind === 0) {
            ele.classList.remove('bg-blur');
          }
        }

        if (typeof cb === 'function') cb && cb(ele);
      }
    });
}

function menuHeaderTemplate(menuHeader, user) {
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

export { applyBlurEffect, menuHeaderTemplate };