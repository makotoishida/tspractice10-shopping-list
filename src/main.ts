import 'normalize.css'
import './style.css'
import {
  ListItem,
  getItem,
  deleteItem,
  addItem,
  updateItem,
} from './shopping-list'
import { save, load } from './storage'

const app = document.querySelector<HTMLDivElement>('#app')!
let items: ListItem[] = []
let addText: HTMLInputElement

function addItemForm() {
  return `<form class="add-form">
    <input type="text" />
    <button type="submit" class="add-button">+</button>
  </form>`
}

function deleteButton(id: ListItem['id']) {
  return `<button class="delete-button" data-id="${id}">✖️</button>`
}

function listItem(i: ListItem) {
  return `<li class="list-item ${i.done ? 'done' : ''}"  data-id="${i.id}">
  <span>📌 ${i.name} ${i.done ? '✔️' : ''}</span>
  ${deleteButton(i.id)}
</li>`
}

function render() {
  app.innerHTML = `
    <ul class="list">
      ${items.map((i) => listItem(i)).join('')}
    </ul>
    ${addItemForm()}
  `

  addText = document.querySelector('.add-form input[type=text]')!
}

async function onListItemClick(el: HTMLElement) {
  const id = el.dataset['id']
  if (!id) return
  const item = getItem(items, id)
  if (!item) return
  items = updateItem(items, id, { done: !item.done })
  render()
  await save(items)
}

async function onAddButtonClick(ev: Event) {
  ev.preventDefault()
  const txt = addText.value
  const newItems = addItem(items, txt)
  if (newItems === items) return
  items = newItems
  addText.value = ''
  render()
  await save(items)
  addText.focus()
}

async function onDeleteButtonClick(ev: Event, el: HTMLElement) {
  ev.preventDefault()
  ev.stopPropagation()
  const id = el.dataset['id']
  if (!id) return
  items = deleteItem(items, id)
  render()
  await save(items)
}

function addHandlers() {
  document.addEventListener('click', (ev: Event) => {
    const selectors = '.add-button, .delete-button, .list-item'
    const el = (ev.target as HTMLElement).closest<HTMLElement>(selectors)
    if (!el) return

    if (el.className.includes('add-button')) {
      onAddButtonClick(ev)
    } else if (el.className.includes('delete-button')) {
      onDeleteButtonClick(ev, el)
    } else if (el.className.includes('list-item')) {
      onListItemClick(el)
    }
  })
}

addHandlers()

load()
  .then((loadedItems) => {
    items = loadedItems
    render()
  })
  .catch((err) => {
    console.error(err)
  })

