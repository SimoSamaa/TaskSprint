function helpers() {
  // UPLOAD IMAGE FUNCTION
  function uploadImage(element, cb) {
    element?.addEventListener('click', initiateUpload);

    function initiateUpload() {
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
          alert('file size must be less than 1MB');
          return;
        };

        const render = new FileReader();

        render.onload = () => {
          const img = document.createElement('img');
          img.src = render.result;
          element.firstElementChild.innerHTML = '';
          element.firstElementChild.appendChild(img);

          if (typeof cb === 'function') cb(render.result);
        };

        render.readAsDataURL(file);
      });
    }
  }

  // ATTACH PASSWORD TOGGLE FUNCTION
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

  // FORMAT TASK CONTENT
  function formatTaskContent(textContent) {
    const linkRegex = /((http|https):\/\/[^\s]+)/g;

    textContent = textContent.replace(linkRegex, (match) => {
      const link = match.length > 24 ? match.slice(0, 24) + '...' : match;
      return `<a href="${match}" title='${match}' target='_blank' class="task-link">${link}</a>`;
    });

    return textContent.replace(/\n/g, '<br />');
  }

  return { uploadImage, attachPasswordToggle, formatTaskContent };
}

export default helpers;