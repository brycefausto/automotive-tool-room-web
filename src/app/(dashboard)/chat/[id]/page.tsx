import ChatList from '@/components/chat/ChatList'
import { ParamsWithId } from '@/types'

export default async function UserChatPage({ params: { id } }: ParamsWithId) {
  return (
    <ChatList userId={id} />
  )
}
