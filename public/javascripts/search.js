const searchLists = async (name) => {
  if(!name) return;
  const res = await fetch(`/search/lists/${name}`)

  return await res.json()
}

const searchTasks = async (description) => {
  if(!description) return;
  const res = await fetch(`/search/tasks/${description}`)

  return await res.json()
}


export { searchLists, searchTasks }
