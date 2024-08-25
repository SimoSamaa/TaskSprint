import { v4 as uuidv4 } from 'uuid';
import setlucideICON from '../../utils/setlucideICON';

function stickWall() {
  const ul = document.querySelector('ul');
  const form = document.forms[0];
  const colors = ['#FDF2B3', '#D1EAED', '#FFDADA', '#FFD4A9'];

  let sticks = localStorage['sticks'] ? JSON.parse(localStorage['sticks']) : [];
  let num = sticks.length > 0 ? sticks.length : 0;

  function createTaskList(stick) {
    // CREATE STICK
    const li = document.createElement('li');
    const id = stick.id;

    li.setAttribute('data-placeholder', 'Enter a stick');
    li.id = id;
    li.tabIndex = 0;
    li.draggable = true;
    li.dataset.index = stick.index;
    li.style.backgroundColor = stick.color;

    li.innerHTML = `
      <button class="delete-stick" type='button'>
        <i data-icon="delete" data-stroke='2'></i>
      </button>
      <div class='editor' contentEditable='true'>${stick.text === null ? '' : stick.text}<div>
      `;

    ul?.appendChild(li);
    setlucideICON();

    // EDIT STICK
    li.childNodes[3]?.addEventListener('blur', (e) => {
      const val = e.target.textContent;
      const currentTask = sticks.find((stick) => stick.id === id);

      currentTask.text = val;
      localStorage.setItem('sticks', JSON.stringify(sticks));
    });

    // DELETE STICK
    li.childNodes[1].addEventListener('click', (e) => {
      e.target.closest('li').remove();
      sticks = sticks.filter((stick) => stick.id !== id);
      localStorage.setItem('sticks', JSON.stringify(sticks));
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
      text: '',
    };

    createTaskList(stick);

    sticks.unshift(stick);
    window.localStorage.setItem('sticks', JSON.stringify(sticks));
    updateTaskElement(sticks);

    const newTaskElement = document.getElementById(stick.id);
    if (newTaskElement) {
      newTaskElement.lastElementChild.focus();
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