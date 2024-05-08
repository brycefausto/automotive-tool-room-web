import { TextInput } from 'flowbite-react'
import { ChangeEventHandler, useState } from 'react'
import { HiSearch } from "react-icons/hi"

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  let timer: any;
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      onChange(value)
    }, 1000)
  }

  return (
    <TextInput
      placeholder="Search"
      value={inputValue}
      onChange={handleChange}
      rightIcon={HiSearch}
    />
  )
}
