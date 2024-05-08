import { Subject } from '@/models/subject';
import { Select } from 'flowbite-react';

export interface UserSubjectsDropdownProps {
  id?: string
  value?: string | null
  onChange?: (value: string) => void
  options: Subject[]
}

export default function UserSubjectsDropdown({ id, value, onChange, options: optionsProp }: UserSubjectsDropdownProps) {
  const options = optionsProp
    .map(it => ({ label: it.name, value: it._id, subject: it }))
    
  return (
    <Select id={id} defaultValue={value || undefined} onChange={(e) => onChange?.(e.target.value)}>
      {options.map(it => (
        <option key={it.value} value={it.value} >{it.label}</option>
      ))}
    </Select>
  )
}
