'use client'

import { BASE_ITEMS_IMAGE_URL } from "@/globals"
import { Item } from "@/models/item"
import { BorrowTransactionItem } from "@/models/transaction"
import { Button, Label, Select, TextInput } from 'flowbite-react'
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { FaTimesCircle } from "react-icons/fa"
import ErrorMessageAlert from "../alerts/ErrorMessageAlert"
import ItemsDropdown from "./ItemsDropdown"
import { getSocket } from "@/socket/listenerSocket"
import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { useAppSelector } from "@/store"
import { getAppUser } from "@/store/reducers/user"

export interface BorrowTransactionItemDto extends Omit<BorrowTransactionItem, "returnQuantity"> {
}

export interface TransactionItemFormProps {
  value?: BorrowTransactionItemDto[]
  onChange?: (value: BorrowTransactionItemDto[]) => void
}

export default function TransactionItemForm({ value, onChange }: TransactionItemFormProps) {
  const user = useAppSelector(getAppUser);
  const [item, setItem] = useState<Item | null>()
  const [size, setSize] = useState('')
  const [sizeOptions, setSizeOptions] = useState<string[]>([])
  const [quantity, setQuantity] = useState<number>(1)
  const [transactItems, setTransactItems] = useState<BorrowTransactionItemDto[]>(value || [])
  const [errorMessage, setErrorMessage] = useState('')

  const maxStock = useMemo(() => {
    if (item) {
      if (size) {
        const itemSize = item.itemSizes.find(it => it.size == size)
        if (itemSize) {
          return itemSize.stock
        }
      } else {
        return item.stock
      }
    }

    return 1
  }, [item, size])

  const excludedItems = useMemo(() => {
    const exItems = transactItems
      .map(it => it.item)
      .filter(item => {
        const hasItemSizes = item.itemSizes.length > 0

        return hasItemSizes && item.itemSizes.every(it => {
          return transactItems.some(it1 => it1.item._id == item._id && it1.size == it.size)
        })
      })

    return exItems
  }, [transactItems])

  console.log({ excludedItems })

  useEffect(() => {
    const socket = getSocket({ query: { room: user._id } });
    socket.on('scanItem', async (itemId: string) => {
      try {
        const { data } = await serverFetch<Item>(`/items/${itemId}`)
        setItem(data)
      } catch (error) {
        alert(getErrorMessage(error))
      }
    })

    return () => { socket.disconnect() }
  })

  useEffect(() => {
    const newSizeOptions = item?.itemSizes
      .filter(itemSize => !transactItems.some(it => it.item._id == item._id && it.size == itemSize.size) && itemSize.stock > 0)
      .map(it => it.size)
      || []
    const newSize = newSizeOptions.length > 0 ? newSizeOptions[0] : ''
    setSize(newSize)
    setSizeOptions(newSizeOptions)
  }, [item, transactItems])

  const showAlertErrorMessage = (message: string) => {
    setErrorMessage(message)
  }

  const showQuantityErrorMessage = () => {
    showAlertErrorMessage("The quantity should be less than or equal to stock.")
  }

  const showExistingItemErrorMessage = () => {
    showAlertErrorMessage("The item already exists in transaction items.")
  }

  const commitChange = (transactItems: BorrowTransactionItemDto[]) => {
    setTransactItems(transactItems)
    setItem(null)
    setQuantity(1)
    onChange?.(transactItems)
  }

  const handleAddItem = () => {
    if (item) {
      const newTransactItems = transactItems.slice()
      const existingItem = newTransactItems.find(it => it.item._id == item._id)
      if (!existingItem || existingItem.size !== size) {
        if (item.itemSizes.length > 0) {
          const itemSize = item.itemSizes.find(it => it.size == size)

          if (itemSize) {
            if (quantity <= itemSize.stock) {
              const transactItem: BorrowTransactionItemDto = {
                item, quantity, size
              }
              newTransactItems.push(transactItem)
              commitChange(newTransactItems)
            } else {
              showQuantityErrorMessage()
            }
          }
        } else {
          if (quantity <= item.stock) {
            const transactItem: BorrowTransactionItemDto = {
              item, quantity, size
            }
            newTransactItems.push(transactItem)
            commitChange(newTransactItems)
          } else {
            showQuantityErrorMessage()
          }
        }
      } else {
        showExistingItemErrorMessage()
      }
    }
  }

  const handleSetQuantity = (index: number, quantity: number) => {
    const newTransactItems = transactItems.slice()
    const transactItem = newTransactItems[index]
    transactItem.quantity = quantity
    setTransactItems(newTransactItems)
    onChange?.(newTransactItems)
  }

  const handleDeleteItem = (index: number) => {
    const newTransactItems = transactItems.slice()
    newTransactItems.splice(index, 1)
    setTransactItems(newTransactItems)
    onChange?.(newTransactItems)
  }

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="items" value="Add Items" />
      </div>
      {transactItems.length > 0 && (
        <table className="border border-gray-300 mb-5">
          <thead className="border border-gray-300">
            <tr>
              <th className="border border-gray-300 py-1 px-2">Image</th>
              <th className="border border-gray-300 py-1 px-2">Item</th>
              <th className="border border-gray-300 py-1 px-2">Size</th>
              <th className="border border-gray-300 py-1 px-2">Stock</th>
              <th className="border border-gray-300 py-1 px-2">Quantity</th>
              <th className="border border-gray-300 py-1 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {transactItems.map((transactItem, i) => (
              <tr key={i}>
                <td className="border border-gray-300 py-1 px-2">
                  <div className="p-2">
                    <Image src={BASE_ITEMS_IMAGE_URL + transactItem.item.image} alt='' width={50} height={50} />
                  </div>
                </td>
                <td className="border border-gray-300 py-1 px-2 text-s flex-1 text-wrap">
                  {transactItem.item.name}
                </td>
                <td className="border border-gray-300 py-1 px-2 text-s flex-1 text-wrap">
                  {transactItem.size}
                </td>
                <td className="border border-gray-300 py-1 px-2 text-s flex-1 text-wrap">
                  {
                    transactItem.item.itemSizes.find(it => it.size == transactItem.size)?.stock || 0
                  }
                </td>
                <td className="border border-gray-300 py-1 px-2 text-s flex-1 text-wrap text-center">
                  <TextInput
                    type="number"
                    min={1}
                    max={transactItem.item.stock}
                    value={transactItem.quantity}
                    onChange={(e) => handleSetQuantity(i, parseInt(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 py-1 px-2 text-s flex-1 text-wrap align-top">
                  <FaTimesCircle
                    size={24}
                    className="text-red-600 hover:text-red-500"
                    onClick={() => handleDeleteItem(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mb-2 block">
        <span className="text-gray-500 text-sm">Note: You can scan the item using QR Code Scanner in the app using the same account.</span>
      </div>
      <div className="flex flex-row flex-wrap gap-2 mb-5">
        <div className="min-w-[350px]">
          <Label className="mb-2" htmlFor="item" value="Item" />
          <ItemsDropdown value={item} setValue={setItem} excludedItems={excludedItems} />
        </div>
        <div className="min-w-[100px]">
          <Label className="mb-2" htmlFor="size" value="Size" />
          <Select id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            disabled={sizeOptions.length == 0}
          >
            {sizeOptions.map((size, i) => (
              <option key={i} value={size}>{size}</option>
            ))}
          </Select>
        </div>
        <div className="text-s w-[80px] px-2">
          <Label className="mb-2" value="Stock" />
          <p className="font-bold">{
            (item && item.itemSizes.length > 0) ? item.itemSizes.find(it => it.size == size)?.stock : item?.stock
          }</p>
        </div>
        <div className="max-w-[100px]">
          <Label className="mb-2" htmlFor="quantity" value="Quantity" />
          <TextInput
            type="number"
            min={1}
            max={maxStock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="flex-auto pt-[24px]">
          <Button onClick={handleAddItem}>Add</Button>
        </div>
      </div>
      <div className="my-2">
        <ErrorMessageAlert message={errorMessage} setMessage={setErrorMessage} timeout={5000} />
      </div>
    </div>
  );
}
