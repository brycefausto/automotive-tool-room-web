import admin from 'firebase-admin'
import serviceAccount from '../../automotive-tool-room.json'
import { getAuth } from 'firebase-admin/auth';
import { initializeFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const app = global.fbApp || admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
}, 'automotive-tool-room');

if (!global.fbApp) {
  global.fbApp = app
}

export const fbAdminAuth = getAuth(app)

export const fbAdminDB = initializeFirestore(app);

export const fbMessaging = getMessaging(app)
