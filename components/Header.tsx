"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid"
import Avatar from "react-avatar"
import { useBoardStore } from "@/store/BoardStore"
import fetchSuggestion from "@/lib/fetchSuggestion"

const Header = () => {
  const [board, query, setQuery] = useBoardStore((state) => [
    state.board,
    state.query,
    state.setQuery,
  ])

  const [loading, setLoading] = useState<boolean>(false)
  const [suggestion, setSuggestion] = useState<string>("")

  useEffect(() => {
    if (board.columns.size === 0) return
    setLoading(true)
    const fetchSuggestions = async () => {
      try {
        const aiSuggestion = await fetchSuggestion(board)
        setSuggestion(aiSuggestion)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [board])

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />
        <Image
          src={"/trello-logo.png"}
          alt="trello logo"
          width={300}
          height={100}
          className="w-44 m:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md shadow-md p-2 flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none p-2"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button hidden type="submit">
              Search
            </button>
          </form>
          <Avatar name="Basit Bashir" size="50" round={true} color="#0055D1" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
          <UserCircleIcon
            className={`h-10 w-10 inline-block text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion
            ? suggestion
            : "We are summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  )
}

export default Header
