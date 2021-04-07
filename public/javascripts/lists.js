const createList = async (name, dueDate) => {
  const res = await fetch("/lists", {
    method: "POST",
    body: JSON.stringify({ name, dueDate }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const allLists = async () => {
  const res = await fetch(`/lists`);

  return await res.json();
};

const updateLists = async (name, dueDate, completed, id) => {
  const res = await fetch(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, dueDate, completed, id }),
    header: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const deleteLists = async (id) => {
  const res = await fetch(`/lists/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};
export { createList, allLists, updateLists, deleteLists };
