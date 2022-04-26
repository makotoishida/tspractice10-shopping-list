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
    <button type="submit">Add</button>
  </form>`
}

function deleteButton(id: ListItem['id']) {
  return `<button class="delete-button" data-id="${id}">✖️</button>`
}

function listItem(i: ListItem) {
  return `<li data-id="${i.id}">
  <span>📌 ${i.name} ${i.done ? '✔️' : ''}</span>
  ${deleteButton(i.id)}
</li>`
}

function render() {
  removeHandlers()

  app.innerHTML = `
    <ul class="list">
      ${items.map((i) => listItem(i)).join('')}
    </ul>
    ${addItemForm()}
  `

  addText = document.querySelector('.add-form input[type=text]')!

  addHandlers()
}

async function onListItemClick(ev: Event) {
  const el = ev.currentTarget as HTMLLIElement
  const id = el.dataset['id']
  console.log(id, el)
  if (!id) return
  const item = getItem(items, id)
  if (!item) return
  items = updateItem(items, id, item.name, !item.done)
  render()
  await save(items)
  return true
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

async function onDeleteButtonClick(ev: Event) {
  ev.preventDefault()
  ev.stopPropagation()
  const id = (ev.currentTarget as HTMLButtonElement).dataset['id']
  if (!id) return
  items = deleteItem(items, id)
  render()
  await save(items)
}

function addHandlers() {
  document.querySelectorAll('ul.list > li').forEach((i) => {
    i.addEventListener('click', onListItemClick)
  })

  document
    .querySelector('.add-form button')
    ?.addEventListener('click', onAddButtonClick)

  document.querySelectorAll('.delete-button').forEach((i) => {
    i.addEventListener('click', onDeleteButtonClick)
  })
}

function removeHandlers() {
  document.querySelectorAll('ul.list > li').forEach((i) => {
    i.removeEventListener('click', onListItemClick)
  })

  document
    .querySelector('.add-form button')
    ?.removeEventListener('click', onAddButtonClick)

  document.querySelectorAll('.delete-button').forEach((i) => {
    i.removeEventListener('click', onDeleteButtonClick)
  })
}

load()
  .then((loadedItems) => {
    items = loadedItems
    render()
  })
  .catch((err) => {
    console.error(err)
  })
