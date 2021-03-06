import { ListItem } from './shopping-list'

const STORAGE_KEY = 'items'

export async function save(items: ListItem[]) {
  const s = JSON.stringify(
    items.map((i) => ({
      ...i,
      doneAt: formatDate(i.doneAt),
    }))
  )
  window.localStorage.setItem(STORAGE_KEY, s)
}

export async function load() {
  const s = window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  const items = JSON.parse(s)
  return items.map((i: { doneAt: string }) => ({
    ...i,
    doneAt: parseDate(i.doneAt),
  }))
}

function twoDig(n: number) {
  return ('0' + n).slice(-2)
}

function formatDate(d?: Date) {
  if (!d) return ''
  return `${d.getFullYear()}-${twoDig(d.getMonth() + 1)}-${twoDig(
    d.getDate()
  )}T00:00:00`
}

function parseDate(s: string) {
  if (!s) return undefined
  return new Date(s)
}
