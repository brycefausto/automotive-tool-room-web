import { ChatMessage } from '@/models/chat'
import { AppUser } from '@/models/user'
import { Avatar } from 'flowbite-react'
import React from 'react'

export interface ChatMessageBubbleProps {
  appUser: AppUser
  chatMessage: ChatMessage
  prevUserId?: string
  dateString?: string
}

export default function ChatMessageBubble({ appUser, chatMessage, prevUserId, dateString }: ChatMessageBubbleProps) {
  const isSelf = appUser._id == chatMessage.user._id;
  const isNotPrevUser = chatMessage.user._id != prevUserId;

  if (isSelf) {
    return (
      <>
        {dateString && (
          <div className="align-self-center"><span>{dateString}</span></div>
        )}
        <div className="flex justify-end mb-4">
          <div
            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
          >
            {chatMessage.message}
          </div>
          <div className="h-10 w-10">
            {isNotPrevUser && (
              <Avatar alt="User profile" img="/profile_placeholder.jpg" rounded />
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {dateString && (
        <div className="align-self-center"><span>{dateString}</span></div>
      )}
      <div className="flex justify-start mb-4">
        {/* <img
        src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
        className="object-cover h-8 w-8 rounded-full"
        alt=""
      /> */}
        <div className="h-10 w-10">
          {isNotPrevUser && (
            <Avatar alt="User profile" img="/profile_placeholder.jpg" rounded />
          )}
        </div>
        <div
          className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
        >
          {chatMessage.message}
        </div>
      </div>
    </>
  )
}
