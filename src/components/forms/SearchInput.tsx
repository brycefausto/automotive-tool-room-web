import { Button, TextInput } from 'flowbite-react'
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react'
import { HiSearch } from "react-icons/hi"

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onChange(inputValue)
    }
  }

  const onSearch = () => {
    onChange(inputValue)
  }

  return (
    <div className="flex flex-row">
      <TextInput
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rightIcon={HiSearch}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
      <Button
        onClick={onSearch}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, }}
      >
        Search
      </Button>
    </div>
  )
}
