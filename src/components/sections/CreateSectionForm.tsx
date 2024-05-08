'use client'

import serverFetch from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'

const validationSchema = z.object({
  name: z.string(),
  professor: z.string()
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function CreateSectionForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setLoading(true)

    try {
      await serverFetch.post('/sections', data)
      alert("Successfully saved data")
      router.push("/sections")
    } catch (error: any) {
      alert("Error saving data: " + error.message)
    }

    setLoading(false)
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
              <Label htmlFor="professor" value="Homeroom Professor" />
            </div>
            <FormInput name="professor" control={control} id="professor" required shadow />
            {errors.professor && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.professor?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Create section</Button>
      )}
    </form>
  );
}