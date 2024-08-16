import setlucideICON from '../utils/setlucideICON';
import attachPasswordToggle from '../utils/attachPasswordToggle';
import { router } from '../router';
import { checkSignup } from '../main';
import CryptoJS from 'crypto-js';

export default function init() {
  const multiSteps = document.querySelectorAll('.steps .step');
  const currentStepNum = document.querySelectorAll('.current-step span');
  const currentStepEl = document.querySelector('.current-step');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const password = document.getElementById('password');
  const confirmPass = document.getElementById('confirm-password');
  const showPass = document.querySelector('.show-pass');
  const uploadImg = document.querySelector('.upload-img');

  let currentStep = 0;
  let userPic = null;

  document.forms[0]?.addEventListener('submit', (e) => {
    e.preventDefault();

    const encryptedPassword = CryptoJS.AES.encrypt(confirmPass.value, 'your-secret-key').toString();

    const user = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      password: encryptedPassword,
      pic: userPic
    };

    // SAVE DATA TO LOCALE STORAGE
    localStorage.setItem('user', JSON.stringify(user));
    document.dispatchEvent(new Event('SignupChanged'));
    checkSignup();
  });

  const updateSteps = () => {
    multiSteps.forEach((step) => {
      step.classList.remove('act-step');
      multiSteps[currentStep].classList.add('act-step');
    });

    currentStepNum[currentStep]?.classList.add('act-step_num');

    document.documentElement.style.setProperty('--progress-step', `${currentStep * 50}%`);
    if (prev) prev.style.display = currentStep === 0 ? 'none' : 'flex';
    if (next) next.textContent = currentStep === 2 ? 'Submit' : 'Next';
  };

  const prevStep = () => {
    if (currentStep === 0) return;
    currentStep--;
    updateSteps();
  };

  const nextStep = () => {
    if (currentStep === 2) {
      next.type = 'submit';
      currentStepEl.style.opacity = '0';
      next.closest('.actions').style.visibility = 'hidden';
      uploadImg.remove();
      multiSteps[2].innerHTML = `
        <div class='start-app'>
          <img src="../../assets/logo-2.png"></img>
          <h2>Thank you for signing up! please click in the button below to start your application</h2>
          <button class='btn btn-blue get-start-app' type='button'>Get started</button>
        </div>
      `;

      // START APPLICATION
      document.querySelector('.get-start-app')
        .addEventListener('click', () => {
          router('/login');
        });

      return;
    }

    if (!(currentStep < multiSteps.length - 1)) return;
    if (!validationInputMess()) return;

    currentStep++;
    updateSteps();
  };

  prev?.addEventListener('click', prevStep);
  next?.addEventListener('click', nextStep);
  updateSteps();

  // VALIDATION ERROR INPUT AND DISPLAY MESSAGE
  function validationInputMess() {
    let isValid = true;

    document.querySelectorAll('.err-mess')
      .forEach((messEl, ind) => {
        const messErr = 'name is required';

        // FIRST NAME VALIDATION
        if (ind === 0) {
          if (!firstName.value) {
            messEl.textContent = `first ${messErr}`;
            firstName.classList.add('err');
            isValid = false;
          } else {
            messEl.textContent = '';
            firstName.classList.remove('err');
          }
        }

        // LAST NAME VALIDATION
        if (ind === 1) {
          if (!lastName.value) {
            messEl.textContent = `last ${messErr}`;
            lastName.classList.add('err');
            isValid = false;
          } else {
            messEl.textContent = '';
            lastName.classList.remove('err');
          }
        }

        // STEP 2 PASSWORD VALIDATION
        if (currentStep === 1) {
          // VALIDATION PASSWORD
          if (ind === 2) {
            if (!password.value) {
              messEl.textContent = `password ${messErr}`;
              password.classList.add('err');
              showPass.classList.add('err');
              isValid = false;
            } else if (password.value.length <= 7) {
              messEl.textContent = `password must not be exactly 8 characters`;
              password.classList.add('err');
              showPass.classList.add('err');
              isValid = false;
            } else {
              messEl.textContent = '';
              password.classList.remove('err');
              showPass.classList.remove('err');
            }
          }

          // VALIDATION CONFIRM PASSWORD
          if (ind === 3) {
            if (password.value !== confirmPass.value) {
              messEl.textContent = `password do not match`;
              confirmPass.classList.add('err');
              isValid = false;
            }

            confirmPass.addEventListener('input', () => {
              if (password.value === confirmPass.value) {
                messEl.textContent = '';
                confirmPass.classList.remove('err');
              }
            });
          }
        }
      });

    return isValid;
  };

  // UPLOAD IMAGE
  uploadImg?.addEventListener('click', uploadImage);
  function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg';
    input.click();

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('file must be an image form png, jpeg, jpg');
        return;
      };

      if (file.size > 1024 * 1024 * 1) {
        alert('file size must be less than 1mb');
        return;
      };

      const render = new FileReader();

      render.onload = () => {
        const img = document.createElement('img');
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        img.src = render.result;
        userPic = render.result;
        uploadImg.innerHTML = '';
        uploadImg.appendChild(img);
      };

      render.readAsDataURL(file);
    });
  }

  attachPasswordToggle(password, showPass);

  setlucideICON();
};