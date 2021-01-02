let tasks = {};

const localStorageTodayTaskKey = 'today';


window.onload = function() {
  tasks = JSON.parse(localStorage.getItem(localStorageTodayTaskKey));

  for(const taskId in tasks) {
    addTaskToView(tasks[taskId]);
  }

  const taskEditor = document.getElementById('taskEditor');
  taskEditor.addEventListener('keyup', function (event) {
    const taskTitle = event.target.value;
    if (event.keyCode === 13 && taskTitle.trim().length > 0) {
      addTask(taskTitle);

      taskEditor.value = '';
    }
  });
}

function toggleTask(event) {
  const taskId = event.target.id;
  tasks[taskId].done = !tasks[taskId].done;
  save();
}

function addTask(title) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const uid = alphabet[Math.floor(Math.random() * 26)] + Date.now();
  const task = {
    id: uid,
    title,
    date: Date.now(),
    done: false,
  }
  tasks[uid] = task;
  save();
  addTaskToView(task);
}

function addTaskToView(task) {
  taskList = document.getElementById('taskList');

  const newTask = document.createElement('div');
  newTask.classList = ['task'];
  //checkbox
  const taskCheckbox = document.createElement('input');
  taskCheckbox.classList=['task__checkbox'];
  taskCheckbox.type = 'checkbox'
  taskCheckbox.checked = task.done ? true : false;
  taskCheckbox.id = task.id;
  taskCheckbox.onchange = toggleTask;
  newTask.appendChild(taskCheckbox);
  //title
  const taskTitle = document.createElement('span');
  taskTitle.classList = ['task__title']
  taskTitle.appendChild(document.createTextNode(task.title));
  newTask.appendChild(taskTitle);

  task.element = newTask;
  taskList.prepend(newTask);
}

function save() {
  localStorage.setItem(localStorageTodayTaskKey, JSON.stringify(tasks));
}