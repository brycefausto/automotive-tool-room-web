'use client'
import { useAppDispatch, useAppSelector } from '@/store';
import { addNotifications, addPreviousNotifications, clearNotifications, getNotifications, removeNotification, setNotifications } from '@/store/reducers/messaging';
import { Badge, Button } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi2';
import NotificationItem from './NotificationItem';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import { getAppUser } from '@/store/reducers/user';
import { PaginatedDocument } from '@/models';
import { AppNotification } from '@/models/notification';

export default function NotificationBell() {
  const appUser = useAppSelector(getAppUser)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false)
  const appNotifications = useAppSelector(getNotifications)
  const dispatch = useAppDispatch()
  const divRef = useRef<any>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as any)) {
      setShow(false)
    }
  }

  const fetchNotifications = async (page: number) => {
    const { data } = await serverFetch.get<PaginatedDocument<AppNotification>>(`/messaging/notifications/${appUser._id}?page=${page}`)
    return data
  }

  const loadNotifications = async () => {
    const data = await fetchNotifications(currentPage)
    dispatch(setNotifications(data.docs))
    setTotalPages(data.totalPages)
  }

  const loadMoreNotifications = async () => {
    const newPage = currentPage + 1
    const data = await fetchNotifications(newPage)
    dispatch(addPreviousNotifications(data.docs))
    setCurrentPage(newPage)
  }

  useEffect(() => {
    if (appUser.loggedIn) {
      loadNotifications()
    }
  }, [appUser.loggedIn])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  useEffect(() => {
    if (appNotifications.length == 0) {
      setShow(false)
    }
  }, [appNotifications.length])

  const toggleShow = () => {
    setShow(!show)
  }

  const handleClearAll = async () => {
    try {
      await serverFetch.delete(`/messaging/notifications/all/${appUser._id}`)
      dispatch(clearNotifications())
    } catch (error) {
      getErrorMessage(error)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await serverFetch.delete(`/messaging/notifications/${id}`)
      dispatch(removeNotification(id))
    } catch (error) {
      getErrorMessage(error)
    }
  }

  const renderItem = (notification: AppNotification, index: number) => (
    <React.Fragment key={index}>
      <NotificationItem notification={notification} onRemove={handleRemove} />
    </React.Fragment>
  )

  return (
    <div className="mr-2" ref={divRef}>
      <Button color="light" className="mr-2" onClick={toggleShow}>
        <HiOutlineBell size={24} />
        {appNotifications.length > 0 && (
          <Badge className="absolute top-0 left-10 rounded-full">{appNotifications.length}</Badge>
        )}
      </Button>
      {show && (
        <div
          tabIndex={0}
          className="z-10 w-fit rounded divide-y divide-gray-100 shadow focus:outline-none transition-opacity duration-100 border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white mr-5"
          role="menu"
          aria-orientation="vertical"
          style={{ position: 'absolute', left: 0, top: 0, minWidth: '60px', transform: 'translate(1327px, 64px)' }}
        >
          {appNotifications.length > 0 ? (
            <>
              <div className="flex align-end justify-end p-2">
                <button className="text-blue-500 hover:text-blue-700 underline" onClick={handleClearAll}>Clear All</button>
              </div>
              <div className="overflow-y-auto max-h-[720px]">
                <div className="flex flex-col divide-y py-1">
                  {appNotifications.map(renderItem)}
                </div>
                {totalPages > 1 && currentPage < totalPages && (
                  <div className="p-2">
                    <button className="text-blue-500 hover:text-blue-700 underline" onClick={loadMoreNotifications}>View More</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex align-center justify-center p-2">
              <span className="text-gray-500">You have no notifications.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
