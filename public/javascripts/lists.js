const listForm = document.querySelector('#list-form')

listForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(listForm)
  const name = formData.get('name')
  const dueDate = formData.get('dueDate')
  const completed = formData.get('completed')

  const body = {name, dueDate, completed}

  try {
    const res = await fetch('../routes/lists', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if(!res.ok){
      throw res
    }
    window.location.href('/homepage')
  } catch(e){
    if(e.status >= 400 && e.status < 600){
      const errorJSON = await e.json();
    }
  }
})
