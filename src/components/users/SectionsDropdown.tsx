import { Section } from '@/models/section';
import { SelectOption } from '@/types';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface SectionsDropdownProp {
  value?: Section
  onChange?: (value: Section) => void
}

export interface SectionsSelectOption extends SelectOption {
  section: Section
}

export default function SectionsDropdown({ value, onChange }: SectionsDropdownProp) {
  const defaultValue = value ? { label: value.name, value: value._id, section: value } : null;
  const [optionValue, setOptionValue] = useState<SectionsSelectOption | null>(defaultValue)

  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<Section[]>('/sections/search?q=' + query)
      return data.map(it => ({ label: it.name, value: it._id, section: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }
  
  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: SectionsSelectOption) => {
    setOptionValue(value)
    onChange?.(value.section)
  }
    
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions 
      loadOptions={promiseOptions} 
      value={optionValue}  
      onChange={(newVal) => handleChange(newVal as SectionsSelectOption)}
    />
  )
}
