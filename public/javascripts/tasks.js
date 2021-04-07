const createTask = async (description, notes, dueDate, listId) => {
  if (!dueDate) dueDate = null;
  if (!notes) notes = null;
  const res = await fetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ description, notes, dueDate, listId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

const allTasks = async (listId) => {
  const res = await fetch(`/tasks/${listId}`);

  return await res.json();
};

const updateTasks = async (description, notes, dueDate, completed, id) => {
  const res = await fetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ description, notes, dueDate, completed, id }),
    header: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const deleteTasks = async (id) => {
  const res = await fetch(`/tasks/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};

export { createTask, allTasks, updateTasks, deleteTasks };
