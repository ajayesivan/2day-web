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

  const taskEditor = document.getElementById('taskEditor');
  taskEditor.addEventListener('keyup', function (event) {
    const taskTitle = event.target.value;
    if (event.keyCode === 13 && taskTitle.trim().length > 0) {
      addTaskToView({
        id: 10,
        title: taskTitle,
        done: false,
      })
    }
  });
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