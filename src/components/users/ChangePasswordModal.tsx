
//ChangePasswordForm
'use client'

import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Modal, ModalBody, Spinner } from 'flowbite-react'
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'

const validationSchema = z.object({
  password: z.string().min(5),
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

interface ChangePasswordModalProps {
  adminId: string
  userId: string
  show: boolean
  setShow: (show: boolean) => void
  onChangePassword?: () => void
}

export default function ChangePasswordModal({ adminId, userId, show, setShow, onChangePassword }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async ({ password, newPassword }) => {
    setLoading(true)

    try {
      console.log({ password, newPassword })
      await serverFetch.put(`/users/${userId}/updatePasswordAdmin`, { adminId, password, newPassword })
      alert("Successfully saved data")
      if (onChangePassword) {
        onChangePassword()
      }
    } catch (error: any) {
      alert("Error saving data: " + getErrorMessage(error))
    }

    setLoading(false)
    setShow(false)
  }

  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>
        Change Password
      </Modal.Header>
      <ModalBody>
        <div className="flex flex-col items-center justify-between">
          <form className="flex max-w-md flex-col gap-4 justify-center" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your current admin password" />
              </div>
              <FormInput name="password" control={control} id="password" type="password" autoComplete="new-password" required shadow />
              {errors.password && (
                <p className="text-xs italic text-red-500 mt-2">
                  {errors.password?.message}
                </p>
              )}
            </div>
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
              <Button type="submit">Change password</Button>
            )}
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
