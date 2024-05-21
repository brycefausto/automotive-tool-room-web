// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW7sT4ZqvsIfl2mVpCT2FmPpF_NDjTXjk",
  authDomain: "automotive-tool-room.firebaseapp.com",
  projectId: "automotive-tool-room",
  storageBucket: "automotive-tool-room.appspot.com",
  messagingSenderId: "739664850711",
  appId: "1:739664850711:web:5875119ee1ae68384f9152",
  measurementId: "G-ZW4PR48621"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

console.log('[firebase-messaging-sw.js] running...');

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const { title, body, image, icon, ...restPayload } = payload.data;
  const notificationOptions = {
    body,
    icon: image || '/TUP LOGO.png',
    data: restPayload,
  };
  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  if (event?.notification?.data && event?.notification?.data?.link) {
    const link = event.notification.data.link
    event.waitUntil(
      clients.matchAll({
        type: 'window',
      })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (const client of windowClients) {
            if (client.url === link && 'focus' in client) {
              return client.focus();
            }
          }
          // If not, open a new window/tab with the target URL
          if (clients.openWindow) {
            return clients.openWindow(link);
          }
        })
    );
  }

  // close notification after click
  event.notification.close();
});