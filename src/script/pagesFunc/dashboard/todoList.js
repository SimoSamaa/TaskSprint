import { v4 as uuidv4 } from 'uuid';

export default function todoList() {
  const addTaskForm = document.forms[1];
  const addTskInput = addTaskForm?.children[0];
  const taskCategory = addTaskForm?.children[1].firstElementChild;
  const filter = document.querySelector('.filter select');

  let categories = {
    personal: true,
    home: true,
    work: true,
    entertainment: true,
  };

  const tasks = localStorage['tasks'] ? JSON.parse(localStorage['tasks']) : [];
  const selectedCategory = Object.keys(categories);

  function toggleTaskFilterState() {
    if (!(filter instanceof HTMLSelectElement)) return;
    filter.disabled = tasks.length === 0 ? true : false;
  }

  addTaskForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!addTskInput.value) {
      alert('Please enter a task');
      return;
    } else if (!selectedCategory.includes(taskCategory.value.toLowerCase())) {
      alert('Please select a category');
      return;
    };

    console.log(addTskInput.value, taskCategory.value);

    const task = {
      id: uuidv4(),
      text: addTskInput.value,
      category: taskCategory.value.toLowerCase(),
      Date: new Date().toLocaleDateString(),
    };

    addTskInput.value = '';
    taskCategory.value = 'choose category';

    tasks.unshift(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    toggleTaskFilterState();
  });

  toggleTaskFilterState();
}