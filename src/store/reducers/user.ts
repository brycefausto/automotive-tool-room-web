import { AppUser, UserRole } from '@/models/user';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user: AppUser;
}

const initialState: UserState = {
  user: {
    _id: '',
    email: '',
    name: '',
    username: '',
    studentId: '',
    role: UserRole.STUDENT,
    createdAt: ''
  }
}

export const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setAppUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload
    },
    removeAppUser: (state) => {
      state.user = initialState.user
    }
  },
  selectors: {
    getAppUser: state => state.user,
    getRole: state => state.user.role,
    hasUser: state => state.user._id !== '',
    isUserAdmin: state => state.user.role == UserRole.ADMIN
  }
})

export const { setAppUser, removeAppUser } = userSlice.actions

export const { getAppUser: getAppUser, getRole, isUserAdmin } = userSlice.selectors

export default userSlice.reducer