import { Chat, ChatMessage } from '@/models/chat'
import { AppUser } from '@/models/user'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Button, TextInput } from 'flowbite-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChatMessagesList from './ChatMessagesList'
import { getSocket } from '@/socket/listenerSocket'
import { PaginatedDocument } from '@/models'
import _ from 'lodash'
import Loader from '../Loader'

export interface ChatMessagesBoxProps {
  appUser: AppUser
  chat: Chat
  setSelectedChat: (chat: Chat) => void
}

export default function ChatMessagesBox({ appUser, chat, setSelectedChat }: ChatMessagesBoxProps) {
  const chatName = useMemo(() => {
    const chatUsers = chat.users.filter(user => user._id !== appUser._id);
    return chatUsers.map(user => user.name).join(', ');
  }, [chat, appUser._id])
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(!chat.isNew);
  const [topLoading, setTopLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
  const messagesRef = useRef<ChatMessage[]>([]);
  const messageBoxRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageBoxRef.current?.scrollIntoView(false);
  }

  const loadMessages = async () => {
    try {
      const { data } = await serverFetch<PaginatedDocument<ChatMessage>>(
        `chats/messages/${chat._id}`);
      const chatMessages = data.docs;

      setMessages(chatMessages);
      setTotalPages(data.totalPages);
      setLoading(false);
      messagesRef.current = chatMessages;
      scrollToBottom();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  }

  const loadTopMessages = async () => {
    try {
      const page = currentPage + 1;

      if (page <= totalPages && currentPage <= 10) {
        setTopLoading(true);
        const { data } = await serverFetch<PaginatedDocument<ChatMessage>>(
          `chats/messages/${chat._id}?page=${currentPage}`);
        const chatMessages = [...data.docs, ...messages];
        setCurrentPage(page);
        setMessages(chatMessages);
        messagesRef.current = chatMessages;
        setTopLoading(false);
      }
    } catch (error) {
      alert(getErrorMessage(error));
    }
  }

  useEffect(() => {
    if (!chat.isNew) {
      loadMessages();
    }
  });

  useEffect(() => {
    if (!chat.isNew) {
      const socket = getSocket({ query: { room: chat._id } });

      socket.on("chatMessage", (data: ChatMessage) => {
        const newMessages = [...messagesRef.current, data];
        setMessages(newMessages);
        messagesRef.current = newMessages;
        setTimeout(scrollToBottom, 5);
      });

      return () => {
        socket.disconnect();
      }
    }
  }, [chat])

  const handleScroll: React.UIEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    if (currentTarget.scrollTop == 0 && !loading) {
      loadTopMessages();
    }
  }

  const sendMessage = async () => {
    if (inputMessage) {
      try {
        let selectedChat = chat;

        if (chat.isNew) {
          const userIds = chat.users.map(user => user._id);
          const { data: newChat } = await serverFetch.post<Chat>(`/chats`, { userIds });
          selectedChat = newChat;
          setSelectedChat(newChat);
        }

        await serverFetch.post<Chat>(`/chats/messages`, { chatId: selectedChat._id, userId: appUser._id, message: inputMessage });
        setInputMessage('');
        scrollToBottom();
      } catch (error) {
        alert(getErrorMessage(error));
      }
    }
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const handleClickSend = () => {
    sendMessage();
  }

  return (
    <>
      <div className="flex flex-col mt-5">
        <span className="text-lg font-bold">{chatName}</span>
      </div>
      <div className="flex flex-col mt-5 content-start max-h-[500px] overflow-y-scroll" onScroll={handleScroll}>
        {!chat.isNew && (
          <Loader loading={loading}>
            <div className="h-[500px]">
              <div>
                <Loader loading={topLoading}></Loader>
              </div>
              <ChatMessagesList appUser={appUser} messages={messages} />
              <div ref={(ref) => messageBoxRef.current = ref}></div>
            </div>
          </Loader>
        )}
      </div>
      <div className="py-5 flex flex-row gap-2">
        <TextInput
          className="w-full"
          type="text"
          placeholder="Type your message here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <Button onClick={handleClickSend}>Send</Button>
      </div>
    </>
  )
}
