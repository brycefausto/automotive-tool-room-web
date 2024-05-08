'use client'

import serverFetch from '@/utils/serverFetch'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod'
import LoadingComponent from '../LoadingComponent'
import FormInput from '../forms/FormInput'

const validationSchema = z.object({
  email: z.string().email()
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (formData, e) => {
    try {
      setLoading(true);
      await serverFetch.post('/auth/requestResetPassword', formData)
      
      alert("A request to reset password is sent to your email.")
      setLoading(false)

      router.push('/login')
    } catch (error: any) {
      console.error(error)
      setLoading(false)
      alert(error.message)
    }
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Enter your email to request reset password" />
        </div>
        <FormInput name="email" control={control} id="email" type="email" required shadow />
        {errors.email && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.email?.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={!errors}>Submit</Button>
    </form>
  )
}
