'use client'

import { Section } from "@/models/section"
import { PropsWithData } from "@/types"
import serverFetch from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'
import { useRouter } from "next/navigation"
import { Department } from "@/models/department"
import DepartmentsDropdown from "../dropdowns/DepartmentsDropdown"

const validationSchema = z.object({
  name: z.string(),
  professor: z.string()
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function EditSectionForm({ data }: PropsWithData<Section>) {
  const [editingSection, setEditingSection] = useState(data)
  const [loading, setLoading] = useState(false)
  const [department, setDepartment] = useState<Department | undefined>(editingSection.department);
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name: editingSection?.name || '',
      professor: editingSection?.professor || '',
    },
    resolver: zodResolver(validationSchema),
  });
  const id = data._id

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)

    data.departmentId = department?._id;

    try {
      await serverFetch.put(`/sections/${id}`, data)

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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="professor" value="Homeroom Professor" />
            </div>
            <FormInput name="professor" control={control} id="professor" required shadow />
            {errors.professor && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.professor?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="department" value="Department" />
            </div>
            <DepartmentsDropdown value={department} onChange={setDepartment} />
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Update section</Button>
      )}
    </form>
  );
}