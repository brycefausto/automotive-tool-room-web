import { Department } from "./department"
import { Section } from "./section"
import { Subject } from "./subject"

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  PROFESSOR = 'professor',
  GUEST = 'guest',
}

export const UserRoleOptions = Object.entries(UserRole)
  .map(([label, value]) => ({ label, value }))

export interface AppUser {
  _id: string
  username: string
  email: string
  name: string
  idNumber: string
  role: UserRole
  section?: Section
  department?: Department
  subjects?: Subject[]
  phone?: string
  address?: string
  sessionToken?: string
  messagingTokens?: string[]
  createdAt: string
}
