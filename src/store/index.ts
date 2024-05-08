import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import userReducer from './reducers/user'
import cacheReducer from './reducers/cache'
import messagingReducer from './reducers/messaging'

export const store = configureStore({
  reducer: {
    userState: userReducer,
    cacheState: cacheReducer,
    messagingState: messagingReducer
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector