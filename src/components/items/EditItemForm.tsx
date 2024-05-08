'use client'

import { BASE_ITEMS_IMAGE_FOLDER, BASE_ITEMS_IMAGE_URL } from "@/globals"
import { Item, ItemSize } from "@/models/item"
import { useAppDispatch } from "@/store"
import { PropsWithData } from "@/types"
import { convertLinebreaks, convertLinebreaksText } from "@/utils"
import { uploadImage } from "@/utils/imagekitLib"
import serverFetch from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios'
import { Button, Label, Spinner } from 'flowbite-react'
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import ImageSelector from "../ImageSelector"
import FormInput from '../forms/FormInput'
import FormSelect from "../forms/FormSelect"
import FormTextarea from "../forms/FormTextarea"
import ItemSizesForm from "./ItemSizesForm"
import ErrorMessageAlert from "../alerts/ErrorMessageAlert"

const validationSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.enum(['tool', 'consumable']),
  description: z.string(),
  image: z.string(),
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function EditItemForm({ data }: PropsWithData<Item>) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [editingItem, setEditingItem] = useState(data)
  const hasItemSizes = useMemo(() => data.itemSizes.length > 0, [data])
  const [itemSizes, setItemSizes] = useState<ItemSize[]>(data.itemSizes || [])
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name: editingItem?.name || '',
      brand: editingItem?.brand || '',
      category: editingItem?.category || 'tool',
      description: convertLinebreaksText(editingItem?.description || ''),
      image: editingItem?.image || '',
    },
    resolver: zodResolver(validationSchema),
  });
  const id = data._id

  const submitData = async (data: any) => {
    if (!itemSizes.length) {
      setErrorMessage('At least one size is required.')

      return
    }

    try {
      if (data.image != '' && imageFile) {
        await axios.delete(`/api/imagekit/delete/${data.image}`)
      }

      if (imageFile) {
        const result = await uploadImage(imageFile, BASE_ITEMS_IMAGE_FOLDER)
        data.image = result.name
      }

      data.description = convertLinebreaks(data.description)
      data.itemSizes = itemSizes

      await serverFetch.put(`/items/${id}`, data)
      router.back()

      alert("Successfully saved data")
    } catch (error: any) {
      alert("Error saving data: " + error.message)
    }
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)
    await submitData(data)
    setLoading(false)
  }

  const handleOnChangeItemSizes = (itemSizes: ItemSize[]) => {
    setItemSizes(itemSizes)

    console.log(itemSizes)
  }

  return (
    <form className="flex max-w-lg flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <FormInput name="name" control={control} id="name" required shadow />
            {errors.name && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="brand" value="Brand" />
            </div>
            <FormInput name="brand" control={control} id="brand" shadow />
            {errors.brand && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.brand?.message}
              </p>
            )}
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="category" value="Select Category" />
            </div>
            <FormSelect name="category" control={control} >
              <option value="tool">Tool</option>
              <option value="consumable">Consumable</option>
            </FormSelect>
            {errors.category && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.category?.message}
              </p>
            )}
          </div>
        </div>
        <div id="imageUpload" className="max-w-md">
          <ImageSelector name="image" baseUrl={BASE_ITEMS_IMAGE_URL} imageName={editingItem.image} onChangeFile={setImageFile} />
        </div>
      </div>
      <div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description" />
          </div>
          <FormTextarea name="description" control={control} id="description" rows={5} shadow />
          {errors.description && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.description?.message}
            </p>
          )}
        </div>
      </div>
      <ItemSizesForm value={itemSizes} onChange={handleOnChangeItemSizes} />
      <div className="my-2">
        <ErrorMessageAlert message={errorMessage} setMessage={setErrorMessage} timeout={5000} />
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Update item</Button>
      )}
    </form>
  );
}