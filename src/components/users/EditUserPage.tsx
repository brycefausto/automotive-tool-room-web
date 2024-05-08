'use client'
import useDataFetch from '@/hooks/dataFetch'
import { AppUser } from '@/models/user'
import { PropsWithId } from '@/types'
import FormLayout from '../FormLayout'
import Loader from '../Loader'
import EditUserForm from './EditUserForm'

export default function EditUserPage({ id }: PropsWithId) {
  const { data, isLoading, error } = useDataFetch<AppUser>(`/users/${id}`)
  return (
    <Loader loading={isLoading} error={error}>
      <FormLayout title="Edit User" backUrl='/users'>
        <EditUserForm data={data as AppUser} />
      </FormLayout>
    </Loader>
  )
}
