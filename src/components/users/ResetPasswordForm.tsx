
'use client'

import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'

const validationSchema = z.object({
  newPassword: z.string().min(5),
  confirmPassword: z.string(),
}).refine(
  (values) => {
    return values.newPassword === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
)

type ValidationSchema = z.infer<typeof validationSchema>;

interface ResetPasswordFormProps {
  userId: string
  token: string,
}

export default function ResetPasswordForm({ userId, token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async ({ newPassword }) => {
    setLoading(true)

    try {
      await serverFetch.put(`/auth/resetPassword/${userId}`, { token, newPassword })
      alert("Successfully reset password")
    } catch (error: any) {
      alert("Error resetting password: " + getErrorMessage(error))
    }

    setLoading(false)
  }

  return (
    <form className="flex max-w-md flex-col gap-4 justify-center" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="newPassword" value="New password" />
        </div>
        <FormInput name="newPassword" control={control} id="newPassword" type="password" autoComplete="new-password" required shadow />
        {errors.newPassword && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.newPassword?.message}
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="confirm-password" value="Confirm new password" />
        </div>
        <FormInput name="confirmPassword" control={control} id="confirm-password" type="password" required shadow />
        {errors.confirmPassword && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Reset password</Button>
      )}
    </form>
  );
}
