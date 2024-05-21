'use client'
import { getFirebaseMessaging } from '@/config/firebase-messaging';
import { getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';

const useFcmToken = () => {
  const [fcmToken, setFCMToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = await getFirebaseMessaging();

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted' && messaging) {
            const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY })
            if (currentToken) {
              setFCMToken(currentToken);
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }
        }
      } catch (error) {
        console.log('Error retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken, notificationPermissionStatus };
};

export default useFcmToken;