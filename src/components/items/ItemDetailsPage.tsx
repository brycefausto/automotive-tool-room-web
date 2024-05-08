'use client'
import { Item } from '@/models/item'
import { PropsWithId } from '@/types'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loader from '../Loader'
import ItemDetails from './ItemDetails'

export default function ItemDetailsPage({ id }: PropsWithId) {
  const [data, setData] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        const {data} = await serverFetch<Item>(`/items/${id}`);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        alert(getErrorMessage(error));
      }

    })()
  }, [])

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
