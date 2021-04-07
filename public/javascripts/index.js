import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js"
import { createList, allLists, updateLists, deleteLists } from "./lists.js"

const listDiv = document.querySelector("#listOfLists");
const taskDiv = document.querySelector('#listOfTasks')

let currentList;

function createListElement(list){
const listName = document.createElement("div");
listName.innerHTML = list.name;
listName.setAttribute('id', `list-${list.id}`)
listDiv.appendChild(listName);
}

function createTaskElement(task){
  const taskDisplay = document.createElement('div');
  taskDisplay.setAttribute('id', `task-${task.id}`);
  if(!task.dueDate) task.dueDate = '';
  taskDisplay.innerHTML = task.description + " " + task.dueDate;
  taskDiv.appendChild(taskDisplay)
}

window.addEventListener("DOMContentLoaded", async (event) => {
  const currentLists = await allLists();
  const {lists} = currentLists
  lists.forEach((list) => {
    createListElement(list)
  });

  listDiv.addEventListener('click', async (event)=> {
    const taskListDiv = document.querySelector('#listOfTasks')
    taskListDiv.innerHTML = ''
    const listIdArray = event.target.id.split('-')
    const listId = parseInt(listIdArray[1])
    currentList = listId;
    createTaskButton.removeAttribute('hidden');
    const currentTasks = await allTasks(listId)
    const {tasks} = currentTasks
    tasks.forEach((task) => {
     createTaskElement(task);
    });
  });
  const createListButton = document.querySelector('#addListButton')
  const listForm = document.querySelector('#newListForm')
  createListButton.addEventListener('click', async (event) =>{
    listForm.removeAttribute('hidden')
  })
  const listSubmitButton = document.querySelector('#listSubmit')

  listSubmitButton.addEventListener('click', async (event)=> {
    const listName = document.querySelector('#listName').value
    const dueDate = document.querySelector('#listDueDate').value

    const {newList} = await createList(listName, dueDate)
    listForm.setAttribute('hidden', 'true');
    createListElement(newList)
  })

  const createTaskButton = document.querySelector('#addTaskButton');
  const newTaskForm = document.querySelector('#newTaskForm')
  
  createTaskButton.addEventListener('click', (event)=> {
      newTaskForm.removeAttribute('hidden')
  })

  const taskSubmit = document.querySelector('#taskSubmit');

  taskSubmit.addEventListener('click', async (event)=> {
    const taskDescription = document.querySelector('#taskDescription').value;
    const taskNotes = document.querySelector('#taskNotes').value;
    const taskDueDate = document.querySelector('#taskDueDate').value;

    const {newTask} = await createTask(taskDescription, taskNotes, taskDueDate, currentList)
    console.log(newTask);
    newTaskForm.setAttribute('hidden', 'true')
    createTaskElement(newTask)

  })

});


