import ForgotPasswordForm from '@/components/users/ForgotPasswordForm'
import { Button } from 'flowbite-react'
import Link from 'next/link'

export default async function ForgotPasswordPage() {
  return (
    <div>
      <div className="flex p-5">
        <Link href="/login">
          <Button className="justify-self-start">Back</Button>
        </Link>
        <div className="flex flex-auto">
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[500px]">
          <div className="mb-5">
            <span className="text-4xl font-bold">Forgot Password</span>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
