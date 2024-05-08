'use client'

import { Section } from "@/models/section"
import { Subject } from "@/models/subject"
import { UserRole } from "@/models/user"
import serverFetch, { getErrorMessage } from "@/utils/serverFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Label, Spinner } from 'flowbite-react'
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../forms/FormInput'
import FormSelect from "../forms/FormSelect"
import SectionsDropdown from "./SectionsDropdown"
import SubjectsDropdown from "./SubjectsDropdown"

const validationSchema = z.object({
  username: z.string().min(3).max(30)
    .regex(/^(?=[a-zA-Z0-9._-]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
      "Invalid username format. Must be alphanumeric, may contain underscore, no spaces."
    ),
  email: z.string().email(),
  password: z.string().min(5),
  confirmPassword: z.string(),
  name: z.string(),
  studentId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(UserRole)
}).refine(
  (values) => {
    return values.password === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
)

type ValidationSchema = z.infer<typeof validationSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const sectionRef = useRef<Section>()
  const subjectsRef = useRef<Subject[]>([])
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      role: UserRole.STUDENT
    }
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data: any) => {
    setLoading(true)

    data.sectionId = sectionRef.current?._id
    data.subjectIds = subjectsRef.current.map(it => it._id)

    try {
      await serverFetch.post('/users', data)
      alert("Successfully saved data")
      router.push("/users")
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
    <form className="flex max-w-md flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="mb-2 block">
          <Label htmlFor="password2" value="Your password" />
        </div>
        <FormInput name="password" control={control} id="password2" type="password" autoComplete="new-password" required shadow />
        {errors.password && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.password?.message}
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="confirm-password" value="Confirm password" />
        </div>
        <FormInput name="confirmPassword" control={control} id="confirm-password" type="password" required shadow />
        {errors.confirmPassword && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name2" value="Your name" />
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
          <Label htmlFor="roles" value="Select Role" />
        </div>
        <FormSelect name="role" control={control}>
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
        <SectionsDropdown onChange={handleSectionChange} />
      </div>
      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="subjects" value="Select Subjects" />
        </div>
        <SubjectsDropdown onChange={handleSubjectsChange} />
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
        <Button type="submit">Register new user</Button>
      )}
    </form>
  );
}