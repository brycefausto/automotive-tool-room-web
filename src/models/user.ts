import { Section } from "./section"
import { Subject } from "./subject"

export enum UserRole {
  ADMIN = 'admin',
  LAB_TECH = 'lab tech',
  STUDENT = 'student',
  GUEST = 'guest',
}

export interface AppUser {
  _id: string
  username: string
  email: string
  name: string
  studentId: string
  role: UserRole
  section?: Section
  subjects?: Subject[]
  phone?: string
  address?: string
  sessionToken?: string
  messagingTokens?: string[]
  createdAt: string
}
