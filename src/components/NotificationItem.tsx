import { AppNotification } from '@/models/notification'
import { useRouter } from 'next/navigation'
import { MdClose } from 'react-icons/md'

interface NotificationItemProps {
  notification: AppNotification
  onRemove: (id: string) => void
}

export default function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const router = useRouter()
  const handleRemove = (id: string) => {
    onRemove(id)
  }

  const handleClick = (notification: AppNotification) => {
    console.log("notification clicked", notification)
    const { dataType, dataId } = notification.data || {}
    if (dataType) {
      if (['users', 'transactions', 'chats'].includes(dataType)) {
        const routerLink = `/${dataType}` + (dataId && dataType !== 'transactions' ? `/${dataId}` : '')
        router.push(routerLink)
        onRemove(notification._id)
      }
    }
  }
  return (
    <div className="max-w-[250px] text-start py-2 px-5" onClick={() => handleClick(notification)}>
      <div className="flex">
        <p className="text-md font-bold">{notification.title}</p>
        <div className="flex flex-1 align-end justify-end">
          <div
            className="w-[20px] h-[20px] text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500"
            onClick={() => handleRemove(notification._id)}
          >
            <MdClose size={10} />
            <span className="sr-only">Close</span>
          </div>
        </div>
      </div>
      <p className='mt-1 text-sm'>{notification.body}</p>
    </div>
  )
}
