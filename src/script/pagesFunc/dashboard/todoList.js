import setlucideICON from '../../utils/setlucideICON';
import helpers from '../../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

export default function todoList() {
  const addTaskForm = document.forms[1];
  const addTskInput = addTaskForm?.children[0].firstElementChild;
  const taskCategory = addTaskForm?.children[1].firstElementChild.firstElementChild;
  const filter = document.querySelector('.filter-delete .select-container select');
  const deleteAllTasks = document.querySelector('.filter-delete button');
  const tasksDropZoon = document.querySelectorAll('.todo-list-container div ul');

  let categories = {
    all: true,
    personal: true,
    home: true,
    work: true,
    entertainment: true,
  };

  let tasks = localStorage['tasks'] ? JSON.parse(localStorage['tasks']) : [];
  const selectedCategory = Object.keys(categories);
  const { formatTaskContent } = helpers();

  toggleTaskFilterState();
  function toggleTaskFilterState() {
    if (!(filter instanceof HTMLSelectElement)) return;
    filter.disabled = tasks.length === 0 ? true : false;
  }

  // COUNTER MAX LENGTH FOR ADD TASK
  addTskInput?.addEventListener('input', taskInputCharCounter);
  function taskInputCharCounter(e) {
    const taskInputLen = e.target.value.length;
    document.querySelector('.textarea-char-count').textContent = `${taskInputLen}/400`;
  }

  // FILTER TASK CATEGORY
  filter?.addEventListener('change', (e) => {
    const category = e.target.value.toLowerCase();

    if (category === 'all') {
      for (const key in categories) {
        categories[key] = true;
      }
    } else {
      ![...e.target.options].forEach((option) => {
        categories = {
          all: true,
          ...categories,
          [option.value.toLowerCase()]: option.selected
        };
      });
    }

    renderTasks(tasks);
  });

  addTaskForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!addTskInput.value.trim()) {
      alert('Please enter a task');
      return;
    } else if (!selectedCategory.includes(taskCategory.value.toLowerCase())) {
      alert('Please select a category');
      return;
    };

    const task = {
      id: uuidv4(),
      index: tasks.length,
      content: formatTaskContent(addTskInput.value),
      category: taskCategory.value.toLowerCase(),
      date: new Date().toLocaleDateString(),
      taskProgress: 'todo',
    };

    addTskInput.value = '';
    taskInputCharCounter({ target: { value: '' } });
    taskCategory.value = 'pick category';

    tasks.unshift(task);
    renderTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    toggleTaskFilterState();
  });

  function countLines(ele) {
    const lineHeight = parseInt(getComputedStyle(ele).lineHeight);
    const totalHeight = ele.scrollHeight;
    const lineCount = Math.floor(totalHeight / lineHeight);
    return lineCount;
  };

  function checkBtnShowAll(taskEditor, taskEle) {
    const counterLine = tasks.find((task) => task.id === taskEle.id).counterLine;
    const editorCounterLine = countLines(taskEditor) === 1 ? counterLine : countLines(taskEditor);

    if (
      editorCounterLine >= 6 &&
      taskEditor.textContent.length >= 85
    ) {
      taskEle.children[2].children[1].style.display = 'block';
      taskEle.children[2].children[1].addEventListener('click', (e) => {
        taskEditor.classList.toggle('show-all')
          ? e.target.textContent = 'Show less'
          : e.target.textContent = 'Show all';
      });
    } else {
      taskEle.children[2].children[1].style.display = 'none';
    }

    return editorCounterLine;
  }

  // DISPLAY NO TASKS MESSAGE
  function displayNoTasksMess() {
    tasksDropZoon.forEach((dropZone, ind) => {
      const tasksEle = [...dropZone.children];
      const tasksProgress = ['todo', 'doing', 'done'];
      dropZone.closest('div').children[2].textContent =
        tasksEle.length === 0 || tasks.length === 0
          ? `not task in ${tasksProgress[ind]}` : '';
    });
  }

  // UPDATE TASK ORDER AND PROGRESS AND SAVE TO LOCAL STORAGE
  function updateTaskOrder() {
    const updatedTasks = [];

    tasksDropZoon.forEach((dropZone) => {
      const taskSection = dropZone.classList.contains('todo') ? 'todo'
        : dropZone.classList.contains('doing') ? 'doing'
          : 'done';

      Array.from(dropZone.querySelectorAll('li')).forEach((taskEle, ind) => {
        const taskId = taskEle.id;
        const task = tasks.find((task) => task.id.toString() === taskId.toString());
        task.index = ind;
        task.taskProgress = taskSection; // Update task progress (todo, doing, done)
        updatedTasks.push(task);
      });
    });

    tasks = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // DISPLAY TASKS
  function renderTasks(tasks) {
    tasksDropZoon.forEach((dropZone) => { dropZone.innerHTML = ''; });

    displayNoTasksMess();

    tasks
      .filter((task) => categories[task.category])
      .forEach((task) => {
        const taskEle = document.createElement('li');
        taskEle.id = task.id;
        taskEle.dataset.index = task.index;
        taskEle.contentEditable = false;
        taskEle.draggable = true;

        taskEle.innerHTML = `
        <div class='task-header'>
          <h3>${task.category}</h3>
          <div class='actions'>
            <button title='edit'><i data-icon='edit' data-size='16px'></i></button>
            <button title='delete'><i data-icon='delete' data-size='16px'></i></button>
          </div>
        </div>
        <p class='content'>${task.content}</p>
        <div class='info'>
          <p></p>
          <button>Show all</button>
          <p class='date'>${task.date}</p>
        </div>
      `;

        const editBtn = taskEle.querySelector('.task-header button:first-child');
        const deleteBtn = taskEle.querySelector('.task-header button:last-child');
        const taskEditor = taskEle.children[1];

        ['todo', 'doing', 'done'].forEach((taskProgress, ind) => {
          if (task.taskProgress === taskProgress) {
            tasksDropZoon[ind]?.appendChild(taskEle);
            setlucideICON();
            checkBtnShowAll(taskEditor, taskEle);
          }
        });

        displayNoTasksMess();

        deleteBtn.addEventListener('click', (e) => deleteTask(e, task));
        editBtn.addEventListener('click', (e) => editTask(e, task));

        taskEditor.addEventListener('input', (e) => {
          // COUNTER MAX LENGTH FOR EDIT TASK
          const taskContentCharCount = taskEle.querySelector('.info p:first-child');
          taskContentCharCount.textContent = `${e.target.textContent.length}/400`;

          // LIMIT EDIT TASK CONTENT TO 400 CHARACTERS;
          if (e.target.textContent.length >= 400) {
            e.target.contentEditable = false;
            e.target.textContent = e.target.textContent.slice(0, 400);
          }
        });

        taskEditor.addEventListener('focus', (e) => {
          const range = document.createRange();
          const selection = window.getSelection();

          e.target.childNodes.forEach((node) => {
            range.collapse(true);

            if (node.nodeType === Node.TEXT_NODE) {
              range.setStart(node, node.length);
            }

            if (node.tagName === 'A') {
              range.setStart(node.firstChild, node.firstChild.length);
            }
          });

          selection.removeAllRanges();
          selection.addRange(range);

          if (e.target.textContent === 'Type something...') {
            e.target.innerHTML = '';
          }
        });

        // START DRAGGING TASK
        taskEle.addEventListener('dragstart', (e) => {
          e.target.classList.add('is-dragging');
        });

        // END DRAGGING TASK
        taskEle.addEventListener('dragend', (e) => {
          e.target.classList.remove('is-dragging');
          updateTaskOrder();
        });

        // DROP TASK
        tasksDropZoon.forEach((dropZone) => {
          dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();

            const draggingItem = document.querySelector('.is-dragging');
            const afterElement = insertAboveTask(dropZone, e.clientY);

            if (!afterElement) {
              dropZone.appendChild(draggingItem);
            } else {
              dropZone.insertBefore(draggingItem, afterElement);
            }

            displayNoTasksMess();
          });
        });
      });
  }

  // Insert task in the correct position
  function insertAboveTask(container, y) {
    let draggableElements = Array.from(container.querySelectorAll('li:not(.is-dragging)'));

    return draggableElements.find((element) => {
      const { top, bottom } = element.getBoundingClientRect();
      const offset = y - (top + bottom) / 2;
      return offset < 0;
    });
  }

  renderTasks(tasks);

  // DELETE TASK
  function deleteTask(e, task) {
    e.target.closest('li').remove();
    tasks = tasks.filter((t) => t.id !== task.id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
    toggleTaskFilterState();
  }

  // EDIT TASK
  function editTask(e, task) {
    const taskLi = e.target.closest('li');
    const taskContent = taskLi.querySelector('.content');

    taskLi.draggable = false;
    taskContent.contentEditable = true;
    taskContent.focus();
    taskContent.classList.add('show-all');
    taskLi.children[2].children[1].style.display = 'none';

    taskContent.addEventListener('keydown', handleKeyDown);
    taskContent.addEventListener('blur', handleBlur.bind(task));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const brCount = [...e.target.querySelectorAll('br')].length;
      if (brCount >= 24) return;
      document.execCommand('insertLineBreak');
    }
  };

  function handleBlur() {
    const taskEle = document.getElementById(this.id);
    const taskContent = taskEle.children[1];
    const taskCounterLen = taskEle.children[2].firstElementChild;

    taskContent.contentEditable = false;
    taskCounterLen.innerHTML = '';

    if (taskContent.textContent.length === 0) {
      taskContent.innerHTML = 'Type something...';
    }

    const linkRegex = /((http|https):\/\/[^\s]+)/g;
    const nodes = Array.from(taskContent.childNodes);

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const formattedContent = formatTaskContent(node.textContent);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedContent;

        node.replaceWith(...tempDiv.childNodes);
      } else if (node.tagName === 'A') {
        const urlMatch = node.textContent.match(linkRegex);
        if (urlMatch) {
          node.href = urlMatch[0];
          node.title = urlMatch[0];
        }
      }
    });

    const counterLine = checkBtnShowAll(taskContent, taskEle);
    tasks = tasks.map((task) => task.id === this.id ? { ...task, content: taskContent.innerHTML, counterLine } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskContent.classList.remove('show-all');
  };

  // DELETE ALL TASKS
  deleteAllTasks?.addEventListener('click', () => {
    if (tasks.length <= 2) {
      alert('you should have at least 3 tasks to delete all');
      return;
    }

    const confirmToDelete = confirm('Are you sure you want to delete all tasks?');
    if (!confirmToDelete) return;
    tasks = [];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    toggleTaskFilterState();
    renderTasks(tasks);
  });
}