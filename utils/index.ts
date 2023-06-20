import { storage, ID } from "@/appwrite"
import { Models } from "appwrite"

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

export const uploadImage = async (
  image: File
): Promise<Models.File | undefined> => {
  if (!image) return
  const file = await storage.createFile(
    process.env.NEXT_PUBLIC_STORAGE_ID!,
    ID.unique(),
    image
  )
  return file
}

export const getImageURL = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId)
  return url
}
