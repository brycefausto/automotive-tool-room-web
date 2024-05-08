'use client'
import { PaginatedDocument } from '@/models'
import { AppUser } from '@/models/user'
import { useAlertModal } from '@/providers/AlertModalProvider'
import { useListenerSocket } from '@/socket/listenerSocket'
import { useAppDispatch, useAppSelector } from '@/store'
import { cacheActions } from '@/store/reducers/cache'
import { getAppUser } from '@/store/reducers/user'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Button, Pagination, Table } from 'flowbite-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoadingComponent from '../LoadingComponent'
import ChatButton from '../buttons/ChatButton'
import DeleteButton from '../buttons/DeleteButton'
import DetailsButton from '../buttons/DetailsButton'
import EditButton from '../buttons/EditButton'
import SearchInput from '../forms/SearchInput'
import UserDetailsModal from './UserDetailsModal'
import _ from 'lodash'

export default function UserList() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter()
  const appUser = useAppSelector(getAppUser)
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isSelf = (id: string) => {
    return appUser._id == id
  }
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { page: currentPage, search: searchQuery }
  const alertModal = useAlertModal();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>();

  useListenerSocket<PaginatedDocument<AppUser>>(
    'users', queryParams,
    (data) => {
      const users = data.docs
      dispatch(cacheActions.setAppUsers(users))
      setUsers(users)
      setTotalPages(data.totalPages)
      setLoading(false)
    })

  const handleEdit = (id: string) => {
    router.push(`/users/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    alertModal.showDeleteModal("user", async () => {
      try {
        await serverFetch.delete(`/users/${id}`)
        setCurrentPage(1)

        alert("Successfully deleted data!")
      } catch (error: any) {
        alert("Error deleting data: " + getErrorMessage(error))
      }
    })
  }

  const handleOpenDetails = (user: AppUser) => {
    setSelectedUser(user);
    setShowModal(true);
  }

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setShowModal(false);
  }

  const handleMessage = (user: AppUser) => {
    alertModal.showMessageModal(`Chat with ${user.name}?`, () => {
      router.push(`/chat/${user._id}`);
    })
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex p-5">
        <div className="flex">
          <span className="text-2xl font-bold">Users</span>
        </div>
        <div className="flex flex-auto">
        </div>
        <div className="mr-5">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Link href="/users/create">
          <Button className="justify-self-end">Add</Button>
        </Link>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map(user => (
            <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.name}
                <div className="float-right flex flex-row">
                  <DetailsButton className="mr-2" onClick={() => handleOpenDetails(user)} />
                  {!isSelf(user._id) && (
                    <ChatButton userFullName={user.name} onClick={() => handleMessage(user)} />
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>{user.phone}</Table.Cell>
              <Table.Cell>{user.address}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-4">
                  <span>
                    <EditButton onClick={() => handleEdit(user._id)} />
                  </span>
                  <span>
                    {isSelf(user._id) ? (
                      <DeleteButton disabled tooltipContent="Cannot delete currently logged in user." />
                    ) : (
                      <DeleteButton onClick={() => handleDelete(user._id)} />
                    )}
                  </span>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {users.length == 0 && (
        <div className="flex justify-center p-10">
          <p className="text-gray-500 text-2xl">The list is empty.</p>
        </div>
      )}
      <div className="flex overflow-x-auto sm:justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
      </div>
      {selectedUser && (
        <UserDetailsModal
          show={showModal}
          setShow={setShowModal}
          onClose={handleCloseDetails}
          user={selectedUser}
        />
      )}
    </div>
  )
}
