'use client'

import { AppUser, UserRole } from "@/models/user"
import { useAppDispatch, useAppSelector } from "@/store"
import { PropsWithData, PropsWithId } from "@/types"
import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useEffect, useRef, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'
import FormSelect from "../forms/FormSelect"
import ChangePasswordModal from "./ChangePasswordModal"
import { getAppUser } from "@/store/reducers/user"
import { Section } from "@/models/section"
import { Subject } from "@/models/subject"
import SectionsDropdown from "./SectionsDropdown"
import SubjectsDropdown from "./SubjectsDropdown"
import useDataFetch from "@/hooks/dataFetch"
import Loader from "../Loader"

const validationSchema = z.object({
  username: z.string().min(3).max(30)
    .regex(/^(?=[a-zA-Z0-9._-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
      "Invalid username format. Must be alphanumeric, may contain underscore, no spaces."
    ),
  email: z.string().email(),
  name: z.string(),
  studentId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(UserRole)
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function EditUserForm({ data }: PropsWithData<AppUser>) {
  const dispatch = useAppDispatch()
  const appUser = useAppSelector(getAppUser)
  const editingUser = data
  const [loading, setLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const sectionRef = useRef<Section | undefined>(editingUser?.section)
  const subjectsRef = useRef<Subject[]>(editingUser && editingUser.subjects ? editingUser.subjects : [])

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      username: editingUser?.username || '',
      email: editingUser?.email || '',
      name: editingUser?.name || '',
      studentId: editingUser?.studentId || '',
      role: editingUser?.role || UserRole.STUDENT,
      phone: editingUser?.phone || '',
      address: editingUser?.address || '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)
    data.sectionId = sectionRef.current?._id
    data.subjectIds = subjectsRef.current.map(it => it._id)

    try {
      await serverFetch.put(`/users/${editingUser?._id}`, data)

      alert("Successfully saved data")
    } catch (error: any) {
      alert("Error saving data: " + getErrorMessage(error))
    }

    setLoading(false)
  }

  const handleSectionChange = (section: Section) => {
    sectionRef.current = section
  }

  const handleSubjectsChange = (subjects: Subject[]) => {
    subjectsRef.current = subjects
  }

  const isStudentOrGuest = [UserRole.STUDENT, UserRole.GUEST].includes(watch('role'))

  return (
    <>
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Your username" />
          </div>
          <FormInput name="username" control={control} id="username" type="text" required shadow />
          {errors.username && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.username?.message}
            </p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <FormInput name="email" control={control} id="email2" type="email" required shadow />
          {errors.email && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.email?.message}
            </p>
          )}
        </div>
        <div>
          <Button onClick={() => setShowPasswordModal(true)}>Change Password</Button>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name2" value="Name" />
          </div>
          <FormInput name="name" control={control} id="name2" required shadow />
          {errors.name && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="role" value="Select Role" />
          </div>
          <FormSelect name="role" control={control} id="role">
            <option value="guest">Guest</option>
            <option value="student">Student</option>
            <option value="lab tech">Lab Tech</option>
            <option value="admin">Admin</option>
          </FormSelect>
          {errors.role && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.role?.message}
            </p>
          )}
        </div>
        {isStudentOrGuest && (
          <div>
            <div className="mb-2 block">
              <Label htmlFor="studentId" value="Student ID" />
            </div>
            <FormInput name="studentId" control={control} id="studentId" shadow />
            {errors.studentId && (
              <p className="text-xs italic text-red-500 mt-2">
                {errors.studentId?.message}
              </p>
            )}
          </div>
        )}
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="sections" value="Select Section" />
          </div>
          <SectionsDropdown value={sectionRef.current} onChange={handleSectionChange} />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="subjects" value="Select Subjects" />
          </div>
          <SubjectsDropdown values={subjectsRef.current} onChange={handleSubjectsChange} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="phone" value="Phone" />
          </div>
          <FormInput name="phone" control={control} id="phone" shadow />
          {errors.phone && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.phone?.message}
            </p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="Address" />
          </div>
          <FormInput name="address" control={control} id="address" shadow />
          {errors.address && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.address?.message}
            </p>
          )}
        </div>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Button type="submit">Update user</Button>
        )}
      </form>
      {editingUser && (
        <ChangePasswordModal adminId={appUser._id} userId={editingUser._id} show={showPasswordModal} setShow={setShowPasswordModal} />
      )}
    </>
  );
}