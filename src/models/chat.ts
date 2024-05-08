import { AppUser } from "./user";

export interface Chat {
  _id: string
  users: AppUser[]
  lastMessage?: ChatMessage
  isNew?: boolean
}

export interface ChatMessage {
  _id: string
  chat: string
  user: AppUser
  message: string
  createdAt: string
}