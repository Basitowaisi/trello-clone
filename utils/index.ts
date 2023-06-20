export const matchTodosWithSearchQuery = (todo: Todo, query: string) => {
  if (!query) return todo

  return todo.title.toLowerCase().includes(query.toLowerCase())
}

export const formatTodosForOpenAI = (board: Board) => {
  const todos = Array.from(board.columns.entries())
  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos
    return map
  }, {} as { [key in TypedColumn]: Todo[] })

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length
      return map
    },
    {} as { [key in TypedColumn]: number }
  )

  return flatArrayCounted
}
