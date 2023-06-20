import { useBoardStore } from "@/store/BoardStore"
import { RadioGroup } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import React from "react"

const options = [
  {
    id: "todo",
    name: "Todo",
    description: "A new Task to be completed",
    color: "bg-red-500",
  },
  {
    id: "inprogress",
    name: "In Progress",
    description: "A Task that is currently being worked on",
    color: "bg-yellow-500",
  },
  {
    id: "done",
    name: "Done",
    description: "A Task that has been completed",
    color: "bg-green-500",
  },
]

const TaskRadioGroup = () => {
  const [taskType, setTaskType] = useBoardStore((state) => [
    state.taskType,
    state.setTaskType,
  ])

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={taskType} onChange={setTaskType}>
          <div className="space-y-2">
            {options.map((option) => (
              <RadioGroup.Option
                key={option.id}
                value={option.id}
                className={({ active, checked }) =>
                  `${active} ? "ring-2 ring-white ring-opactiy-60 ring-offset-2 ring-offset-sky-300 : ""
                  ${
                    checked
                      ? `${option.color} bg-opacity-75 text-white`
                      : "bg-white"
                  }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                  `
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {option.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {option.description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                    )}
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default TaskRadioGroup
