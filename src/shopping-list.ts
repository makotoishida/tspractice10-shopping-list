export type ListItem = {
  id: string
  name: string
  done: boolean
  doneAt?: Date
}

export function createItemsStore(
  initialItems: ListItem[],
  onUpdate: (items: ListItem[]) => Promise<void>
) {
  let items: ListItem[] = initialItems
  return {
    get: (id: ListItem['id']) => getItem(items, id),
    delete: (id: ListItem['id']) => {
      items = deleteItem(items, id)
      onUpdate(items)
    },
    add: (name: ListItem['name']) => {
      const newItems = addItem(items, name)
      if (newItems === items) return false
      items = newItems
      onUpdate(items)
      return true
    },
    update: (id: ListItem['id'], updates: Partial<ListItem>) => {
      const newItems = updateItem(items, id, updates)
      if (newItems === items) return false
      items = newItems
      onUpdate(items)
      return true
    },
  }
}

function getItem(items: ListItem[], id: ListItem['id']): ListItem | undefined {
  return items.filter((i) => i.id === id)[0]
}

function deleteItem(items: ListItem[], id: ListItem['id']) {
  return items.filter((i) => i.id !== id)
}

function addItem(items: ListItem[], name: ListItem['name']) {
  const newItem = createItem(items, name)
  if (!validateItem(newItem)) return items
  return [...items, newItem]
}

function updateItem(
  items: ListItem[],
  id: ListItem['id'],
  updates: Partial<ListItem>
) {
  const index = items.findIndex((i) => i.id === id)
  if (index < 0) return items
  const newItem: ListItem = {
    ...items[index],
    ...updates,
    doneAt: updates.done ? new Date() : undefined,
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
