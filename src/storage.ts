import { ListItem } from './shopping-list'

const STORAGE_KEY = 'items'

export async function save(items: ListItem[]) {
  const s = JSON.stringify(items)
  window.localStorage.setItem(STORAGE_KEY, s)
}

export async function load() {
  const s = window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  const items = JSON.parse(s) as ListItem[]
  return items
}
