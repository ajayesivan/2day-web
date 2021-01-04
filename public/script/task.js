let tasks = {};
let currentTaskId = null;
let timerWorker = null;

const localStorageTodayTaskKey = 'today';
const localStorageCurrentTaskIdKey = 'todayCurrentTaskId';


window.onload = function () {
  tasks = JSON.parse(localStorage.getItem(localStorageTodayTaskKey)) || {};
  currentTaskId = localStorage.getItem(localStorageCurrentTaskIdKey);
  if(currentTaskId == 'null') {
    currentTaskId = null;
  } else {
    timerWorker = setInterval(timerCallback, 60000);
  }

  noData();

  // Add all tasks to view
  for (const taskId in tasks) {
    addTaskToView(tasks[taskId]);
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
    if (taskTitle.trim().length > 0) {
      taskEditorButton.classList.add('task-editor__button--visible');
    } else {
      taskEditorButton.classList.remove('task-editor__button--visible');
    }
  });

  taskEditorButton.addEventListener('click', function () {
    const taskTitle = taskEditor.value;
    if (taskTitle.trim().length > 0) {
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
    noDataButton.classList.add('no-data-button--visible')
  } else {
    noDataButton.classList.remove('no-data-button--visible');
  }
}

function toggleTask() {
  const taskElement = this.parentNode;
  const taskId = taskElement.getAttribute('id');
  tasks[taskId].done = !tasks[taskId].done;
  tasks[taskId].completedOn = tasks[taskId].done ? Date.now() : null;

  //Move task
  setTimeout(function () {
    const taskList = document.getElementById('taskList');
    taskElement.classList.add('task-toggle');
    setTimeout(function () {
      taskElement.remove();
      taskElement.classList.remove('task-toggle');
      if (tasks[taskId].done) {
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
    completedOn: null,
    times: [],
    time: null,
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
  taskCheckbox.classList = ['task__checkbox'];
  taskCheckbox.type = 'checkbox'
  taskCheckbox.checked = task.done ? true : false;
  taskCheckbox.onchange = toggleTask;
  newTask.appendChild(taskCheckbox);
  //title
  const taskTitle = document.createElement('span');
  taskTitle.classList = ['task__title']
  taskTitle.appendChild(document.createTextNode(task.title));
  newTask.appendChild(taskTitle);

  // Actions
  const taskActions = document.createElement('div');
  taskActions.classList = ['task-actions'];
  taskActions.id = 'A_' + task.id;
  // task timer
  const taskTime = document.createElement('div');
  taskTime.classList = ['task-time'];
  taskTime.innerHTML = formatTime(task.time);
  taskTime.id = 'T_' + task.id;
  if (task.id == currentTaskId) taskTime.classList.add('task-time--running');

  //delete button
  const taskDeleteBtn = document.createElement('button');
  taskDeleteBtn.classList = ['delete-task-button'];
  taskDeleteBtn.onclick = deleteTask
  const deleteIcon = document.createElement('img');
  deleteIcon.width = "24";
  deleteIcon.src = "images/icons/delete.png"
  deleteIcon.alt = "Delete Icon"
  taskDeleteBtn.appendChild(deleteIcon);

  //timer button
  const taskTimerBtn = document.createElement('button');
  taskTimerBtn.classList = ['timer-task-button'];
  taskTimerBtn.onclick = toggleTimer
  const timerIcon = document.createElement('img');
  timerIcon.width = "24";
  timerIcon.src = task.id == currentTaskId ? "images/icons/stop-timer.png" : "images/icons/start-timer.png"
  timerIcon.id = 'I_' + task.id;
  taskTimerBtn.appendChild(timerIcon);

  taskActions.appendChild(taskTime);
  taskActions.appendChild(taskDeleteBtn);
  taskActions.appendChild(taskTimerBtn);

  newTask.appendChild(taskActions);

  if (task.done) {
    newTask.classList.add('task--done');
    taskList.appendChild(newTask);
  } else {
    taskList.prepend(newTask);
  }

  noData();
}

function deleteTask() {
  const taskAction = this.parentNode;
  const taskId = taskAction.getAttribute('id').substr(2);
  delete tasks[taskId];
  save();
  const taskElement = document.getElementById(taskId);
  taskElement.classList.add('task--removal');
  setTimeout(function () { taskElement.remove(); }, 500);
  noData();
}

function toggleTimer() {
  if(timerWorker) {
    clearInterval(timerWorker);
  }

  const taskAction = this.parentNode;
  const taskId = taskAction.getAttribute('id').substr(2);

  if (currentTaskId) {
    tasks[currentTaskId].times[tasks[currentTaskId].times.length - 1].to = Date.now();
    tasks[currentTaskId].time = (tasks[currentTaskId].time || 0) + (tasks[currentTaskId].times[tasks[currentTaskId].times.length - 1].to - tasks[currentTaskId].times[tasks[currentTaskId].times.length - 1].from);

    const currentTaskIcon = document.getElementById('I_' + currentTaskId);
    currentTaskIcon.src = "images/icons/start-timer.png";
    const currentTaskTime = document.getElementById('T_' + currentTaskId);
    currentTaskTime.classList.remove('task-time--running');

    if (taskId == currentTaskId) {
      currentTaskId = null;
      save();
      return;
    }
  }
  tasks[taskId].times = tasks[taskId].times || [];
  tasks[taskId].times.push({ from: Date.now(), to: null });
  tasks[taskId].done = false;
  currentTaskId = taskId;

  const runningTaskIcon = document.getElementById('I_' + taskId);
  runningTaskIcon.src = "images/icons/stop-timer.png";
  const runningTaskTime = document.getElementById('T_' + taskId);
  runningTaskTime.classList.add('task-time--running');
  runningTaskTime.innerHTML = formatTime(tasks[taskId].time || 1);

  timerWorker = setInterval(timerCallback, 60000);

  save();
}

function save() {
  localStorage.setItem(localStorageTodayTaskKey, JSON.stringify(tasks));
  localStorage.setItem(localStorageCurrentTaskIdKey, currentTaskId);
}

function formatTime(timeInMillis) {
  tm = Math.floor((timeInMillis / 1000 / 60) % 60);
  th = Math.floor(timeInMillis / 1000 / 60 / 60);
  return timeInMillis ? `${th}:${tm}` : '';
}

function timerCallback() {
  const runningTaskTime = document.getElementById('T_' + currentTaskId);
  runningTaskTime.innerHTML = formatTime(Date.now() - tasks[currentTaskId].times[tasks[currentTaskId].times.length - 1].from);
}