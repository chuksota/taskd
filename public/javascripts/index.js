import { createTask, allTasks, updateTasks, deleteTasks } from "./tasks.js";
import { createList, allLists, updateLists, deleteLists } from "./lists.js";

const listDiv = document.querySelector("#listOfLists");

function createListElement(list) {
  const listName = document.createElement("div");
  listName.innerHTML = list.name;
  listName.setAttribute("id", `list-${list.id}`);
  listDiv.appendChild(listName);
}
window.addEventListener("DOMContentLoaded", async (event) => {
  const currentLists = await allLists();
  const { lists } = currentLists;
  lists.forEach((list) => {
    createListElement(list);
  });

  listDiv.addEventListener("click", async (event) => {
    const taskListDiv = document.querySelector("#listOfTasks");
    taskListDiv.innerHTML = "";
    const listIdArray = event.target.id.split("-");
    const listId = parseInt(listIdArray[1]);
    const currentTasks = await allTasks(listId);
    const { tasks } = currentTasks;
    tasks.forEach((task) => {
      const taskDescription = document.createElement("div");
      taskDescription.innerHTML = task.description;
      taskDescription.setAttribute("id", `task-${task.id}`);
      taskListDiv.appendChild(taskDescription);
    });
  });
  const createListButton = document.querySelector("#addListButton");
  const listForm = document.querySelector("#newListForm");
  createListButton.addEventListener("click", async (event) => {
    listForm.removeAttribute("hidden");
  });
  const listSubmitButton = document.querySelector("#listSubmit");

  listSubmitButton.addEventListener("click", async (event) => {
    const listName = document.querySelector("#listName").value;
    const dueDate = document.querySelector("#listDueDate").value;

    const { newList } = await createList(listName, dueDate);
    // const {newList} = newerList;
    listForm.setAttribute("hidden", "true");
    console.log(newList);
    createListElement(newList);
  });
});
