import 'normalize.css'
import './style.css'

type ListItem = {
  id: string
  name: string
  done: boolean
}

const app = document.querySelector<HTMLDivElement>('#app')!

let items: ListItem[] = [
  { id: '1', name: 'Banana', done: false },
  { id: '2', name: 'Milk', done: false },
  { id: '3', name: 'Apple', done: true },
  { id: '4', name: 'Toilet Paper', done: false },
  { id: '5', name: 'Butter', done: true },
  { id: '6', name: 'Coffee', done: false },
]

let list: HTMLUListElement
let addText: HTMLInputElement
let maxId = items.length

function getItemById(id: ListItem['id']) {
  return items.filter((i) => i.id === id)[0]
}

function deleteItemById(id: ListItem['id']) {
  items = items.filter((i) => i.id !== id)
}

function addItemForm() {
  return `<form class="add-form">
    <input type="text" />
    <button type="submit">Add</button>
  </form>`
}

function deleteButton(id: ListItem['id']) {
  return `<button class="delete-button" data-id="${id}">✖️</button>`
}

function render() {
  app.innerHTML = `
    <ul class="list">
      ${items
        .map(
          (i) =>
            `<li data-id="${i.id}">
              <span>📌 ${i.name} ${i.done ? '✔️' : ''}</span>
              ${deleteButton(i.id)}
            </li>`
        )
        .join('')}
    </ul>
    ${addItemForm()}
  `

  list = document.querySelector('ul.list')!
  addText = document.querySelector('.add-form input[type=text]')!

  bindHandlers()
}

function bindHandlers() {
  document.querySelectorAll('ul.list > li').forEach((i) => {
    i.addEventListener('click', (ev) => {
      const el = ev.currentTarget as HTMLLIElement
      const id = el.dataset['id']
      console.log(id, el)
      if (!id) return
      const item = getItemById(id)
      if (!item) return
      item.done = !item.done
      render()
      return true
    })
  })

  document.querySelector('.add-form button')?.addEventListener('click', () => {
    const txt = addText.value
    const newItem = { id: ++maxId + '', name: txt, done: false }
    if (validateItem(newItem)) {
      items.push(newItem)
      addText.value = ''
      render()
    }
    addText.focus()
  })

  document.querySelectorAll('.delete-button').forEach((i) => {
    i.addEventListener('click', (ev) => {
      ev.stopPropagation()
      const id = (ev.currentTarget as HTMLButtonElement).dataset['id']
      if (!id) return
      deleteItemById(id)
      render()
    })
  })
}

function validateItem(item: ListItem) {
  if (!item.id) return false
  if (!item.name) return false
  return true
}

render()
