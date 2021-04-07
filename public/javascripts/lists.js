const createList = async (name, dueDate) => {
  if(!dueDate) dueDate = null;
  const res = await fetch("/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, dueDate}),
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
    body: JSON.stringify({name, dueDate, completed, id}),
    headers: {
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
export  { createList, allLists, updateLists, deleteLists };
