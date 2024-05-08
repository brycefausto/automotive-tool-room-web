'use client'
import { PropsWithId } from '@/types'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'
import ItemDetails from './ItemDetails'
import { Item } from '@/models/item'
import useDataFetch from '@/hooks/dataFetch'
import Loader from '../Loader'

export default function ItemDetailsPage({ id }: PropsWithId) {
  const { data, isLoading } = useDataFetch<Item>(`/items/${id}`)

  return (
    <Loader loading={isLoading}>
      <div>
        <div className="flex p-5">
          <Link href="/items">
            <Button className="justify-self-start">Back</Button>
          </Link>
          <div className="flex flex-auto">
          </div>
          <Link href={`/items/edit/${id}`}>
            <Button>Edit</Button>
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="w-[500px]">
            <div className="mb-5">
              <span className="text-4xl font-bold">Item Details</span>
            </div>
            <ItemDetails data={data as Item} />
          </div>
        </div>
      </div>
    </Loader>
  )
}
