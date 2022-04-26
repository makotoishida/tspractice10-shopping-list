import 'normalize.css'
import './style.css'
import { ListItem, getItem, deleteItem, addItem } from './shopping-list'
import { save, load } from './storage'

const app = document.querySelector<HTMLDivElement>('#app')!
let items: ListItem[] = await load()
let list: HTMLUListElement
let addText: HTMLInputElement

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
    i.addEventListener('click', async (ev) => {
      const el = ev.currentTarget as HTMLLIElement
      const id = el.dataset['id']
      console.log(id, el)
      if (!id) return
      const item = getItem(items, id)
      if (!item) return
      item.done = !item.done
      render()
      await save(items)
      return true
    })
  })

  document
    .querySelector('.add-form button')
    ?.addEventListener('click', async (ev) => {
      ev.preventDefault()
      const txt = addText.value
      const newItems = addItem(items, txt)
      if (newItems === items) return
      items = newItems
      addText.value = ''
      render()
      await save(items)
      addText.focus()
    })

  document.querySelectorAll('.delete-button').forEach((i) => {
    i.addEventListener('click', async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      const id = (ev.currentTarget as HTMLButtonElement).dataset['id']
      if (!id) return
      items = deleteItem(items, id)
      render()
      await save(items)
    })
  })
}

render()
