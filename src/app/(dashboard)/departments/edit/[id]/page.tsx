import EditDepartmentPage from '@/components/departments/EditDepartmentPage'
import { ParamsWithId } from '@/types'

export default async function DepartmentEditPage({ params: { id } }: ParamsWithId) {
  return (
    <EditDepartmentPage id={id} />
  )
}
