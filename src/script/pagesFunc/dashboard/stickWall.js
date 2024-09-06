import { v4 as uuidv4 } from 'uuid';
import setlucideICON from '../../utils/setlucideICON';

function stickWall() {
  const ul = document.querySelector('ul');
  const form = document.forms[0];
  const maxLength = 400;
  const colors = ['#FDF2B3', '#D1EAED', '#FFDADA', '#FFD4A9', '#b0c4de', '#d3d3d3', '#ffffe0', '#b0c4de'];

  function formatText(text) {
    const linkRegex = /((http|https):\/\/[^\s]+)/g;
    text = text.replace(linkRegex, (match) => {
      const link = match.length > 43 ? match.slice(0, 43) + '...' : match;
      return `<a href="${match}" target="_blank">${link}</a>`;
    });

    return text;
  }

  let sticks = localStorage['sticks'] ? JSON.parse(localStorage['sticks']) : [];
  let num = sticks.length > 0 ? sticks.length : 0;

  function createTaskList(stick) {
    // CREATE STICK
    const li = document.createElement('li');
    const id = stick.id;

    li.id = id;
    li.dataset.index = stick.index;
    li.style.backgroundColor = stick.color;
    li.style.setProperty('--stick-clr', stick.color);

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

      if (!val || !e.target.firstElementChild) {
        val = stick.text;
        e.target.innerHTML = val;
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
      limitTextLength(e.target.firstElementChild, 21); // H1
    });

    li.addEventListener('keydown', (e) => {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Control', 'Meta', 'Shift', 'Alt', 'Home', 'End', 'Tab', 'Escape'
      ];

      // Check for Ctrl/Cmd key combinations like Ctrl + A, Ctrl + C, Ctrl + X, etc.
      const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'x', 'v', 'z']
        .includes(e.key.toLowerCase());

      if (
        e.target.textContent.length >= maxLength &&
        !allowedKeys.includes(e.key) &&
        !isShortcut
      ) e.preventDefault();

      // PREVENT NEW LINE IF TEXT LENGTH IS GREATER THAN 400 
      if (e.key === 'Enter' && e.target.childElementCount === 11) {
        e.preventDefault();
      }
    });

    ul?.appendChild(li);
    ul?.classList.add(localStorage['style-stick']);

    setlucideICON();

    // EDIT STICK
    li.firstElementChild?.addEventListener('blur', (e) => {
      let val = e.target.innerHTML.trim(); // Save the innerHTML to preserve formatting
      const currentTask = sticks.find((stick) => stick.id === id);

      if (!e.target.firstElementChild.textContent) {
        e.target.innerHTML = '<h1>your title</h1>';
      }

      currentTask.text = val;
      localStorage.setItem('sticks', JSON.stringify(sticks));
    });

    // DELETE STICK
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
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const stick = {
      id: uniqueId,
      index: num++,
      color: randomColor,
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

  document.onload = updateTaskElement(sticks);
}

export default stickWall;