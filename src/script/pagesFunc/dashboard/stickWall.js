import { v4 as uuidv4 } from 'uuid';
import setlucideICON from '../../utils/setlucideICON';

function stickWall() {
  const ul = document.querySelector('ul');
  const form = document.forms[0];
  const maxLength = 400;

  const colors = {
    '#FDF2B3': '#857f5c',
    '#D1EAED': '#708183',
    '#FFDADA': '#996c6c',
    '#FFD4A9': '#a6896c',
    '#b0c4de': '#728193',
    '#d3d3d3': '#746f6f',
    '#ffffe0': '#6b6b48',
    '#a9c08f': '#4c5e39'
  };

  let sticks = localStorage['sticks'] ? JSON.parse(localStorage['sticks']) : [];
  let num = sticks.length > 0 ? sticks.length : 0;
  const media = window.matchMedia('(prefers-color-scheme: light)');
  let preferenceMode = localStorage.getItem('preferenceMode') || (media.matches ? 'light' : 'dark');

  function updateColors() {
    const mode = preferenceMode;
    return Object.fromEntries(
      Object.entries(colors)
        .map(([lightColor, darkColor]) =>
          [lightColor, mode === 'light' ? lightColor : darkColor]
        )
    );
  };

  function applyColors() {
    const currentColors = updateColors();

    sticks.forEach(stick => {
      const li = document.getElementById(stick.id);
      if (li) {
        li.style.backgroundColor = currentColors[stick.color];
        li.style.setProperty('--stick-clr', currentColors[stick.color]);
      }
    });
  }

  applyColors();
  media.addEventListener('change', () => {
    preferenceMode = media.matches ? 'light' : 'dark';
    localStorage.setItem('preferenceMode', preferenceMode);
    applyColors();
  });

  document.querySelectorAll('.mode-system button')
    .forEach((btn, ind) => {
      btn.addEventListener('click', () => {
        [media.matches ? 'light' : 'dark', 'light', 'dark']
          .forEach((mode, i) => {
            if (ind === i) {
              preferenceMode = mode;
              localStorage.setItem('preferenceMode', mode);
            }
          });
        applyColors();
      });
    });

  function formatText(text) {
    const linkRegex = /((http|https):\/\/[^\s]+)/g;
    text = text.replace(linkRegex, (match) => {
      const link = match.length > 43 ? match.slice(0, 43) + '...' : match;
      return `<a href="${match}" target="_blank">${link}</a>`;
    });

    return text;
  }

  function createTaskList(stick) {
    const currentColors = updateColors();
    const li = document.createElement('li');
    const id = stick.id;

    li.id = id;
    li.dataset.index = stick.index;
    li.style.backgroundColor = currentColors[stick.color];
    li.style.setProperty('--stick-clr', currentColors[stick.color]);

    li.innerHTML = `
      <div class='editor' contentEditable='true' maxLength='400'>
        ${formatText(stick.text)}
      </div>
      <button class="delete-stick" type='button'>
        <i data-icon='delete' data-stroke='2'></i>
      </button>
      `;

    li.addEventListener('input', (e) => {
      let val = e.target.innerHTML.trim();

      if (!val || !e.target.querySelector('h1')) {
        e.target.innerHTML = '<h1>your title</h1>' + (val ? val : '');
      }

      function limitTextLength(target, maxLength) {
        if (target.textContent.length > maxLength) {
          target.textContent = target.textContent.substring(0, maxLength);

          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(target.childNodes[0], target.textContent.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      limitTextLength(e.target, maxLength); // DIV
      limitTextLength(e.target.querySelector('h1'), 21); // H1
    });

    li.addEventListener('keydown', (e) => {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Control', 'Meta', 'Shift', 'Alt', 'Home', 'End', 'Tab', 'Escape'
      ];

      const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'x', 'v', 'z']
        .includes(e.key.toLowerCase());

      if (
        e.target.textContent.length >= maxLength &&
        !allowedKeys.includes(e.key) &&
        !isShortcut
      ) e.preventDefault();

      if (e.key === 'Enter' && e.target.childElementCount === 11) {
        e.preventDefault();
      }
    });

    ul?.appendChild(li);
    ul?.classList.add(localStorage['style-stick']);

    setlucideICON();

    li.firstElementChild?.addEventListener('blur', (e) => {
      let val = e.target.innerHTML.trim();
      const currentTask = sticks.find((stick) => stick.id === id);

      if (!e.target.querySelector('h1') || !e.target.querySelector('h1').textContent.trim()) {
        e.target.innerHTML = '<h1>your title</h1>' + (val ? val : '');
      }

      currentTask.text = val;
      localStorage.setItem('sticks', JSON.stringify(sticks));
    });

    li.lastElementChild.addEventListener('click', (e) => {
      e.target.closest('li').remove();
      sticks = sticks.filter((stick) => stick.id !== id);
      localStorage.setItem('sticks', JSON.stringify(sticks));
      if (sticks.length === 0) {
        ul?.classList.remove('center-stick');
        localStorage.removeItem('style-stick');
      }
    });
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const uniqueId = uuidv4();
    const currentColors = updateColors();
    const colorKeys = Object.keys(currentColors);
    const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];

    const stick = {
      id: uniqueId,
      index: num++,
      color: color,
      text: '<h1>your title</h1>'
    };

    createTaskList(stick);
    if (sticks.length > -1) {
      localStorage.setItem('style-stick', 'center-stick');
      ul?.classList.add('center-stick');
    }

    sticks.unshift(stick);
    window.localStorage.setItem('sticks', JSON.stringify(sticks));
    updateTaskElement(sticks);

    const newTaskElement = document.getElementById(stick.id);
    if (newTaskElement) {
      newTaskElement.firstElementChild.focus();
    }
  });

  function updateTaskElement(sticks) {
    const taskItems = ul?.querySelectorAll('li');

    taskItems?.forEach((taskItem) => {
      taskItem.remove();
    });

    sticks.forEach((stick) => {
      createTaskList(stick);
    });
  }

  updateTaskElement(sticks);
}

export default stickWall;
