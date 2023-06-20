import { ID, database, storage } from "@/appwrite"
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn"
import { uploadImage } from "@/utils"
import { create } from "zustand"

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
  query: string
  setQuery: (query: string) => void

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void

  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void
  // add new task
  newTaskInput: string
  setNewTaskInput: (input: string) => void
  taskType: TypedColumn
  setTaskType: (type: TypedColumn) => void
  image: File | null
  setImage: (image: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  query: "",
  newTaskInput: "",
  taskType: "todo",
  image: null,
  setImage: (image) => set({ image }),
  setTaskType: (type) => set({ taskType: type }),
  setNewTaskInput: (input) => set({ newTaskInput: input }),
  setQuery: (query) => set({ query }),
  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns)
    newColumns.get(id)?.todos.splice(taskIndex, 1)
    set({ board: { columns: newColumns } })

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    )
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn()
    set({ board })
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    )
  },

  addTask: async (todo, columnId, image) => {
    let file: Image | undefined
    if (image) {
      const fileUploaded = await uploadImage(image)
      file = {
        bucketId: fileUploaded?.bucketId!,
        fileId: fileUploaded?.$id!,
      }
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    )

    set({ newTaskInput: "" })
    set((state) => {
      const newColumns = new Map(state.board.columns)
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      }

      const column = newColumns.has(columnId)
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }
      return {
        board: {
          columns: newColumns,
        },
      }
    })
  },
}))
