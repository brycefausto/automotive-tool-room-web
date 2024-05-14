'use client'

import { BorrowTransactionItem } from "@/models/transaction"
import { AppUser, UserRole } from "@/models/user"
import { useAppSelector } from "@/store"
import { getAppUser } from "@/store/reducers/user"
import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import _ from "lodash"
import { useRouter } from "next/navigation"
import { FormEventHandler, useEffect, useState } from "react"
import { FaTimesCircle } from "react-icons/fa"
import TransactionItemForm from "./TransactionItemForm"
import UserSubjectsDropdown from "./UserSubjectsDropdown"
import SelectUserInput from "./UsersDropdown"
import ErrorMessageAlert from "../alerts/ErrorMessageAlert"

export default function CreateTransactionForm() {
  const appUser = useAppSelector(getAppUser)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<AppUser>()
  const subjects = user && user.subjects ? user.subjects : []
  const [subjectId, setSubjectId] = useState('')
  const [groupNo, setGroupNo] = useState<string>('')
  const [member, setMember] = useState<string>('')
  const [members, setMembers] = useState<string[]>([])
  const [transactItems, setTransactItems] = useState<BorrowTransactionItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const isStudent = user?.role == UserRole.STUDENT
  const isNonStudent = [UserRole.PROFESSOR, UserRole.GUEST].includes(user?.role || UserRole.GUEST)

  useEffect(() => {
    setSubjectId(subjects.length > 0 ? subjects[0]._id : '')
  }, [user])

  const submitData = async () => {
    if (!user) {
      setErrorMessage("Please select a Borrower.")

      return
    }

    if (!transactItems.length) {
      setErrorMessage("Please add at least one item.")

      return
    }

    try {
      const data = {
        userId: user._id,
        subjectId,
        groupNo,
        members,
        items: transactItems.map(it => ({ itemId: it.item._id, ..._.pick(it, ['quantity', 'size', 'fillStatus']) })),
        approveUserId: appUser._id
      }

      await serverFetch.post('/transactions', data)
      alert("Successfully saved data")
      router.push("/transactions")
    } catch (error: any) {
      alert("Error saving data: " + getErrorMessage(error))
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)
    await submitData()
    setLoading(false)
  }

  const handleAddMember = () => {
    if (member && !members.some(it => it.match(member))) {
      const newMembers = members.slice()
      newMembers.push(member)
      setMembers(newMembers)
      setMember('')
    }
  }

  const handleChangeMember = (index: number, newValue: string) => {
    const newMembers = members.slice()
    newMembers[index] = newValue
    setMembers(newMembers)
  }

  const handleDeleteMember = (index: number) => {
    const newMembers = members.slice()
    newMembers.splice(index, 1)
    setMembers(newMembers)
  }

  const handleOnChangeTransactItems = (value: BorrowTransactionItem[]) => {
    setTransactItems(value)
  }

  return (
    <form className="flex max-w-lg flex-col gap-4" onSubmit={onSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="user" value="Select Borrower" />
        </div>
        <SelectUserInput value={user} onChange={setUser} />
      </div>
      {isNonStudent && (
        <div>
          <div className="mb-2 block">
            <Label value="Department" />
          </div>
          <span>
            {user && user.department ? user.department.name : ''}
          </span>
        </div>
      )}
      {isStudent && (
        <div>
          <div className="mb-2 block">
            <Label value="Section" />
          </div>
          <span>
            {user && user.section ? user.section.name : ''}
          </span>
        </div>
      )}
      <div>
        <div className="mb-2 block">
          <Label value="Student's Subject" />
        </div>
        <UserSubjectsDropdown value={subjectId} onChange={setSubjectId} options={user && user.subjects ? user.subjects : []} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="groupNo" value="Group No." />
        </div>
        <TextInput id="groupNo" value={groupNo} onChange={(e) => setGroupNo(e.target.value)} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="member" value="Add Group Members" />
        </div>
        <div className="flex flex-row gap-2 mb-2">
          <TextInput className="flex-1" id="member" value={member} onChange={(e) => setMember(e.target.value)} />
          <Button onClick={handleAddMember}>
            Add
          </Button>
        </div>
        {members.map((groupMember, i) => (
          <div key={i} className="flex flex-row gap-2 mb-2">
            <TextInput className="flex-1" value={groupMember} onChange={(e) => handleChangeMember(i, e.target.value)} />
            <div className="ml-2">
              <FaTimesCircle
                size={24}
                className="text-red-600 hover:text-red-500"
                onClick={() => handleDeleteMember(i)}
              />
            </div>
          </div>
        ))}
      </div>
      <TransactionItemForm value={transactItems} onChange={handleOnChangeTransactItems} />
      <div className="my-2">
        <ErrorMessageAlert message={errorMessage} setMessage={setErrorMessage} timeout={5000} />
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Button type="submit">Create transaction</Button>
      )}
    </form>
  );
}
