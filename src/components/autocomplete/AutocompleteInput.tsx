import { TextInput } from 'flowbite-react'
import _ from 'lodash'
import React, { ReactNode, useRef, useState } from 'react'

export interface AutocompleteInputProps<T> {
  value?: T,
  valueKey?: string,
  labelKey?: string,
  onChange?: (value: T) => void
  fetchData: (query: string) => Promise<T[] | undefined>,
  renderOption: (item: T) => ReactNode
}

export default function AutocompleteInput<T = { [key: string]: string }>({ value, valueKey: valueKeyProp, labelKey: labelKeyProp, onChange, fetchData, renderOption }: AutocompleteInputProps<T>) {
  const valueKey = valueKeyProp || '_id'
  const labelKey = labelKeyProp || 'name'
  const [stringValue, setStringValue] = useState((value ? _.get(value, valueKey) : ''))
  const [label, setLabel] = useState((value ? _.get(value, labelKey) : ''))
  const [suggestions, setSuggestions] = useState<T[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  const loadData = async (query: string) => {
    console.log("fetching data...")
    const data = (await fetchData(query)) || []
    setSuggestions(data)
  }

  const loadSuggestions = (query: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    const timer = setInterval(() => {
      loadData(query)

      clearInterval(timer)
      return
    }, 1000)
    timerRef.current = timer
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    loadSuggestions(value)
    setLabel(value)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
    if (event.key === "Enter") {
      let label = ""
      if (suggestions.length > 0) {
        const suggestion = suggestions[0]
        label = _.get(suggestion, labelKey)
        onChange?.(suggestion)
      }
      setStringValue(value)
      setLabel(label)
      setSuggestions([])
      console.log('entered')
    }
  }

  const handleSuggestionClick = (it: any) => {
    setStringValue(it[valueKey])
    setLabel(it[labelKey])
    setSuggestions([])
    onChange?.(it)
  }

  const handleFocused = () => {
    loadSuggestions("")
    console.log("focused")
  }

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestions([])
    }, 100)
  }

  return (
    <div
      onFocus={handleFocused}
      onBlur={handleBlur}>
      <TextInput
        value={label}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <div className="absolute border-2 border-gray-200 bg-white z-10 min-w-[200px]">
          {suggestions.map((it, index) => (
            <div key={index} className="p-2 bg-white hover:bg-gray-400 hover:cursor-pointer" onClick={() => handleSuggestionClick(it)}>
              {renderOption(it)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

