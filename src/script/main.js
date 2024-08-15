import '../style/main-style.css';

let isAuth = false;

export function checkAuth() {
  isAuth = Boolean(localStorage.getItem('user'));
  return isAuth;
}
