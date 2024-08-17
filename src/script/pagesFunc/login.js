import setlucideICON from '../utils/setlucideICON';
import { router } from '../router';
import attachPasswordToggle from '../utils/attachPasswordToggle';
import { loadUserData, checkAuth } from '../main';
import CryptoJS from 'crypto-js';

export default function init() {
  // PAGE TITLE
  document.head.childNodes[9].textContent = 'TaskSprint | login';

  const loginForm = document.querySelector('form');
  const user = loadUserData();

  function loginFormTemplate() {
    if (loginForm) {
      loginForm.innerHTML = `
      <div class='login-pic'></div>
      <h2>${user.firstName} ${user.lastName}</h3>
      <div>
        <div class='custom-input'>
          <input type='password' placeholder='Password' id='password' />
          <label for="password">Password</label>
          <button class='circle-btn show-pass' type='button'>
            <i data-icon="eye-off"></i>
            <i
              data-icon="eye"
              style="display: none;"
            ></i>
          </button>
        </div>
        <p class='err-mess'></p>
      </div>
      <button class='btn btn-blue'>Login</button>
    `;
    }

    const loginPic = document.querySelector('.login-pic');

    if (!loginPic) return;
    if (user.pic === null) {
      loginPic.innerHTML = `
      <i data-icon='user' data-size='100%' data-stroke='1'></i>
    `;
    } else {
      loginPic.innerHTML = `
      <img src='${user.pic}' alt='${user.firstName}-${user.lastName}' />
    `;
    }
  }

  loginFormTemplate();

  const inputPass = document.getElementById('password');
  const showPass = document.querySelector('.show-pass');

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const errPass = document.querySelector('.err-mess');
    const encryptedPassword = user.password;
    const decryptedPassword = CryptoJS.AES
      .decrypt(encryptedPassword, import.meta.env.VITE_SECRET_KEY)
      .toString(CryptoJS.enc.Utf8);

    if (!inputPass.value) {
      errPass.textContent = 'Please enter password';
      inputPass.classList.add('err');
      showPass.classList.add('err');
    } else if (decryptedPassword !== inputPass.value) {
      errPass.textContent = 'Incorrect password';
      inputPass.classList.add('err');
      showPass.classList.add('err');
    } else {
      errPass.textContent = '';
      inputPass.classList.remove('err');
      showPass.classList.remove('err');
      sessionStorage.setItem('isAuth', 'true');
      checkAuth();
      document.dispatchEvent(new Event('AuthChanged'));
      router('/dashboard');
    }
  });

  attachPasswordToggle(inputPass, showPass);

  setlucideICON();
}; 