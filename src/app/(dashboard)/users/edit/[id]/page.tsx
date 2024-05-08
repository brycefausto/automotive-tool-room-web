import EditUserPage from '@/components/users/EditUserPage'
import { ParamsWithId } from '@/types'

export default async function UserEditPage({ params: { id } }: ParamsWithId) {
  return (
    <EditUserPage id={id} />
  )
}
