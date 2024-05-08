'use client'
import serverFetch from "@/utils/serverFetch"
import { convertToUrlParams } from "@/utils/stringUtils"
import _ from 'lodash'
import { useEffect, useRef } from 'react'
import { Socket, io } from 'socket.io-client'

const URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

export interface ConnectSocketParams {
  auth?: { [key: string]: any }
  query?: { [key: string]: any }
}

export interface QueryParams {
  page?: number
  $room?: string
  [key: string]: any
}

export const getSocket = (params?: ConnectSocketParams) => {
  const { auth, query } = params || {}
  return io(URL, { auth, query })
}

export type ListenerSocketCallback<T> = (data: T) => any | Promise<any>

export class ListenerSocket<T = any> {
  collection: string
  room: string
  queryParams: QueryParams
  socket: Socket
  callback: ListenerSocketCallback<T>

  constructor(collection: string, queryParams: QueryParams, callback: ListenerSocketCallback<T>) {
    this.collection = collection
    this.queryParams = _.omit(_.pickBy(queryParams, _.identity), ['$room'])
    this.callback = callback
    this.room = queryParams.$room ? queryParams.$room : collection
    this.socket = getSocket({ query: { room: this.room } })
  }

  async fetchData() {
    try {
      console.log("fetching data...")
      let url = `/${this.collection}`

      if (Object.keys(this.queryParams).length > 0) {
        const urlParams = convertToUrlParams(this.queryParams)
        
        url += `?${urlParams}`
      }

      const { data } = await serverFetch.get<T>(url)

      this.callback(data)
    } catch (error: any) {
      alert(error.message)
    }
  }

  connect() {
    this.socket.connect()
    this.socket.on('connect', async () => {
      console.log('connect')
      this.fetchData()
    })

    this.socket.on(this.room, async () => {
      console.log(this.room)
      this.fetchData()
    })

    this.socket.on('disconnect', () => {
      console.log('disconnected')
    })

    return this.socket
  }

  setQueryParams(queryParams: QueryParams) {
    queryParams = _.pickBy(queryParams, _.identity)

    if (_.isEqual(this.queryParams, queryParams) == false) {
      this.queryParams = queryParams
      this.fetchData()
    }
  }

  disconnect() {
    this.socket.disconnect()
    console.log('socket disconnected')
  }
}

export const useListenerSocket = <T = any>(collection: string, queryParams: QueryParams, callback: ListenerSocketCallback<T>) => {
  const socketRef = useRef<ListenerSocket<T>>()

  useEffect(() => {
    const socket = new ListenerSocket<T>(collection, queryParams, callback)
    socket.connect()
    socketRef.current = socket

    return () => socket.disconnect()
  }, [])

  const setQueryParams = (queryParams: QueryParams) => {
    socketRef.current?.setQueryParams(queryParams)
  }

  useEffect(() => {
    setQueryParams(queryParams)
  }, [queryParams])

  return { setQueryParams }
}
