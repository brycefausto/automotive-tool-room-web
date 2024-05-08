import React, { useCallback, useEffect, useRef, useState } from 'react';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import dynamic from 'next/dynamic';
import { Item } from '@/models/item';
import { SelectOption } from '@/types';
import { BASE_ITEMS_IMAGE_URL } from '@/globals';
import Image from 'next/image';

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export interface ItemsDropdownProp {
  id?: string
  value?: Item | null
  setValue?: (value: Item) => void
  excludedItems?: Item[]
}

export interface ItemSelectOption extends SelectOption {
  item: Item
}

export default function ItemsDropdown({ id, value, setValue, excludedItems = [] }: ItemsDropdownProp) {
  const optionValue = value ? { label: value.name, value: value._id, item: value } : null;
  const [defaultOptions, setDefaultOptions] = useState<ItemSelectOption[]>([])

  const fetchData = useCallback(async (query: string) => {
    try {
      const { data } = await serverFetch.get<Item[]>('/items/search?q=' + query)
      return data
        .filter(it => it.stock > 0 && !excludedItems.some(exItem => exItem._id == it._id))
        .map(it => ({ label: it.name, value: it._id, item: it }))
    } catch (error: any) {
      console.log(error.message)
      alert(getErrorMessage(error))
    }
  }, [])

  useEffect(() => {
    (async () => {
      const data = await fetchData("")
      if (data) {
        setDefaultOptions(data)
      }
    })()
  }, [excludedItems, fetchData])
  
  const promiseOptions = async (inputValue: string) => {
    return (await fetchData(inputValue)) || []
  }

  const handleChange = (value: ItemSelectOption) => {
    setValue?.(value.item)
  }

  const formatOptionLabel = ({ label, item } : ItemSelectOption) => (
    <div className="flex flex-row gap-4">
      <div className="p-2">
        <Image src={BASE_ITEMS_IMAGE_URL + item.image} alt='' width={50} height={50} />
      </div>
      <div className="text-s w-[100px] text-wrap">
        {label}
      </div>
    </div>
  )
    
  return (
    <AsyncSelect
      id={id}
      cacheOptions={false}
      defaultOptions={defaultOptions}
      loadOptions={promiseOptions} 
      value={optionValue}  
      onChange={(newVal) => handleChange(newVal as ItemSelectOption)}
      formatOptionLabel={(data) => formatOptionLabel(data as ItemSelectOption)}
    />
  )
}
