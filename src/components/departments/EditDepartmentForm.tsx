'use client'

import { Department } from "@/models/department"
import { PropsWithData } from "@/types"
import serverFetch from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'
import { useRouter } from "next/navigation"

const validationSchema = z.object({
  name: z.string(),
  professor: z.string()
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function EditDepartmentForm({ data }: PropsWithData<Department>) {
  const [editingDepartment, setEditingDepartment] = useState(data)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name: editingDepartment?.name || '',
    },
    resolver: zodResolver(validationSchema),
  });
  const id = data._id

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setLoading(true)

    try {
      await serverFetch.put(`/departments/${id}`, data)

      alert("Successfully saved data")
      router.back()
    } catch (error: any) {
      alert("Error saving data: " + error.message)
    }

    setLoading(false)
  }

  return (
    <form className="flex max-w-lg flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
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
        </div>
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Update department</Button>
      )}
    </form>
  );
}