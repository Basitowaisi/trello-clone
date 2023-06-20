export const matchTodosWithSearchQuery = (todo: Todo, query: string) => {
  if (!query) return todo

  return todo.title.toLowerCase().includes(query.toLowerCase())
}
