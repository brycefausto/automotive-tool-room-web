import { Subject } from '@/models/subject';
import { SelectOption } from '@/types';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface SubjectsDropdownProps {
  values?: Subject[]
  onChange?: (value: Subject[]) => void
}

export interface SubjectsSelectOption extends SelectOption {
  subject: Subject
}

export default function SubjectsDropdown({ values, onChange }: SubjectsDropdownProps) {
  const defaultValue = values ? values.map(value => ({ label: value.name, value: value._id, subject: value })) : []
  const [optionValue, setOptionValue] = useState<SubjectsSelectOption[]>(defaultValue)

  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<Subject[]>('/subjects/search?q=' + query)
      console.log({ options: data.map(it => it.name) })
  
      return data.map(it => ({ label: it.name, value: it._id, subject: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }
  
  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (valueArray: SubjectsSelectOption[]) => {
    setOptionValue(valueArray)
    const values = valueArray.map(it => it.subject)
    onChange?.(values)
  }
    
  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      value={optionValue}
      onChange={(newVal) => handleChange(newVal as SubjectsSelectOption[])}  
    />
  )
}
