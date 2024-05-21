'use client'
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { FIREBASE_APP } from "./firebase";

export const getFirebaseMessaging = async () => {
  const isBrowserSupported = await isSupported()
  
  if (isBrowserSupported) {
    return getMessaging(FIREBASE_APP)
  }
} 

export const getMessagingToken = async () => {
  const messaging = await getFirebaseMessaging()
  if (messaging) {
    try {
      const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY })

      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log('current token for client: ', currentToken)

        return currentToken
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...

      }
    } catch (error) {
      console.log('An error occurred while retrieving token. ', error);
    }
  }
}

export const onFirebaseMessage = (callback: (payloadData: any) => void) => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const messaging = getMessaging(FIREBASE_APP);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Push notification received:', payload);
      callback(payload.data);
    });
    return () => {
      unsubscribe(); // Unsubscribe from the onMessage event on cleanup
    };
  }

  return () => {}
}