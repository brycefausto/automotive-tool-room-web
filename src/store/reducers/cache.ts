import { Chat } from '@/models/chat';
import { Item } from '@/models/item';
import { BorrowTransaction } from '@/models/transaction';
import { AppUser } from '@/models/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export interface CacheState {
  users: AppUser[],
  items: Item[],
  transactions: BorrowTransaction[],
  item: Item | null,
  transaction: BorrowTransaction | null,
  chats: Chat[]
}

const initialState: CacheState = {
  users: [],
  items: [],
  transactions: [],
  item: null,
  transaction: null,
  chats: []
}

export const findObjectById = <T>(id: string) => {
  return (object: T & { _id: string }) => {
    return object._id == id
  }
}

export const cacheSlice = createSlice({
  name: 'cacheState',
  initialState,
  reducers: {
    setAppUsers: (state, action: PayloadAction<AppUser[]>) => {
      state.users = action.payload
    },
    addAppUser: (state, action: PayloadAction<AppUser>) => {
      state.users.push(action.payload)
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload)
    },
    setTransactions: (state, action: PayloadAction<BorrowTransaction[]>) => {
      state.transactions = action.payload
    },
    addTransaction: (state, action: PayloadAction<BorrowTransaction>) => {
      state.transactions.push(action.payload)
    },
    setItem: (state, action: PayloadAction<Item>) => {
      state.item = action.payload
    },
    setTransaction: (state, action: PayloadAction<BorrowTransaction>) => {
      state.transaction = action.payload
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      console.log('set chats');
      state.chats = action.payload
    },
  },
  selectors: {
    getUsers: state => state.users,
    getUserById: (state, id: string) => _.find(state.users, findObjectById(id)),
    getItems: state => state.items,
    getItemById: (state, id: string) => _.find(state.items, findObjectById(id)),
    getTransactions: state => state.transactions,
    getTransactionById: (state, id: string) => _.find(state.users, findObjectById(id)),
    getItem: state => state.item,
    getTransaction: state => state.transaction,
    getChats: state => state.chats,
  }
})


export const cacheActions = cacheSlice.actions

export const cacheSelectors = cacheSlice.selectors


export default cacheSlice.reducer