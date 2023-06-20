import { formatTodosForOpenAI } from "@/utils"

export default async function fetchSuggestion(board: Board): Promise<string> {
  const todos = formatTodosForOpenAI(board)
  const resp = await fetch("/api/generateSummary", {
    method: "POST",
    body: JSON.stringify({ todos }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await resp.json()
  const { content } = data
  return content
}
