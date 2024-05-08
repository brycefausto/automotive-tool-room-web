import { Chat } from '@/models/chat'
import { AppUser } from '@/models/user';
import { Avatar } from 'flowbite-react'
import Link from 'next/link';

export interface ChatItemProps {
  appUser: AppUser
  chat: Chat
  isSelected?: boolean
}

export default function ChatItem({ appUser, chat, isSelected }: ChatItemProps) {
  const users = chat.users.filter(user => user._id !== appUser._id);
  const usernames = users.length == 1 ? users[0].name : users.reduce((prev, user) => prev + ", " + user.name, "");
  const chatUserId = users.length > 0 ? users[0]._id : '';
  const selectedClass = isSelected || chat.isNew ? " border-l-4 border-blue-400": "";
  return (
    <Link href={`/chat/${chatUserId}`}>
      <div
        className={`flex flex-row py-4 px-2 justify-center items-center border-b-2${selectedClass}`}
      >
        <div className="w-1/4">
          {/* <img
          src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        /> */}
          <Avatar className="h-12 w-12" alt="User profile" img="/profile_placeholder.jpg" rounded/>
        </div>
        <div className="w-full">
          <div className="text-lg font-semibold">{usernames}</div>
          {chat.lastMessage && (
            <span className="text-gray-500">{chat.lastMessage.user.name + ": " + chat.lastMessage.message}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
