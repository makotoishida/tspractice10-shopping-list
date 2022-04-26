import 'normalize.css'
import './style.css'

type ListItem = {
  id: string
  name: string
  done: boolean
}

const app = document.querySelector<HTMLDivElement>('#app')!

const items: ListItem[] = [
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

function addItemForm() {
  return `<form class="add-form">
    <input type="text" />
    <button type="submit">Add</button>
  </form>`
}

function deleteButton() {
  return `<button>✖️</button>`
}

function render() {
  app.innerHTML = `
    <ul class="list">
      ${items
        .map(
          (i) =>
            `<li data-id="${i.id}">
              <span>📌 ${i.name} ${i.done ? '✔️' : ''}</span>
              ${deleteButton()}
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

  document
    .querySelector('.add-form button')
    ?.addEventListener('click', (ev) => {
      const txt = addText.value
      const newItem = { id: ++maxId + '', name: txt, done: false }
      if (validateItem(newItem)) {
        items.push(newItem)
        addText.value = ''
        render()
      }
      addText.focus()
    })
}

function validateItem(item: ListItem) {
  if (!item.id) return false
  if (!item.name) return false
  return true
}

render()
