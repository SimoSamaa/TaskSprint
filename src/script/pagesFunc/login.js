import setlucideICON from '../utils/setlucideICON';

export default function init() {
  console.log('Login page loaded');

  const loginForm = document.forms[0];

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  loginForm.innerHTML = `
    <div class=''>

    </div>
    <h3>${1}</h3>
    <i data-icon='user'></i>
    <input type='password' placeholder='Password' id='password' />
    
  `;

  setlucideICON();
}