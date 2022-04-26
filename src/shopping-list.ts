export type ListItem = {
  id: string
  name: string
  done: boolean
}

export function getItem(
  items: ListItem[],
  id: ListItem['id']
): ListItem | undefined {
  return items.filter((i) => i.id === id)[0]
}

export function deleteItem(items: ListItem[], id: ListItem['id']) {
  return items.filter((i) => i.id !== id)
}

export function addItem(items: ListItem[], name: ListItem['name']) {
  const newItem = createItem(items, name)
  if (!validateItem(newItem)) return items
  return [...items, newItem]
}

export function updateItem(
  items: ListItem[],
  id: ListItem['id'],
  update: Partial<ListItem>
) {
  const index = items.findIndex((i) => i.id === id)
  if (index < 0) return items
  const newItem: ListItem = {
    ...items[index],
    ...update,
  }
  if (!validateItem(newItem)) return items
  return [...items.slice(0, index), newItem, ...items.slice(index + 1)]
}

function createItem(items: ListItem[], name: ListItem['name']) {
  const maxId = items.reduce(
    (prev, cur) => Math.max(prev, parseInt(cur.id, 10)),
    Number.MIN_VALUE
  )
  const newItem: ListItem = {
    id: `${maxId + 1}`,
    name,
    done: false,
  }
  return newItem
}

function validateItem(item: ListItem) {
  if (!item.id) return false
  if (!item.name) return false
  return true
}
