import { AppNotification } from "@/models/notification"
import { getStorageItem, getStorageString, setStorageItem, setStorageString } from "@/utils"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"

export interface MessagingState {
  token?: string | null
  notifications: AppNotification[]
}

const initialState: MessagingState = {
  token: getStorageString("messagingToken"),
  notifications: []
}

export const messagingSlice = createSlice({
  name: 'messagingState',
  initialState,
  reducers: {
    setStoredToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      setStorageString("messagingToken", state.token)
    },
    loadNotifications: (state) => {
      state.notifications = getStorageItem("notifications") || []
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const notification = action.payload
      state.notifications.unshift(notification)
      state.notifications = _.uniqBy(state.notifications, '_id')
      setStorageItem("notifications", state.notifications)
    },
    addNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      for (let notification of action.payload) {
        state.notifications.unshift(notification)
      }
      state.notifications = _.uniqBy(state.notifications, '_id')
      setStorageItem("notifications", state.notifications)
    },
    addPreviousNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      for (let notification of action.payload) {
        state.notifications.push(notification)
      }
      state.notifications = _.uniqBy(state.notifications, '_id')
      setStorageItem("notifications", state.notifications)
    },
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload
      setStorageItem("notifications", state.notifications)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.notifications = state.notifications.filter(it => it._id !== id)
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

export const { setStoredToken, loadNotifications, addNotification, addNotifications, addPreviousNotifications, setNotifications, removeNotification, clearNotifications } = messagingSlice.actions

export const { getStoredToken, getNotifications } = messagingSlice.selectors

export default messagingSlice.reducer
