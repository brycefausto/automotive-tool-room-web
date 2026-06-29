import admin from 'firebase-admin'

declare global {
  var fbApp: admin.app.App | undefined;
}

declare module '*.css';