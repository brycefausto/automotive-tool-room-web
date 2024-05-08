import { ItemSize } from '@/models/item'
import { useAlertModal } from '@/providers/AlertModalProvider'
import { Button, Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import ErrorMessageAlert from '../alerts/ErrorMessageAlert'

export interface ItemSizesFormProps {
  value?: ItemSize[],
  onChange?: (itemSizes: ItemSize[]) => void
}

export default function ItemSizesForm({ value, onChange }: ItemSizesFormProps) {
  const [size, setSize] = useState('')
  const [stock, setStock] = useState(1)
  const [itemSizes, setItemSizes] = useState<ItemSize[]>(value || [])
  const [errorMessage, setErrorMessage] = useState('')
  const alertModal = useAlertModal()

  const handleAddSize = () => {
    if (size && stock) {
      const existingSize = itemSizes.find(it => it.size == size)
      const newItemSizes = itemSizes.slice()

      if (existingSize) {
        existingSize.stock += stock
      } else {
        newItemSizes.push({
          size, stock
        })
      }
      setItemSizes(newItemSizes)
      setSize('')
      setStock(1)
      onChange?.(newItemSizes)
    } else {
      setErrorMessage("Size is required and stock should be greater than zero.")
    }
  }

  const handleChangeSize = (value: string, index: number) => {
    const newItemSizes = itemSizes.slice()
    newItemSizes[index].size = value
    setItemSizes(newItemSizes)
  }

  const handleChangeStock = (value: number, index: number) => {
    const newItemSizes = itemSizes.slice()
    newItemSizes[index].stock = value
    setItemSizes(newItemSizes)
    onChange?.(newItemSizes)
  }

  const handleDeleteSize = (index: number) => {
    alertModal.showDeleteModal("size", () => {
      const newItemSizes = itemSizes.slice()
      newItemSizes.splice(index, 1)
      setItemSizes(newItemSizes)
      onChange?.(newItemSizes)
    })
  }

  return (
    <div>
      <div className="mb-2 block">
        <Label value="Add Sizes" />
      </div>
      <div className="flex flex-row gap-2 mb-2">
        <div className="min-w-[350px]">
          <Label value="Size" htmlFor="size" />
        </div>
        <div className="max-w-[100px]">
          <Label value="Stock" htmlFor="stock" />
        </div>
      </div>
      <div className="flex flex-row gap-2 mb-2">
        <div className="min-w-[350px]">
          <TextInput id="size" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>
        <div className="max-w-[100px]">
          <TextInput
            id="stock"
            type="number"
            min={0}
            max={100}
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Button onClick={handleAddSize}>
            Add
          </Button>
        </div>
      </div>
      <div className="my-2">
       <ErrorMessageAlert message={errorMessage} setMessage={setErrorMessage} timeout={5000} />
      </div>
      {
        itemSizes.map((itemSize, i) => (
          <div key={i} className="flex flex-row gap-2 mb-2">
            <div className="text-s flex-1 text-wrap">
              {itemSize.size}
            </div>
            <div className="w-[80px]">
              <TextInput
                type="number"
                min={0}
                value={itemSize.stock}
                onChange={(e) => handleChangeStock(parseInt(e.target.value), i)}
              />
            </div>
            <div className="ml-2">
              <FaTimesCircle
                size={24}
                className="text-red-600 hover:text-red-500"
                onClick={() => handleDeleteSize(i)}
              />
            </div>
          </div>
        ))
      }
    </div>
  )
}
