let tasks = {};

const localStorageTodayTaskKey = 'today';


window.onload = function() {
  tasks = JSON.parse(localStorage.getItem(localStorageTodayTaskKey)) || {};

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

function toggleTask() {
  const taskElement = this.parentNode;
  const taskId = taskElement.getAttribute('id');
  tasks[taskId].done = !tasks[taskId].done;

  //Move task
  const taskList = document.getElementById('taskList');
  taskElement.remove();
  if(tasks[taskId].done) {
    taskList.appendChild(taskElement);
  } else {
    taskElement.classList.remove('task--done')
    taskList.prepend(taskElement);
  }
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
  const taskList = document.getElementById('taskList');

  const newTask = document.createElement('div');
  newTask.classList = ['task'];
  newTask.id = task.id;
  //checkbox
  const taskCheckbox = document.createElement('input');
  taskCheckbox.classList=['task__checkbox'];
  taskCheckbox.type = 'checkbox'
  taskCheckbox.checked = task.done ? true : false;
  taskCheckbox.onchange = toggleTask;
  newTask.appendChild(taskCheckbox);
  //title
  const taskTitle = document.createElement('span');
  taskTitle.classList = ['task__title']
  taskTitle.appendChild(document.createTextNode(task.title));
  newTask.appendChild(taskTitle);
  //delete button
  const taskDeleteBtn = document.createElement('button');
  taskDeleteBtn.classList = ['delete-task-button'];
  taskDeleteBtn.onclick = deleteTask
  const deleteIcon = document.createElement('img');
  deleteIcon.width = "24";
  deleteIcon.src="images/icons/delete.png"
  deleteIcon.alt="Delete Icon"
  taskDeleteBtn.appendChild(deleteIcon);
  newTask.appendChild(taskDeleteBtn);

  if(task.done) {
    newTask.classList.add('task--done');
    taskList.appendChild(newTask);
  } else {
    taskList.prepend(newTask);
  }
}

function deleteTask () {
  const taskElement = this.parentNode;
  const taskId = taskElement.getAttribute('id');
  delete tasks[taskId];
  save();
  taskElement.classList.add('task--removal');
  setTimeout(function() { taskElement.remove(); }, 500)
}

function save() {
  localStorage.setItem(localStorageTodayTaskKey, JSON.stringify(tasks));
}