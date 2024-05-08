'use client'
import { PaginatedDocument } from '@/models'
import { Chat } from '@/models/chat'
import { AppUser } from '@/models/user'
import { useAlertModal } from '@/providers/AlertModalProvider'
import { useListenerSocket } from '@/socket/listenerSocket'
import { useAppSelector } from '@/store'
import { getAppUser } from '@/store/reducers/user'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Avatar } from 'flowbite-react'
import { useState } from 'react'
import ChatItem from './ChatItem'
import ChatMessagesBox from './ChatMessagesBox'
import Loader from '../Loader'
import { cacheActions, cacheSelectors } from '@/store/reducers/cache'
import { useDispatch } from 'react-redux'

export interface ChatListProps {
  userId?: string
}

export default function ChatList({ userId }: ChatListProps) {
  const appUser = useAppSelector(getAppUser);
  const chatsCache = useAppSelector(cacheSelectors.getChats);
  const dispatch = useDispatch();
  const [chats, setChats] = useState<Chat[]>(chatsCache);
  const [loading, setLoading] = useState(!chatsCache.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { userId: appUser._id, page: currentPage, search: searchQuery }
  const alertModal = useAlertModal();
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>();

  const loadChat = async () => {
    if (userId) {
      try {
        const { data: chatUser } = await serverFetch<AppUser>(`/users/${userId}`);

        if (chatUser) {
          let { data: chat } = await serverFetch<Chat | undefined>(`/chats/users?userId1=${appUser._id}&userId2=${userId}`)
          console.log({ chat })

          if (!chat) {
            chat = {
              _id: '',
              users: [appUser, chatUser],
              isNew: true
            }
          }

          setSelectedChat(chat);

          return chat
        }
      } catch (error) {
        alert(getErrorMessage(error))
      }
    }
  }

  useListenerSocket<PaginatedDocument<Chat>>(
    'chats', queryParams,
    async (data) => {
      const chats = data.docs

      if (!selectedChat) {
        const chat = await loadChat();

        if (chat && chat.isNew) {
          chats.unshift(chat);
        }
      }

      dispatch(cacheActions.setChats(chats))
      setChats(chats)
      setTotalPages(data.totalPages)
      setLoading(false)
    })

  const isChatItemSelected = (chat: Chat) => chat._id == selectedChat?._id

  return (
    <div className="container mx-auto shadow-lg rounded-lg">
      <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
        <div className="font-semibold text-2xl">Chat</div>
        <div className="w-1/2">
          {/* <input
            type="text"
            name=""
            id=""
            placeholder="search IRL"
            className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
          /> */}
        </div>
        {/* <div
          className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
        >
          RA
        </div> */}
        <Avatar alt="User settings" img="/profile_placeholder.jpg" rounded />
      </div>
      <div className="flex flex-row justify-between bg-white h-[650px] max-h-[650px]">
        <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
          <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="Search"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
            />
          </div>
          <Loader loading={loading}>
            {chats.map((chat, i) => (
              <ChatItem key={i} appUser={appUser} chat={chat} isSelected={isChatItemSelected(chat)} />
            ))}
          </Loader>
        </div>
        <div className="w-full px-5 flex flex-col justify-between">
          {selectedChat && (
            <ChatMessagesBox appUser={appUser} chat={selectedChat} setSelectedChat={setSelectedChat} />
          )}
        </div>
        {/* <div className="w-2/5 border-l-2 px-5">
          <div className="flex flex-col">
            <div className="font-semibold text-xl py-4">Mern Stack Group</div>
            <img
              src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
              className="object-cover rounded-xl h-64"
              alt=""
            />
            <div className="font-semibold py-4">Created 22 Sep 2021</div>
            <div className="font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
              perspiciatis!
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
