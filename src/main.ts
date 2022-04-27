import 'normalize.css'
import './style.css'
import { ListItem, createItemsStore } from './shopping-list'
import { save, load } from './storage'

const app = document.querySelector<HTMLDivElement>('#app')!
let inputText: HTMLInputElement
let store: ReturnType<typeof createItemsStore>

function addItemForm() {
  return `<form class="add-form">
    <input type="text" maxlength="40" />
    <button type="submit" class="add-button">+</button>
  </form>`
}

function deleteButton(id: ListItem['id']) {
  return `<button class="delete-button" data-id="${id}">✖️</button>`
}

function dateStr(d?: Date) {
  if (!d) return ''
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function listItem(i: ListItem) {
  return `<li class="list-item ${i.done ? 'done' : ''}"  data-id="${i.id}">
  <span class="name">📌 ${i.name} ${i.done ? '✔️' : ''}</span>
  <span class="doneat">${dateStr(i.doneAt)}</span>
  ${deleteButton(i.id)}
</li>`
}

function render(items: ListItem[]) {
  app.innerHTML = `
    <ul class="list">
      ${items.map((i) => listItem(i)).join('')}
    </ul>
    ${addItemForm()}
  `

  inputText = document.querySelector('.add-form input[type=text]')!
}

async function onListItemClick(el: HTMLElement) {
  const id = el.dataset['id']
  if (!id) return
  const item = store.get(id)
  if (!item) return
  store.update(id, { done: !item.done })
}

async function onAddButtonClick(ev: Event) {
  ev.preventDefault()
  const txt = inputText.value
  if (store.add(txt)) {
    inputText.value = ''
  }
  inputText.focus()
}

async function onDeleteButtonClick(ev: Event, el: HTMLElement) {
  ev.preventDefault()
  ev.stopPropagation()
  const id = el.dataset['id']
  if (!id) return
  store.delete(id)
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
  .then((initialItems: ListItem[]) => {
    store = createItemsStore(initialItems, async (items: ListItem[]) => {
      render(items)
      await save(items)
    })
    render(initialItems)
  })
  .catch((err) => {
    console.error(err)
  })

