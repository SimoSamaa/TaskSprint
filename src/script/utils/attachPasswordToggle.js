function attachPasswordToggle(passInput, ele) {
  ele?.addEventListener('click', togglePasswordVisibility);

  function togglePasswordVisibility() {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      ele.firstElementChild.style.display = 'none';
      ele.lastElementChild.style.display = 'block';
    } else {
      passInput.type = 'password';
      ele.firstElementChild.style.display = 'block';
      ele.lastElementChild.style.display = 'none';
    }
  }
}

export default attachPasswordToggle;