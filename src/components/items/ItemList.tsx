'use client';
import { BASE_ITEMS_IMAGE_URL } from '@/globals';
import { PaginatedDocument } from '@/models';
import { Item } from '@/models/item';
import { useListenerSocket } from '@/socket/listenerSocket';
import { useAppDispatch, useAppSelector } from '@/store';
import { cacheActions, cacheSelectors } from '@/store/reducers/cache';
import serverFetch from '@/utils/serverFetch';
import axios from 'axios';
import { Button, Pagination, Table } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingComponent from '../LoadingComponent';
import DeleteButton from '../buttons/DeleteButton';
import DetailsButton from '../buttons/DetailsButton';
import EditButton from '../buttons/EditButton';
import SearchInput from '../forms/SearchInput';
import { useAlertModal } from '@/providers/AlertModalProvider';

export interface ItemListProps {
  category?: string
  page?: number
  q?: string
}

export default function ItemList({ category, page, q }: ItemListProps) {
  const itemCache = useAppSelector(cacheSelectors.getItems)
  const dispatch = useAppDispatch()
  const [items, setItems] = useState<Item[]>(itemCache)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { category, page: currentPage, search: searchQuery }
  const router = useRouter()
  const alertModal = useAlertModal()

  useListenerSocket<PaginatedDocument<Item>>(
    'items', queryParams,
    (data) => {
      const items = data.docs
      dispatch(cacheActions.setItems(items))
      setItems(items)
      setTotalPages(data.totalPages)
      setLoading(false)
    })

  // useEffect(() => {
  //   const params: any = {}

  //   if (currentPage > 1) {
  //     params.page = currentPage.toString()
  //   }

  //   if (searchQuery) {
  //     params.searchQuery = searchQuery
  //   }

  //   const urlParams = new URLSearchParams(params)
  //   router.replace('/' + (urlParams.size > 0 ? `?${urlParams.toString()}` : ''), { scroll: false })
  // }, [])

  const handleDetails = (id: string) => {
    router.push(`/items/details/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/items/edit/${id}`)
  }

  const handleDelete = (item: Item) => {
    alertModal.showDeleteModal("item", async () => {
      try {
        await serverFetch.delete(`/items/${item._id}`)
        if (item.image) {
          await axios.delete(`/api/imagekit/delete/${item.image}`)
        }
        setCurrentPage(1)

        alert("Successfully deleted data!")
      } catch (error: any) {
        alert("Error deleting data: " + error.message)
      }
    })
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex p-5">
        <div className="flex">
          <span className="text-2xl font-bold">Items</span>
        </div>
        <div className="flex flex-auto">
        </div>
        <div className="mr-5">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Link href="/items/create">
          <Button className="justify-self-end">Add</Button>
        </Link>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Brand</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Stock</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {items.map(item => (
            <Table.Row key={item._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <span>{item.name}</span>
                <div className="float-right">
                  <DetailsButton onClick={() => handleDetails(item._id)} />
                </div>
              </Table.Cell>
              <Table.Cell>
                <Image src={BASE_ITEMS_IMAGE_URL + item.image} alt='' width={100} height={100} />
              </Table.Cell>
              <Table.Cell>{item.brand}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell>{item.stock}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-4">
                  <span>
                    <EditButton onClick={() => handleEdit(item._id)} />
                  </span>
                  <span>
                    <DeleteButton onClick={() => handleDelete(item)} />
                  </span>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {items.length == 0 && (
        <div className="flex justify-center p-10">
          <p className="text-gray-500 text-2xl">The list is empty.</p>
        </div>
      )}
      <div className="flex overflow-x-auto sm:justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
      </div>
    </div>
  )
}
