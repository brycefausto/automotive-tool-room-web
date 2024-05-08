import React, { useMemo } from 'react'
import CreatableSelect from 'react-select/creatable';

const options = [
  { label: '', value: '' },
  { label: 'Not Returned', value: 'Not Returned' },
  { label: 'Empty', value: 'Empty' },
  { label: 'Damaged (Still usable)', value: 'Damaged' },
  { label: 'Broken', value: 'Broken' },
  { label: 'Lost', value: 'Lost' },
]

export interface RemarksDropdownProps {
  defaultValue?: string
  onChange: (value: string) => void
  isConsumable?: true
}

export default function RemarksDropdown({ defaultValue, onChange, isConsumable }: RemarksDropdownProps) {
  const selectOptions = isConsumable ? options : options.filter(option => option.value != 'Empty');
  const optionValue = useMemo(() => {
    return options.find(option => option.value == defaultValue) || { label: defaultValue || '', value: defaultValue };
  }, [defaultValue]);

  return (
    <CreatableSelect 
    isClearable 
    options={selectOptions} 
    defaultValue={optionValue} 
    onChange={(newVal) => onChange(newVal?.value || '')}
    placeholder="Select or Input text"
     />
  )
}
