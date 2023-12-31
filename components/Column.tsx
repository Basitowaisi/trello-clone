import React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import TodoCard from "./TodoCard"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { useBoardStore } from "@/store/BoardStore"
import { matchTodosWithSearchQuery } from "@/utils"
import { useModalStore } from "@/store/ModalStore"

interface IProps {
  id: TypedColumn
  todos: Todo[]
  index: number
}

const idToColumnText: {
  [key in TypedColumn]: string
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
}

const Column = ({ id, todos, index }: IProps) => {
  const [query, setTaskType] = useBoardStore((state) => [
    state.query,
    state.setTaskType,
  ])
  const [openModal] = useModalStore((state) => [state.openModal])

  const onAddTask = () => {
    setTaskType(id)
    openModal()
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h1 className="flex justify-between font-bold text-xl">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-bold">
                    {
                      todos.filter((todo) =>
                        matchTodosWithSearchQuery(todo, query)
                      ).length
                    }
                  </span>
                </h1>
                <div className="space-y-2 mt-2">
                  {todos
                    .filter((todo) => matchTodosWithSearchQuery(todo, query))
                    .map((todo, index) => (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                  <div className="flex items-end justify-end p-2">
                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={onAddTask}
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column
