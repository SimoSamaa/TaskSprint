import '../style/main-style.css';

export function checkSignup() {
  return Boolean(localStorage['user']);
}

export function checkAuth() {
  return Boolean(sessionStorage.getItem('isAuth'));
}

export function loadUserData() {
  if (localStorage.getItem('user')) {
    return JSON.parse(localStorage['user']);
  } else {
    return {};
  }
}
