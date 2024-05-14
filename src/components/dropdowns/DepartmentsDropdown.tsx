import { Department } from '@/models/department';
import { SelectOption } from '@/types';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import { isEqual } from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface DepartmentsDropdownProp {
  value?: Department
  onChange?: (value: Department) => void
  selectFirstValue?: boolean
}

export interface DepartmentsSelectOption extends SelectOption {
  department: Department
}

export default function DepartmentsDropdown({ value, onChange, selectFirstValue }: DepartmentsDropdownProp) {
  const defaultValue = value ? { label: value.name, value: value._id, department: value } : null;
  const [optionValue, setOptionValue] = useState<DepartmentsSelectOption | null>(defaultValue);
  const isValuesEquals = isEqual(defaultValue, optionValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isValuesEquals) {
      setOptionValue(defaultValue);
    }
  }, [defaultValue]);

  const fetchData = async (query: string) => {
    try {
      const { data } = await serverFetch.get<Department[]>('/departments/search?q=' + query)
      const options = data.map(it => ({ label: it.name, value: it._id, department: it }))
      if (isLoaded == false && selectFirstValue) {
        setOptionValue(options.length > 0 ? options[0] : null);
      }
      setIsLoaded(true)
      return data.map(it => ({ label: it.name, value: it._id, department: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }
  
  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: DepartmentsSelectOption) => {
    setOptionValue(value)
    onChange?.(value.department)
  }
    
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions 
      loadOptions={promiseOptions} 
      value={optionValue}  
      onChange={(newVal) => handleChange(newVal as DepartmentsSelectOption)}
    />
  )
}
