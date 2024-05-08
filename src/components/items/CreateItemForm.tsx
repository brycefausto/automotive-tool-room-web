'use client'

import { BASE_ITEMS_IMAGE_FOLDER, BASE_ITEMS_IMAGE_URL } from "@/globals"
import { ItemSize } from "@/models/item"
import { convertLinebreaks } from "@/utils"
import { uploadImage } from "@/utils/imagekitLib"
import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useRouter } from "next/navigation"
import { useState } from "react"
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
  image: z.string().optional()
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function CreateItemForm() {
  const [loading, setLoading] = useState(false)
  const [itemSizes, setItemSizes] = useState<ItemSize[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchema>({
    defaultValues: {
      category: 'tool',
    },
    resolver: zodResolver(validationSchema),
  });

  const submitData = async (data: any) => {
    if (!itemSizes.length) {
      setErrorMessage('At least one size is required.')

      return
    }

    try {
      if (imageFile) {
        const result = await uploadImage(imageFile, BASE_ITEMS_IMAGE_FOLDER)
        data.image = result.name
      }

      data.description = convertLinebreaks(data.description)
      data.itemSizes = itemSizes

      await serverFetch.post('/items', data)
      alert("Successfully saved data")
      router.back()
    } catch (error: any) {
      alert("Error saving data: " + getErrorMessage(error))
    }
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)
    await submitData(data)
    setLoading(false)
  }

  const handleOnChangeItemSizes = (itemSizes: ItemSize[]) => {
    setItemSizes(itemSizes)
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
          <ImageSelector name="image" baseUrl={BASE_ITEMS_IMAGE_URL} onChangeFile={setImageFile} />
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
        <Button type="submit">Create item</Button>
      )}
    </form>
  );
}