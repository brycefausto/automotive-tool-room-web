import { AppUser } from '@/models/user';
import { SelectOption } from '@/types';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface UserNamesDropdownProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
}

export default function UserNamesDropdown({ id, value, onChange }: UserNamesDropdownProps) {
  const defaultValue = value ? { label: value, value: value } : null;
  const [optionValue, setOptionValue] = useState<SelectOption | null>(defaultValue)
  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<AppUser[]>('/users/search?q=' + query + '&userFilter=nonAdmin')

      return data.map(it => ({ label: it.name, value: it.name }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }

  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (selectValue: SelectOption) => {
    setOptionValue(selectValue)
    onChange?.(selectValue?.value || '')
  }

  return (
    <AsyncSelect
      id={id}
      cacheOptions
      defaultOptions
      isClearable
      placeholder="Search borrower"
      loadOptions={promiseOptions}
      value={optionValue}
      onChange={(newVal) => handleChange(newVal as SelectOption)}
      styles={{ container: (styles) => {
        styles.width = '250px'
        return styles
      } }}
    />
  )
}
