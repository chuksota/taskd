import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js";
import { createList, allLists, updateLists, deleteLists } from "./lists.js";
import { searchLists, searchTasks } from "./search.js";
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
const taskCounter = document.querySelector('#taskCounter');
const taskCompleted = document.querySelector('#taskCompleted');
const listDate = document.querySelector('#listDate')
//task notes elements-----------------------------------------------------------
const taskNotesDiv = document.querySelector("#taskNotes");
const notesLabel = document.querySelector("#notesLabel");

//cancel buttons----------------------------------------------------------------
const cancelBtns = document.querySelectorAll(".cancel");

//search bar--------------------------------------------------------------------
const searchBarInput = document.querySelector("#searchBar");
const selectSearchBtn = document.querySelector("#selectSearchBtn");
const searchBtn = document.querySelector("#searchBtn");
let selectedSearchType = 'Lists'
const resetListofLists = document.querySelector("#resetListsBtn");

//selected list/task id---------------------------------------------------------
let selectedTask;
let currentList;

//item  containers--------------------------------------------------------------
let tasksContainer = {};
let listsContainer = {};

//tasks trackers for current list-----------------------------------------------
let tasksCounter = 0;
let completedTasks = 0;

// previous selected elements---------------------------------------------------
let previousListElement;
let previousTaskElement;

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
  taskDisplay.classList.add("tasking");

  taskDisplay.innerHTML = task.description;
  if (task.dueDate)
    taskDisplay.innerHTML += " --- Due: " + task.dueDate.slice(0, 10);

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
    if (!event.target.id.startsWith("list-")) return;
    if (previousListElement) previousListElement.classList.remove("selected");
    let listElement = document.querySelector(`#${event.target.id}`);
    listElement.classList.add("selected");
    previousListElement = listElement;
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
    taskCounter.removeAttribute("hidden")
    taskCompleted.removeAttribute('hidden')
    listDate.removeAttribute('hidden')
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

    taskCounter.innerHTML = `Tasks: ${tasksCounter}`
    taskCompleted.innerHTML = `Tasks Completed: ${completedTasks}`

    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listDate.innerHTML = ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  //complete list listener------------------------------------------------------
  completeListBtn.addEventListener("click", async (event) => {
    const list = listsContainer[currentList];
    completeListBtn.setAttribute("hidden", "true");
    editListBtn.setAttribute("hidden", "true");
    await updateLists(list.name, list.dueDate, list.id, true);

    const listElement = document.querySelector(`#list-${currentList}`);
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

    if (selectedList.dueDate) {
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
    completeTaskBtn.setAttribute("hidden", "true");
    editListBtn.setAttribute("hidden", "true");
    deleteListBtn.setAttribute("hidden", "true");
    listSummary.innerHTML = "";
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
    if (!event.target.id.startsWith("task-")) return;
    if (previousTaskElement) previousTaskElement.classList.remove("selected");
    let taskElement = document.querySelector(`#${event.target.id}`);
    taskElement.classList.add("selected");
    previousTaskElement = taskElement;
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

    currentTaskElement.innerHTML = task.description;
    if (task.dueDate)
      currentTaskElement.innerHTML += " --- Due: " + task.dueDate.slice(0, 10);
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

    // listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;
    taskCounter.innerHTML = `Tasks: ${tasksCounter}`
    taskCompleted.innerHTML = `Tasks Completed: ${completedTasks}`
    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listDate.innerHTML = ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  //complete task listener------------------------------------------------------
  completeTaskBtn.addEventListener("click", async (event) => {
    const task = tasksContainer[selectedTask];
    if (task.completed) return;
    editTaskBtn.setAttribute("hidden", "true");
    completeTaskBtn.setAttribute("hidden", "true");
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

    // listSummary.innerHTML = `Tasks: ${tasksCounter} Tasks Completed: ${completedTasks}`;
    taskCounter.innerHTML = `Tasks: ${tasksCounter}`
    taskCompleted.innerHTML = `Tasks Completed: ${completedTasks}`
    let currentListDueDate = listsContainer[currentList].dueDate;

    if (currentListDueDate) {
      listDate.innerHTML = ` Due Date: ${currentListDueDate.slice(0, 10)}`;
    }
  });

  // search bar listeners------------------------------------------------------------
  searchBtn.addEventListener("click", async (event) => {
    if (!searchBarInput.value) return;
      if(selectedSearchType === 'Lists'){
        listDiv.innerHTML = "";
        taskDiv.innerHTML = "";
        listDiv.innerHTML = "";
        taskNotesDiv.innerHTML = "";
        listSummary.innerHTML = "";
        notesLabel.setAttribute("hidden", "true");
        listSummaryLabel.setAttribute("hidden", "true");
        editTaskBtn.setAttribute("hidden", "true");
        deleteTaskBtn.setAttribute("hidden", "true");
        completeTaskBtn.setAttribute("hidden", "true");
        createTaskButton.setAttribute("hidden", "true");
        const searchTarget = searchBarInput.value;
        const listSomething = await searchLists(searchTarget);
        const { foundLists } = listSomething;
        foundLists.forEach((list) => {
          createListElement(list);
          listsContainer[list.id] = list;
        });
      }
      else{
        taskDiv.innerHTML = "";
        const searchTarget = searchBarInput.value;
        const taskSomething = await searchTasks(searchTarget);
        const { foundTasks } = taskSomething;
        foundTasks.forEach((task) => {
          createTaskElement(task);
          tasksContainer[task.id] = task;
        });
      }

  });

  selectSearchBtn.addEventListener("change", async (event) => {
    // if (!searchBarInput.value) return;

    selectedSearchType = event.target.value
    console.log(selectedSearchType)
  });

  resetListofLists.addEventListener("click", async (event) => {
    searchBarInput.value = "";
    taskDiv.innerHTML = "";
    listDiv.innerHTML = "";
    taskNotesDiv.innerHTML = "";
    listSummary.innerHTML = "";
    notesLabel.setAttribute("hidden", "true");
    listSummaryLabel.setAttribute("hidden", "true");
    editTaskBtn.setAttribute("hidden", "true");
    deleteTaskBtn.setAttribute("hidden", "true");
    completeTaskBtn.setAttribute("hidden", "true");
    completeListBtn.setAttribute("hidden", "true");
    deleteListBtn.setAttribute("hidden", "true");
    editListBtn.setAttribute("hidden", "true");
    createTaskButton.setAttribute("hidden", "true");
    const currentLists = await allLists();
    const { lists } = currentLists;
    lists.forEach((list) => {
      createListElement(list);
      listsContainer[list.id] = list;
    });
  });
});
