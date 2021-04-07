import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js";
import { createList, allLists, updateLists, deleteLists } from "./lists.js";

const listDiv = document.querySelector("#listOfLists");
const taskDiv = document.querySelector("#listOfTasks");
const editListBtn = document.querySelector("#editListButton");
const deleteListBtn = document.querySelector("#deleteListButton");
const editTaskBtn = document.querySelector("#deleteTaskButton");
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

let selectedTask;
let currentList;
let tasksContainer = {};
let listsContainer = {};
function createListElement(list) {
  const listName = document.createElement("div");
  listName.innerHTML = list.name;
  listName.setAttribute("id", `list-${list.id}`);

  listDiv.appendChild(listName);
}

function createTaskElement(task) {
  const taskDisplay = document.createElement("div");
  taskDisplay.setAttribute("id", `task-${task.id}`);
  if (!task.dueDate) task.dueDate = "";
  taskDisplay.innerHTML = task.description + " " + task.dueDate;

  taskDiv.appendChild(taskDisplay);
}

window.addEventListener("DOMContentLoaded", async (event) => {
  const currentLists = await allLists();
  const { lists } = currentLists;
  lists.forEach((list) => {
    createListElement(list);
    listsContainer[list.id] = list;
  });

  listDiv.addEventListener("click", async (event) => {
    taskListDiv.innerHTML = "";
    const listIdArray = event.target.id.split("-");
    const listId = parseInt(listIdArray[1]);
    currentList = listId;
    createTaskButton.removeAttribute("hidden");
    const currentTasks = await allTasks(listId);
    console.log(listsContainer[currentList]);
    const { tasks } = currentTasks;
    tasks.forEach((task) => {
      createTaskElement(task);
      tasksContainer[task.id] = task;
    });
  });
  createListButton.addEventListener("click", async (event) => {
    listForm.removeAttribute("hidden");
  });

  listSubmitButton.addEventListener("click", async (event) => {
    const { newList } = await createList(listName.value, dueDate.value);
    listForm.setAttribute("hidden", "true");
    createListElement(newList);
  });

  editListBtn.addEventListener("click", async (event) => {
    editListForm.removeAttribute("hidden");
    editListName.value = listsContainer[currentList].name;
    editListDueDate.value = listsContainer[currentList].dueDate;
    // date not pre populating
  });
  editListSubmit.addEventListener("click", async (event) => {
    const { list } = await updateLists(
      editListName.value,
      editListDueDate.value,
      currentList
    );
    editListForm.setAttribute("hidden", "true");
    const currentListElement = document.querySelector(`#list-${currentList}`);
    console.log(list);
    currentListElement.innerHTML = list.name;
  });

  createTaskButton.addEventListener("click", (event) => {
    newTaskForm.removeAttribute("hidden");
  });

  taskSubmit.addEventListener("click", async (event) => {
    const { newTask } = await createTask(
      taskDescription.value,
      taskNotes.value,
      taskDueDate.value,
      currentList
    );
    newTaskForm.setAttribute("hidden", "true");
    createTaskElement(newTask);
  });

  taskDiv.addEventListener("click", async (event) => {
    taskNotesDiv.innerHTML = "";
    const taskIdArray = event.target.id.split("-");
    const taskId = parseInt(taskIdArray[1]);
    selectedTask = taskId;
    const currentTask = tasksContainer[taskId];
    const newTaskNotes = document.createElement("div");
    newTaskNotes.innerHTML = currentTask.notes;
    taskNotesDiv.appendChild(newTaskNotes);
  });
});
