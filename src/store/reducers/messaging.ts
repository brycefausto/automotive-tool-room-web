import { getStorageItem, setStorageItem } from "@/utils"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface AppNotification {
  id: string
  title: string
  body: string
}

export interface MessagingState {
  token?: string
  notifications: AppNotification[]
}

const initialState: MessagingState = {
  token: getStorageItem("token"),
  notifications: []
}

export const messagingSlice = createSlice({
  name: 'messagingState',
  initialState,
  reducers: {
    setStoredToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      setStorageItem("token", state.token)
    },
    addNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      for (let notification of action.payload) {
        if (!state.notifications.some(it => it.id == notification.id)) {
          state.notifications.push(notification)
        }
      }
      setStorageItem("notifications", state.notifications)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.notifications = state.notifications.filter(it => it.id !== id)
      setStorageItem("notifications", state.notifications)
    },
    clearNotifications: (state) => {
      state.notifications = []
      setStorageItem("notifications", state.notifications)
    },
  },
  selectors: {
    getStoredToken: state => state.token,
    getNotifications: state => state.notifications
  }
})

export const { setStoredToken, addNotifications, removeNotification, clearNotifications } = messagingSlice.actions

export const { getStoredToken, getNotifications } = messagingSlice.selectors

export default messagingSlice.reducer
