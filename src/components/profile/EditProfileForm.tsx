'use client'

import { Department } from "@/models/department";
import { Section } from "@/models/section";
import { Subject } from "@/models/subject";
import { UserRole, UserRoleOptions } from "@/models/user";
import { useAppSelector } from "@/store";
import { getAppUser } from "@/store/reducers/user";
import serverFetch, { getErrorMessage } from "@/utils/serverFetch";
import { capitalizeWords } from "@/utils/stringUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner } from 'flowbite-react';
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import DepartmentsDropdown from "../dropdowns/DepartmentsDropdown";
import SectionsDropdown from "../dropdowns/SectionsDropdown";
import SubjectsDropdown from "../dropdowns/SubjectsDropdown";
import FormInput from '../forms/FormInput';
import FormSelect from "../forms/FormSelect";
import ChangePasswordModal from "../users/ChangePasswordModal";

const validationSchema = z.object({
  username: z.string().min(3).max(30)
    .regex(/^(?=[a-zA-Z0-9._-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
      "Invalid username format. Must be alphanumeric, may contain underscore, no spaces."
    ),
  email: z.string().email(),
  name: z.string(),
  idNumber: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(UserRole)
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function EditProfileForm() {
  const router = useRouter()
  const appUser = useAppSelector(getAppUser)
  const [loading, setLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const sectionRef = useRef<Section | undefined>(appUser?.section)
  const subjectsRef = useRef<Subject[]>(appUser && appUser.subjects ? appUser.subjects : [])
  const [department, setDepartment] = useState<Department | undefined>(appUser.department)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      username: appUser?.username || '',
      email: appUser?.email || '',
      name: appUser?.name || '',
      idNumber: appUser?.idNumber || '',
      role: appUser?.role || UserRole.STUDENT,
      phone: appUser?.phone || '',
      address: appUser?.address || '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)
    if (isStudent) {
      data.sectionId = sectionRef.current?._id
      data.subjectIds = subjectsRef.current.map(it => it._id)
    }
    data.departmentId = department?._id

    try {
      await serverFetch.put(`/users/${appUser?._id}`, data)
      router.push("/users")

      alert("Successfully saved data")
    } catch (error: any) {
      alert("Error saving data: " + getErrorMessage(error))
    }

    setLoading(false)
  }

  const handleSectionChange = (section: Section) => {
    sectionRef.current = section
    setDepartment(section.department)
  }


  const handleDepartmentChange = (department: Department) => {
    setDepartment(department)
  }

  const handleSubjectsChange = (subjects: Subject[]) => {
    subjectsRef.current = subjects
  }

  const isStudent = watch('role') == UserRole.STUDENT;
  const isProfOrGuest = [UserRole.PROFESSOR, UserRole.GUEST].includes(watch('role'));

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
            {UserRoleOptions.map(({ value }) => (
              <option key={value} value={value}>{capitalizeWords(value)}</option>
            ))}
          </FormSelect>
          {errors.role && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.role?.message}
            </p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="idNumber" value="ID Number" />
          </div>
          <FormInput name="idNumber" control={control} id="idNumber" shadow />
          {errors.idNumber && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.idNumber?.message}
            </p>
          )}
        </div>
        {isProfOrGuest && (
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="department" value="Select Department" />
            </div>
            <DepartmentsDropdown value={department} onChange={handleDepartmentChange} />
          </div>
        )}
        {isStudent && (
          <>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="section" value="Select Section" />
              </div>
              <SectionsDropdown value={sectionRef.current} onChange={handleSectionChange} />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="subjects" value="Select Subjects" />
              </div>
              <SubjectsDropdown values={subjectsRef.current} onChange={handleSubjectsChange} />
            </div>
          </>
        )}
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
          <Button type="submit">Update profile</Button>
        )}
      </form>
      <ChangePasswordModal adminId={appUser._id} userId={appUser._id} show={showPasswordModal} setShow={setShowPasswordModal} />
    </>
  );
}