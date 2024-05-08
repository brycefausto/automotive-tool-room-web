import ResetPasswordForm from '@/components/users/ResetPasswordForm'
import { ParamsWithId } from '@/types'
import { Button } from 'flowbite-react'
import Link from 'next/link'

export interface ResetPasswordPageProps extends ParamsWithId {
  searchParams: { 
    token: string
  }
}

export default function ResetPasswordPage({ params: { id }, searchParams: { token } }: ResetPasswordPageProps) {
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
            <span className="text-4xl font-bold">Reset Password</span>
          </div>
          <ResetPasswordForm userId={id} token={token} />
        </div>
      </div>
    </div>
  )
}
