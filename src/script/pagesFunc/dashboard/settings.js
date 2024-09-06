import { loadUserData } from '../../main';
import { menuHeaderTemplate } from './dashboard';
import helpers from '../../utils/helpers';
import setlucideICON from '../../utils/setlucideICON';
import CryptoJS from 'crypto-js';

function settings() {
  const settings = document.querySelector('.dashboard-content_right');
  const uploadImg = settings.querySelector('.upload-img');
  const uploadActions = settings.querySelector('.upload-image_container .actions');
  const menuHeader = document.querySelector('.menu-header');

  const user = loadUserData();
  const { uploadImage, attachPasswordToggle } = helpers();
  let userPic = null;
  settings.firstElementChild.firstElementChild.textContent = 'Settings';


  // UPLOAD IMAGE
  uploadImage(uploadImg, (uploadedPic) => userPic = uploadedPic);

  function loadPicUser() {
    uploadImg.firstElementChild.innerHTML = user.pic === null
      ? '<i data-icon="user" data-size="100%" data-stroke="1"></i>'
      : `<img src='${user.pic}'></img>`;
    setlucideICON();
  }

  loadPicUser();

  // EDIT PICTURE USER
  uploadActions.childNodes[1].addEventListener('click', () => {
    user.pic = userPic;
    menuHeader.firstElementChild.childNodes[1].firstChild.src = user.pic;
    menuHeaderTemplate(menuHeader, user);
    localStorage.setItem('user', JSON.stringify(user));
  });

  // RESET PICTURE
  uploadActions.childNodes[3].addEventListener('click', () => {
    user.pic = null;
    menuHeader.firstElementChild.childNodes[1].firstChild.src = user.pic;
    menuHeaderTemplate(menuHeader, user);
    loadPicUser();
    localStorage.setItem('user', JSON.stringify(user));
  });

  const firstName = document.forms[1].querySelector('#first-name');
  const lastName = document.forms[1].querySelector('#last-name');
  const password = document.forms[1].querySelector('#password');
  const errMess = document.forms[1].querySelector('.err-mess');
  const showPass = document.forms[1].querySelector('.show-pass');

  firstName.value = user.firstName;
  lastName.value = user.lastName;
  let newPass = false;

  password.addEventListener('input', resetPassword);
  password.addEventListener('blur', () => {
    password.classList.remove('err');
    showPass.classList.remove('err');
    errMess.textContent = '';
  });

  attachPasswordToggle(password, showPass);

  function resetPassword() {
    const encryptedPassword = user.password;
    const decryptedPassword = CryptoJS.AES
      .decrypt(encryptedPassword, import.meta.env.VITE_SECRET_KEY)
      .toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password.value) {
      errMess.textContent = 'Please enter your old password';
      password.classList.add('err');
      showPass.classList.add('err');
      newPass = false;
    } else {
      password.placeholder = 'New password';
      password.closest('.custom-input').childNodes[3].textContent = 'New password';
      errMess.textContent = '';
      password.classList.remove('err');
      showPass.classList.remove('err');
      password.value = '';
      password.removeEventListener('input', resetPassword);
      newPass = true;
    }
  }

  // PASSWORD VALIDATION
  function passwordValidation(hasError) {
    if (newPass) {
      if (!password.value) {
        password.classList.add('err');
        showPass.classList.add('err');
        errMess.textContent = 'Please enter new password';
        hasError = true;
      } else if (password.value.length <= 7) {
        password.classList.add('err');
        showPass.classList.add('err');
        errMess.textContent = 'Password must be at least 8 characters';
        hasError = true;
      } else {
        password.classList.remove('err');
        showPass.classList.remove('err');
        errMess.textContent = '';
      }
    }
  }

  // EDIT USER INFO
  document.forms[1].addEventListener('submit', (e) => {
    e.preventDefault();

    // FIRST NAME AND LAST NAME VALIDATION
    const inputs = [firstName, lastName];
    let hasError = false;

    inputs.forEach(input => {
      if (!input.value) {
        input.classList.add('err');
        hasError = true;
      } else {
        input.classList.remove('err');
        errMess.textContent = '';
      }
    });

    // PASSWORD VALIDATION
    passwordValidation(hasError);

    if (hasError) return;

    if (newPass) {
      const encryptedPassword = CryptoJS.AES
        .encrypt(password.value, import.meta.env.VITE_SECRET_KEY)
        .toString();
      user.password = encryptedPassword;
      password.placeholder = 'Old password';
      password.closest('.custom-input').childNodes[3].textContent = 'Old password';
      password.value = '';
      password.addEventListener('input', resetPassword);
      newPass = false;
      setTimeout(() => {
        alert('Password changed successfully');
      }, 500);
    }

    user.firstName = firstName.value;
    user.lastName = lastName.value;

    menuHeaderTemplate(menuHeader, user);
    localStorage.setItem('user', JSON.stringify(user));
  });

  // CUSTOM SETTINGS
  const modeSystem = document.querySelector('.mode-system');

  ![...modeSystem.children].forEach((ele, ind) => {
    const selectMode = modeSystem.firstElementChild;
    ele.addEventListener('click', (e) => {
      if (!(ele.tagName.toLowerCase() === 'button')) return;
      selectMode.style.left = `${e.currentTarget.offsetLeft}px`;
      [...modeSystem.children].forEach((ele) => ele.classList.remove('act'));
      ele.classList.add('act');
    });
  });

  // CHOOSE BACKGROUND FOR DASHBOARD
  const chooseBg = document.querySelector('.choose-bg');
  const bgPath = '../../../assets/backgrounds/';
  const backgrounds = [`${bgPath}bg-1.jpg`, `${bgPath}bg-2.jpg`, `${bgPath}bg-3.jpg`];
  const setting = {
    background: null,
    activeBg: null
  };

  function chooseBgDashboard() {
    chooseBg.innerHTML = '';

    for (let i = 0; i < backgrounds.length; i++) {
      const button = document.createElement('button');
      button.style.background = `url(${backgrounds[i]}) no-repeat center / cover`;
      chooseBg.appendChild(button);

      button.addEventListener('click', (e) => {
        ![...chooseBg.children].forEach((ele) => ele.classList.remove('act'));
        e.target.classList.add('act');
        setting.background = backgrounds[i];
        setting.activeBg = i;
        document.querySelector('.dashboard-page')
          .style.background = `url(${setting.background}) no-repeat center / cover fixed`;
        localStorage.setItem('settings', JSON.stringify(setting));
      });

      const currentBg = JSON.parse(localStorage['settings'] || null)?.activeBg;
      if (i === currentBg) button.classList.add('act');

      document.querySelectorAll
        (`
          :is(
          .header-container header, 
          .dashboard-content_right, 
          .add-stick-wall)
          `)
        .forEach((ele, ind) => {
          if (isNaN(currentBg)) return;
          ele.style.cssText = `
            background-color: #ffffff38 !important; 
            backdrop-filter: blur(15px)
            `;
        });
    }
  }

  chooseBgDashboard();

  // DELETE ACCOUNT
  document.querySelector('.delete-account')
    .addEventListener('click', () => {
      const confirm = window.confirm('Are you sure you want to delete your account?');
      if (!confirm) return;
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    });

  setlucideICON();
}

export default settings;