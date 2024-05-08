'use client'
import { useAppDispatch, useAppSelector } from '@/store';
import { AppNotification, getNotifications, removeNotification } from '@/store/reducers/messaging';
import { Badge, Button, Dropdown } from 'flowbite-react';
import React, { useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi2';
import NotificationItem from './NotificationItem';

export default function NotificationBell() {
  const appNotifications = useAppSelector(getNotifications)
  const dispatch = useAppDispatch()

  useEffect(() => {
  }, [])

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id))
  }

  const renderItem = (notification: AppNotification) => (
    <React.Fragment key={notification.id}>
      <Dropdown.Item>
        <NotificationItem notification={notification} onRemove={handleRemove} />
      </Dropdown.Item>
      <Dropdown.Divider />
    </React.Fragment>
  )

  return (
    <Dropdown
      className="mr-5"
      arrowIcon={false}
      inline
      dismissOnClick={false}
      label={
        <Button as="div" color="light" className="mr-5">
          <HiOutlineBell size={24} />
          {appNotifications.length > 0 && (
            <Badge className="absolute top-0 left-10 rounded-full">{appNotifications.length}</Badge>
          )}
        </Button>
      }
    >
      {appNotifications.map(renderItem)}
    </Dropdown>
  )
}
