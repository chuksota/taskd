// const { createTask, allTasks, updateTasks, deleteTasks } = require("./tasks");
// const { createList, allLists, updateLists, deleteLists } = require("./lists");
const allLists = async () => {
  const res = await fetch(`/lists/`);

  return await res.json();
};

window.addEventListener("DOMContentLoaded", async (event) => {
  const lists = document.querySelector("#listofLists");
  const currentLists = await allLists();
  console.log(currentLists);
  currentLists.Array().forEach((list) => {
    const listName = document.createElement("div");
    listName.innerHTML = list.name;
    lists.appendChild(div);
  });
});
