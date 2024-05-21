export interface AppNotificationData {
  dataType: string
  dataId: string
}

export interface AppNotification {
  _id: string
  title: string
  body: string
  data?: AppNotificationData
}