let taskList = [];

tasks = [
  {
    id: 1,
    title: 'First task',
    done: true,
  },
  {
    id: 2,
    title: 'Second task',
    done: false,
  },
  {
    id: 3,
    title: 'Third task',
    done: false,
  },
]

function onLoad() {
  for(const task of tasks) {
    addTaskToView(task);
  }
}

function toggleTask(event) {
  const task = tasks.find((element) => element.id == event.target.id);
  task.done = !task.done;
}

function addTaskToView(task) {
  taskList = document.getElementById('taskList');

  const newTask = document.createElement('div');
  newTask.classList = ['task'];
  //checkbox
  const taskCheckbox = document.createElement('div');
  taskCheckbox.classList=['task-checkbox'];
  const taskCheckboxInput = document.createElement('input', { type: 'checkbox'});
  taskCheckboxInput.type = 'checkbox'
  taskCheckboxInput.checked = task.done ? true : false;
  taskCheckboxInput.id = task.id;
  taskCheckboxInput.onchange = toggleTask;
  taskCheckboxInput.classList = ['task-checkbox__input'];
  const taskCheckboxMark = document.createElement('span');
  taskCheckboxMark.classList = ['task-checkbox__mark'];
  taskCheckbox.appendChild(taskCheckboxInput);
  taskCheckbox.appendChild(taskCheckboxMark);
  newTask.appendChild(taskCheckbox);
  //title
  const taskTitle = document.createElement('span');
  taskTitle.appendChild(document.createTextNode(task.title));
  newTask.appendChild(taskTitle);

  task.element = newTask;
  taskList.appendChild(newTask);
}