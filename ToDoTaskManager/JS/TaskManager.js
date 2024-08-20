document.addEventListener('DOMContentLoaded', () => {
  const todoTasks = document.getElementById('todoTasks');
  const inProcessTasks = document.getElementById('inProcessTasks');
  const finishedTasks = document.getElementById('finishedTasks');

  const sections = [todoTasks, inProcessTasks, finishedTasks];

  sections.forEach(section => {
    section.addEventListener('dragover', e => {
      e.preventDefault(); 
      const dragging = document.querySelector('.dragging');
      if (dragging) {
        section.appendChild(dragging); 
      }
    });

    section.addEventListener('drop', () => {
      saveTasksToLocalStorage(); 
    });
  });

  document.getElementById('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    addTask();
  });

  loadTasksFromLocalStorage();
});

function showAddTaskForm() {
  const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
  addTaskModal.show();
}

function addTask() {
  const taskTitle = document.getElementById('taskTitle').value;
  const taskDescription = document.getElementById('taskDescription').value;

  const task = createTaskElement(taskTitle, taskDescription);
  document.getElementById('todoTasks').appendChild(task);

  const addTaskModal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
  addTaskModal.hide();
  document.getElementById('taskForm').reset();

  saveTasksToLocalStorage();
}

function createTaskElement(title, description) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.draggable = true;
  task.innerHTML = `
    <div class="task-header">
      <h5>${title}</h5>
      <button class="btn-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <p>${description}</p>
  `;

  task.querySelector('.btn-close').addEventListener('click', () => {
    task.remove();
    saveTasksToLocalStorage();
  });

  task.addEventListener('dragstart', () => {
    task.classList.add('dragging');
  });

  task.addEventListener('dragend', () => {
    task.classList.remove('dragging');
    saveTasksToLocalStorage();
  });

  return task;
}

function saveTasksToLocalStorage() {
  const sections = {
    todo: [],
    inProcess: [],
    finished: []
  };

  document.querySelectorAll('#todoTasks .task').forEach(task => {
    sections.todo.push({
      title: task.querySelector('h5').textContent,
      description: task.querySelector('p').textContent
    });
  });

  document.querySelectorAll('#inProcessTasks .task').forEach(task => {
    sections.inProcess.push({
      title: task.querySelector('h5').textContent,
      description: task.querySelector('p').textContent
    });
  });

  document.querySelectorAll('#finishedTasks .task').forEach(task => {
    sections.finished.push({
      title: task.querySelector('h5').textContent,
      description: task.querySelector('p').textContent
    });
  });

  localStorage.setItem('tasks', JSON.stringify(sections));
}

function loadTasksFromLocalStorage() {
  const sections = JSON.parse(localStorage.getItem('tasks'));

  if (sections) {
    Object.keys(sections).forEach(section => {
      sections[section].forEach(taskData => {
        const task = createTaskElement(taskData.title, taskData.description);
        document.getElementById(`${section}Tasks`).appendChild(task);
      });
    });
  }
}
