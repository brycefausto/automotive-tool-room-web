import EditSubjectPage from '@/components/subjects/EditSubjectPage'
import { ParamsWithId } from '@/types'

export default async function SubjectEditPage({ params: { id } }: ParamsWithId) {
  return (
    <EditSubjectPage id={id} />
  )
}
