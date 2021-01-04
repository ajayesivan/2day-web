let tasks = {};

const localStorageTodayTaskKey = 'today';


window.onload = function() {
  tasks = JSON.parse(localStorage.getItem(localStorageTodayTaskKey)) || {};

  noData();

  // Add all tasks to view
  let animationDelay = 0.3 * Object.keys(tasks).length;
  for(const taskId in tasks) {
    addTaskToView(tasks[taskId], animationDelay);
    animationDelay -= 0.3;
  }

  const taskEditor = document.getElementById('taskEditor');
  const taskEditorButton = document.getElementById('taskEditorButton');
  taskEditor.addEventListener('keyup', function (event) {
    const taskTitle = event.target.value;
    // Add on enter
    if (event.keyCode === 13 && taskTitle.trim().length > 0) {
      addTask(taskTitle);
      taskEditor.value = '';
      taskEditorButton.classList.remove('task-editor__button--visible');
      return;
    }

    // Show add button
    if(taskTitle.trim().length > 0) {
      taskEditorButton.classList.add('task-editor__button--visible');
    } else {
      taskEditorButton.classList.remove('task-editor__button--visible');
    }
  });

  taskEditorButton.addEventListener('click', function() {
    const taskTitle = taskEditor.value;
    if(taskTitle.trim().length > 0) {
      addTask(taskTitle);
      taskEditor.value = '';
      taskEditorButton.classList.remove('task-editor__button--visible');
    }
  });

  const noDataButton = document.getElementById('noDataButton');
  noDataButton.addEventListener('click', function () {
    taskEditor.focus();
  });


}

function noData() {
  // Make no data button visible if no tasks are there
  const noDataButton = document.getElementById('noDataButton');
  if (Object.keys(tasks).length === 0) {
    noDataButton.classList.remove('no-data-button--hidden')
  } else {
    noDataButton.classList.add('no-data-button--hidden');
  }
}

function toggleTask() {
  const taskElement = this.parentNode;
  const taskId = taskElement.getAttribute('id');
  tasks[taskId].done = !tasks[taskId].done;

  //Move task
  setTimeout(function () {
    const taskList = document.getElementById('taskList');
    taskElement.style.animationDelay = '0s';
    taskElement.classList.add('task--removal');
    setTimeout(function () {
      taskElement.remove();
      taskElement.classList.remove('task--removal');
      if(tasks[taskId].done) {
        taskElement.classList.add('task--done')
        taskList.appendChild(taskElement);
      } else {
        taskElement.classList.remove('task--done')
        taskList.prepend(taskElement);
      }
      save();
    }, 500);
  }, 500)
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

function addTaskToView(task, animationDelay) {
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

  newTask.style.animationDelay = (animationDelay || 0) + 's';
  if(task.done) {
    newTask.classList.add('task--done');
    taskList.appendChild(newTask);
  } else {
    taskList.prepend(newTask);
  }

  noData();
}

function deleteTask () {
  const taskElement = this.parentNode;
  const taskId = taskElement.getAttribute('id');
  delete tasks[taskId];
  save();
  taskElement.style.animationDelay = '0s';
  taskElement.classList.add('task--removal');
  setTimeout(function() { taskElement.remove(); }, 500);
  noData();
}

function save() {
  localStorage.setItem(localStorageTodayTaskKey, JSON.stringify(tasks));
}