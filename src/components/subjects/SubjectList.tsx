'use client';
import { PaginatedDocument } from '@/models';
import { Subject } from '@/models/subject';
import { useListenerSocket } from '@/socket/listenerSocket';
import serverFetch from '@/utils/serverFetch';
import { Button, Pagination, Table } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingComponent from '../LoadingComponent';
import DeleteButton from '../buttons/DeleteButton';
import EditButton from '../buttons/EditButton';
import SearchInput from '../forms/SearchInput';
import { useAlertModal } from '@/providers/AlertModalProvider';

export interface SubjectListProps {
  searchParam?: string
}

export default function SubjectList({ searchParam }: SubjectListProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter()
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { page: currentPage, search: searchQuery }
  const alertModal = useAlertModal()

  useListenerSocket<PaginatedDocument<Subject>>(
    'subjects', queryParams,
    (data) => {
      const subjects = data.docs
      setSubjects(subjects)
      setTotalPages(data.totalPages)
      setLoading(false)
    })

  const handleEdit = (id: string) => {
    router.push(`/subjects/edit/${id}`)
  }

  const handleDelete = async (subject: Subject) => {
    alertModal.showDeleteModal("subject", async () => {
      try {
        await serverFetch.delete(`/subjects/${subject._id}`)
        setCurrentPage(1)

        alert("Successfully deleted data!")
      } catch (error: any) {
        alert("Error deleting data: " + error.message)
      }
    })
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex p-5">
        <div className="flex">
          <span className="text-2xl font-bold">Subjects</span>
        </div>
        <div className="flex flex-auto">
        </div>
        <div className="mr-5">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Link href="/subjects/create">
          <Button className="justify-self-end">Add</Button>
        </Link>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Professor</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {subjects.map(subject => (
            <Table.Row key={subject._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {subject.name}
              </Table.Cell>
              <Table.Cell>{subject.professor}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-4">
                  <span>
                    <EditButton onClick={() => handleEdit(subject._id)} />
                  </span>
                  <span>
                    <DeleteButton onClick={() => handleDelete(subject)} />
                  </span>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {subjects.length == 0 && (
        <div className="flex justify-center p-10">
          <p className="text-gray-500 text-2xl">The list is empty.</p>
        </div>
      )}
      <div className="flex overflow-x-auto sm:justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
      </div>
    </div>
  )
}
