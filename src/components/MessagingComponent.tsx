'use client'
import { onFirebaseMessage } from '@/config/firebase-messaging';
import useFcmToken from '@/hooks/fcmToken';
import { AppNotification } from '@/models/notification';
import { useAppDispatch, useAppSelector } from '@/store';
import { addNotification, getStoredToken, loadNotifications, setStoredToken } from '@/store/reducers/messaging';
import { getAppUser } from '@/store/reducers/user';
import serverFetch, { getErrorMessage } from '@/utils/serverFetch';
import { useEffect } from 'react';

export default function MessagingComponent() {
  const user = useAppSelector(getAppUser)
  const storedToken = useAppSelector(getStoredToken)
  const dispatch = useAppDispatch()
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  const registerToken = async (token: string) => {
    const tokens = user.messagingTokens || []

    if (storedToken && !tokens.includes(storedToken)) {
      try {
        console.log('registering token')
        await serverFetch.post(`/messaging/registerToken/${user._id}`, { token })
      } catch (error) {
        alert(getErrorMessage(error))
      }
    }
  }

  useEffect(() => {
    if (fcmToken) {
      console.log('fcmToken', fcmToken)
      dispatch(setStoredToken(fcmToken))
      registerToken(fcmToken)
    }
  }, [fcmToken])

  useEffect(() => {
    if (notificationPermissionStatus === 'granted') {
      dispatch(loadNotifications())
      const unsubscribe = onFirebaseMessage((payloadData) => {
        const notification: AppNotification = payloadData
        dispatch(addNotification(notification))
      })

      return unsubscribe
    }
  }, [notificationPermissionStatus]);

  return null; // This component is primarily for handling foreground notifications
}