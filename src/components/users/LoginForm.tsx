'use client'

import { useAppDispatch } from '@/store'
import serverFetch, { getErrorMessage, setBearerToken } from '@/utils/serverFetch'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Label } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod'
import LoadingComponent from '../LoadingComponent'
import FormInput from '../forms/FormInput'
import { setAppUser } from '@/store/reducers/user'
import Link from 'next/link'

const validationSchema = z.object({
  username: z.string(),
  password: z.string().min(5)
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        await serverFetch.get('/')
      } catch (error) {
        console.log(error)
        alert(getErrorMessage(error))
      }
    })()
  }, [])

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
      const { data } = await serverFetch.post('/auth/adminLogin', formData)
      
      setBearerToken(data.access_token)
      dispatch(setAppUser(data.user))
      setLoading(false)

      router.push('/')
    } catch (error: any) {
      console.error(error)
      setLoading(false)
      alert(getErrorMessage(error))
    }
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username" value="Your username or email" />
        </div>
        <FormInput name="username" control={control} id="username" required shadow />
        {errors.username && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.username?.message}
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <FormInput name="password" control={control} id="password1" type="password" required shadow />
        {errors.password && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.password?.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <div>
        <p className="text-teal-500">
          <Link href="/forgotPassword">
            Forgot password?
          </Link>
        </p>
      </div>
      <Button type="submit" disabled={!errors}>Submit</Button>
    </form>
  )
}
