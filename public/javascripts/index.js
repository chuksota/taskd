import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js";
import { createList, allLists, updateLists, deleteLists } from "./lists.js";

//list and task display area elements
const listDiv = document.querySelector("#listOfLists");
const taskDiv = document.querySelector("#listOfTasks");

//create lists elements---------------------------------------------------------
const createListButton = document.querySelector("#addListButton");
const listForm = document.querySelector("#newListForm");
const listSubmitButton = document.querySelector("#listSubmit");
const listName = document.querySelector("#listName");
const dueDate = document.querySelector("#listDueDate");

//create tasks elements---------------------------------------------------------
const createTaskButton = document.querySelector("#addTaskButton");
const newTaskForm = document.querySelector("#newTaskForm");
const taskDescription = document.querySelector("#taskDescription");
const taskNotes = document.querySelector("#taskNotesInput");
const taskDueDate = document.querySelector("#taskDueDate");
const taskSubmit = document.querySelector("#taskSubmit");

//edit lists elements-----------------------------------------------------------
const editListBtn = document.querySelector("#editListButton");
const editListForm = document.querySelector("#editListForm");
const editListName = document.querySelector("#editListName");
const editListDueDate = document.querySelector("#editListDueDate");
const editListSubmit = document.querySelector("#updateList");

//edit tasks elements-----------------------------------------------------------
const editTaskBtn = document.querySelector("#editTaskButton");
const editTaskForm = document.querySelector("#editTaskForm");
const editTaskNotesInput = document.querySelector("#editTaskNotesInput");
const editTaskDescription = document.querySelector("#editTaskDescription");
const editTaskDueDate = document.querySelector("#editTaskDueDate");
const editTaskSubmitBtn = document.querySelector("#editTaskSubmit");

//delete buttons----------------------------------------------------------------
const deleteListBtn = document.querySelector("#deleteListButton");
const deleteTaskBtn = document.querySelector("#deleteTaskButton");

//complete buttons--------------------------------------------------------------
const completeListBtn = document.querySelector("#completeListButton");
const completeTaskBtn = document.querySelector("#completeTaskButton");

//list summary elements---------------------------------------------------------
const listSummaryLabel = document.querySelector("#listSummaryLabel");
const listSummary = document.querySelector("#listSummary");

//task notes elements-----------------------------------------------------------
const taskNotesDiv = document.querySelector("#taskNotes");
const notesLabel = document.querySelector("#notesLabel");

//cancel buttons----------------------------------------------------------------
const cancelBtns = document.querySelectorAll(".cancel");

//selected list/task id---------------------------------------------------------
let selectedTask;
let currentList;

//item  containers--------------------------------------------------------------
let tasksContainer = {};
let listsContainer = {};

//tasks trackers for current list-----------------------------------------------
let tasksCounter = 0;
let completedTasks = 0;


//create element functions------------------------------------------------------
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


//listeners start---------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async (event) => {

  //cancel buttons listeners----------------------------------------------------
  cancelBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      newTaskForm.classList.add("hidden");
      listForm.classList.add("hidden");
      editTaskForm.classList.add("hidden");
      editListForm.classList.add("hidden");
    });
  });


  //get all the lists for user and display them---------------------------------
  const currentLists = await allLists();
  const { lists } = currentLists;
  lists.forEach((list) => {
    createListElement(list);
    listsContainer[list.id] = list;
  });


  //list selector listener------------------------------------------------------
  listDiv.addEventListener("mouseup", async (event) => {
    if (!event.target.id) return;

    //hide task buttons when selecting a new list
    editTaskBtn.setAttribute("hidden", "true");
    deleteTaskBtn.setAttribute("hidden", "true");
    completeTaskBtn.setAttribute("hidden", "true");
    notesLabel.setAttribute("hidden", "true");

    //show list buttons when selecting a list
    completeListBtn.removeAttribute("hidden");
    deleteListBtn.removeAttribute("hidden");
    listSummaryLabel.removeAttribute("hidden");
    listSummary.removeAttribute("hidden");

    tasksCounter = 0;
    completedTasks = 0;

    taskNotesDiv.innerHTML = "";
    taskDiv.innerHTML = "";

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


  //complete list listener------------------------------------------------------
  completeListBtn.addEventListener("click", async (event) => {
    const list = listsContainer[currentList];

    await updateLists(list.name, list.dueDate, list.id, true);

    const listElement = document.querySelector(`#list-${currentList}`);
    console.log(listElement);
    listElement.classList.add("completed");
  });


  //create new list listeners---------------------------------------------------
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


  //edit list listeners---------------------------------------------------------
  editListBtn.addEventListener("click", async (event) => {
    editListForm.classList.remove("hidden");

    let selectedList = listsContainer[currentList];
    editListName.value = selectedList.name;

    if(selectedList.dueDate){
      editListDueDate.value = selectedList.dueDate.slice(0, 10);
    }
  });

  editListSubmit.addEventListener("click", async (event) => {
    const { list } = await updateLists(
      editListName.value,
      editListDueDate.value,
      currentList,
      false
    );

    listsContainer[list.id] = list;
    editListForm.classList.add("hidden");
    const currentListElement = document.querySelector(`#list-${currentList}`);
    currentListElement.innerHTML = list.name;
  });


  //delete list listener--------------------------------------------------------
  deleteListBtn.addEventListener("click", async (event) => {
    const currentListElement = document.querySelector(`#list-${currentList}`);
    const tasksToDelete = await allTasks(currentList);
    const { tasks } = tasksToDelete;
    tasks.forEach(async (task) => {
      await deleteTasks(task.id);
    });

    await deleteLists(currentList);
    currentListElement.remove();
    taskDiv.innerHTML = "";
    taskNotesDiv.innerHTML = "";
    createTaskButton.setAttribute("hidden", "true");
    editTaskBtn.setAttribute("hidden", "true");
    deleteTaskBtn.setAttribute("hidden", "true");
  });


  //create new task listeners---------------------------------------------------
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


  //task selector listener------------------------------------------------------
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


  //edit task listeners---------------------------------------------------------
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


  //delete task listener--------------------------------------------------------
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

  //complete task listener------------------------------------------------------
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
