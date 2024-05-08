import CreateSubjectForm from '@/components/subjects/CreateSubjectForm'
import { Button } from 'flowbite-react'
import Link from 'next/link'

export default function SubjectCreatePage() {
  return (
    <div>
      <div className="flex p-5">
        <Link href="/subjects">
          <Button className="justify-self-start">Back</Button>
        </Link>
        <div className="flex flex-auto">
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col">
          <div className="mb-5">
            <span className="text-4xl font-bold">Create Subject</span>
          </div>
          <CreateSubjectForm />
        </div>
      </div>
    </div>
  )
}
