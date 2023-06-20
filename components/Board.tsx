"use client"
import { useBoardStore } from "@/store/BoardStore"
import React, { useEffect } from "react"
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import Column from "./Column"

const Board = () => {
  const [board, getBoard, setBoardState] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
  ])
  useEffect(() => {
    getBoard()
  }, [])

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    if (!destination) return

    if (type === "column") {
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      })
    }

    const columns = Array.from(board.columns)
    const startColumnIndex = columns[+source.droppableId]
    const endColumnIndex = columns[+destination.droppableId]

    const startColumn: Column = {
      id: startColumnIndex[0],
      todos: startColumnIndex[1].todos,
    }
    const endColumn: Column = {
      id: endColumnIndex[0],
      todos: endColumnIndex[1].todos,
    }

    if (!startColumn || !endColumn) return

    if (source.index === destination.index && startColumn === endColumn) return

    const newTodos = startColumn.todos
    const [movedTodo] = newTodos.splice(source.index, 1)

    if (startColumn.id === endColumn.id) {
      // drag to same column
      newTodos.splice(destination.index, 0, movedTodo)
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      }
      const newColumns = new Map(board.columns)
      newColumns.set(startColumn.id, newCol)

      setBoardState({
        ...board,
        columns: newColumns,
      })
    } else {
      // drag to different column

      const finishedTodos = Array.from(endColumn.todos)
      finishedTodos.splice(destination.index, 0, movedTodo)
      const newColumns = new Map(board.columns)
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      }
      newColumns.set(startColumn.id, newCol)
      newColumns.set(endColumn.id, {
        id: endColumn.id,
        todos: finishedTodos,
      })

      // update in database

      setBoardState({
        ...board,
        columns: newColumns,
      })
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board
