import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js";
import { createList, allLists, updateLists, deleteLists } from "./lists.js";

const listDiv = document.querySelector("#listOfLists");
const taskDiv = document.querySelector("#listOfTasks");
const editListBtn = document.querySelector("#editListButton");
const deleteListBtn = document.querySelector("#deleteListButton");
const editTaskBtn = document.querySelector("#editTaskButton");
const deleteTaskBtn = document.querySelector("#deleteTaskButton");
const createListButton = document.querySelector("#addListButton");
const listForm = document.querySelector("#newListForm");
const editListForm = document.querySelector("#editListForm");
const editListSubmit = document.querySelector("#updateList");
const taskListDiv = document.querySelector("#listOfTasks");
const listSubmitButton = document.querySelector("#listSubmit");
const listName = document.querySelector("#listName");
const dueDate = document.querySelector("#listDueDate");
const createTaskButton = document.querySelector("#addTaskButton");
const newTaskForm = document.querySelector("#newTaskForm");
const taskSubmit = document.querySelector("#taskSubmit");
const taskDescription = document.querySelector("#taskDescription");
const taskNotes = document.querySelector("#taskNotesInput");
const taskDueDate = document.querySelector("#taskDueDate");
const taskNotesDiv = document.querySelector("#taskNotes");
const editListName = document.querySelector("#editListName");
const editListDueDate = document.querySelector("#editListDueDate");

const editTaskForm = document.querySelector("#editTaskForm");
const editTaskNotesInput = document.querySelector("#editTaskNotesInput");
const editTaskDescription = document.querySelector("#editTaskDescription");
const editTaskDueDate = document.querySelector("#editTaskDueDate");
const editTaskSubmitBtn = document.querySelector("#editTaskSubmit");

const notesLabel = document.querySelector("#notesLabel");

const completeListBtn = document.querySelector("#completeListButton");
const completeTaskBtn = document.querySelector("#completeTaskButton");

const listSummaryLabel = document.querySelector("#listSummaryLabel");
const listSummary = document.querySelector("#listSummary");

const cancelBtns = document.querySelectorAll(".cancel");

let selectedTask;
let currentList;
let tasksContainer = {};
let listsContainer = {};

let tasksCounter = 0;
let completedTasks = 0;

function createListElement(list) {
  const listName = document.createElement("div");
  listName.innerHTML = list.name;
  listName.setAttribute("id", `list-${list.id}`);
  if (list.completed) listName.classList.add("completed");

  listDiv.appendChild(listName);
}

function createTaskElement(task) {
  const taskDisplay = document.createElement("div");
  taskDisplay.setAttribute("id", `task-${task.id}`);
  if (!task.dueDate) task.dueDate = "";
  taskDisplay.innerHTML = task.description + " " + task.dueDate.slice(0, 10);
  if (task.completed) taskDisplay.classList.add("completed");

  taskDiv.appendChild(taskDisplay);
}

window.addEventListener("DOMContentLoaded", async (event) => {
  cancelBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      newTaskForm.classList.add("hidden");
      listForm.classList.add("hidden");
      editTaskForm.classList.add("hidden");
      editListForm.classList.add("hidden");
    });
  });

  const currentLists = await allLists();
  const { lists } = currentLists;
  lists.forEach((list) => {
    createListElement(list);
    listsContainer[list.id] = list;
  });

  listDiv.addEventListener("mouseup", async (event) => {
    if (!event.target.id) return;

    editTaskBtn.setAttribute("hidden", "true");

    deleteTaskBtn.setAttribute("hidden", "true");
    completeTaskBtn.setAttribute("hidden", "true");
    completeListBtn.removeAttribute("hidden");
    deleteListBtn.removeAttribute("hidden");

    notesLabel.setAttribute("hidden", "true");

    listSummaryLabel.removeAttribute("hidden");
    listSummary.removeAttribute("hidden");

    tasksCounter = 0;
    completedTasks = 0;

    taskNotesDiv.innerHTML = "";
    taskListDiv.innerHTML = "";
    const listIdArray = event.target.id.split("-");
    const listId = parseInt(listIdArray[1]);
    currentList = listId;
    if (!listsContainer[currentList].completed)
      editListBtn.removeAttribute("hidden");
    createTaskButton.removeAttribute("hidden");
    const currentTasks = await allTasks(listId);
    const { tasks } = currentTasks;
    tasks.forEach((task) => {
      createTaskElement(task);
      tasksContainer[task.id] = task;
      tasksCounter++;
      if (task.completed) completedTasks++;
    });
    listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;

    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listSummary.innerHTML =
        listSummary.innerHTML + ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  completeListBtn.addEventListener("click", async (event) => {
    const list = listsContainer[currentList];

    await updateLists(list.name, list.dueDate, list.id, true);

    const listElement = document.querySelector(`#list-${currentList}`);
    console.log(listElement);
    listElement.classList.add("completed");
  });

  createListButton.addEventListener("click", async (event) => {
    listForm.classList.remove("hidden");
    dueDate.value = "";
    listName.value = "";
  });

  listSubmitButton.addEventListener("click", async (event) => {
    const { newList } = await createList(listName.value, dueDate.value);
    listForm.classList.add("hidden");
    createListElement(newList);
    listsContainer[newList.id] = newList;
  });

  editListBtn.addEventListener("click", async (event) => {
    editListForm.classList.remove("hidden");
    editListName.value = listsContainer[currentList].name;
    editListDueDate.value = listsContainer[currentList].dueDate.slice(0, 10);
    // date not pre populating
  });
  editListSubmit.addEventListener("click", async (event) => {
    const { list } = await updateLists(
      editListName.value,
      editListDueDate.value,
      currentList,
      false
    );
    editListForm.classList.add("hidden");
    const currentListElement = document.querySelector(`#list-${currentList}`);
    currentListElement.innerHTML = list.name;
  });

  deleteListBtn.addEventListener("click", async (event) => {
    const currentListElement = document.querySelector(`#list-${currentList}`);
    const tasksToDelete = await allTasks(currentList);
    const { tasks } = tasksToDelete;
    tasks.forEach(async (task) => {
      await deleteTasks(task.id);
    });
    await deleteLists(currentList);
    currentListElement.remove();
    taskListDiv.innerHTML = "";
    taskNotesDiv.innerHTML = "";
    createTaskButton.setAttribute("hidden", "true");
    editTaskBtn.setAttribute("hidden", "true");
    deleteTaskBtn.setAttribute("hidden", "true");
  });

  createTaskButton.addEventListener("click", (event) => {
    newTaskForm.classList.remove("hidden");
    taskDescription.value = "";
    taskDueDate.value = "";
    taskNotes.value = "";
  });

  taskSubmit.addEventListener("click", async (event) => {
    const { newTask } = await createTask(
      taskDescription.value,
      taskNotes.value,
      taskDueDate.value,
      currentList
    );
    newTaskForm.classList.add("hidden");
    createTaskElement(newTask);
    tasksContainer[newTask.id] = newTask;

    tasksCounter++;

    listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;

    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listSummary.innerHTML =
        listSummary.innerHTML + ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  taskDiv.addEventListener("click", async (event) => {
    completeTaskBtn.removeAttribute("hidden");
    notesLabel.removeAttribute("hidden");

    deleteTaskBtn.removeAttribute("hidden");
    taskNotesDiv.innerHTML = "";
    const taskIdArray = event.target.id.split("-");
    const taskId = parseInt(taskIdArray[1]);
    selectedTask = taskId;
    const currentTask = tasksContainer[taskId];
    if (!currentTask.completed) editTaskBtn.removeAttribute("hidden");
    taskNotesDiv.innerHTML = currentTask.notes;
  });

  editTaskBtn.addEventListener("click", (event) => {
    editTaskForm.classList.remove("hidden");
    editTaskDescription.value = tasksContainer[selectedTask].description;
    editTaskDueDate.value = tasksContainer[selectedTask].dueDate.slice(0, 10);
    editTaskNotesInput.value = tasksContainer[selectedTask].notes;
  });

  editTaskSubmitBtn.addEventListener("click", async (event) => {
    const { task } = await updateTasks(
      editTaskDescription.value,
      editTaskNotesInput.value,
      editTaskDueDate.value,
      false,
      selectedTask
    );
    if (!task.dueDate) task.dueDate = "";
    tasksContainer[task.id] = task;
    editTaskForm.classList.add("hidden");
    const currentTaskElement = document.querySelector(`#task-${selectedTask}`);
    currentTaskElement.innerHTML =
      task.description + "      " + task.dueDate.slice(0, 10);
    const currentTask = tasksContainer[selectedTask];
    taskNotesDiv.innerHTML = currentTask.notes;
  });

  deleteTaskBtn.addEventListener("click", async (event) => {
    const task = tasksContainer[selectedTask];
    await deleteTasks(selectedTask);
    const currentTaskElement = document.querySelector(`#task-${selectedTask}`);
    currentTaskElement.remove();

    taskNotesDiv.innerHTML = "";
    editTaskBtn.setAttribute("hidden", "true");
    deleteTaskBtn.setAttribute("hidden", "true");
    completeTaskBtn.setAttribute("hidden", "true");

    if (task.completed) {
      completedTasks--;
    }
    tasksCounter--;

    listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;

    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listSummary.innerHTML =
        listSummary.innerHTML + ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  completeTaskBtn.addEventListener("click", async (event) => {
    const task = tasksContainer[selectedTask];

    await updateTasks(
      task.description,
      task.notes,
      task.dueDate,
      true,
      task.id
    );

    task.completed = true;
    const taskElement = document.querySelector(`#task-${selectedTask}`);
    taskElement.classList.add("completed");

    completedTasks++;

    listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;

    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listSummary.innerHTML =
        listSummary.innerHTML + ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });
});
