import { AppNotification } from '@/store/reducers/messaging'
import React from 'react'
import { MdClose } from 'react-icons/md'

interface NotificationItemProps {
  notification: AppNotification
  onRemove: (id: string) => void
}

export default function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const handleRemove = (id: string) => {
    onRemove(id)
    console.log("remove notification: " + id)
  }
  return (
    <div>
      <div className="flex">
        <p className="text-lg">{notification.title}</p>
        <span className="flex-auto w-2"></span>
        <div 
          className="m-auto text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500"
          onClick={() => handleRemove(notification.id)}  
        >
          <MdClose size={15} />
          <span className="sr-only">Close</span>
        </div>
      </div>
      <p className='text-md'>{notification.body}</p>
    </div>
  )
}
