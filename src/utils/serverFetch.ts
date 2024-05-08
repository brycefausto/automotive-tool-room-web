import axios from 'axios'
import { getStorageString, setStorageString } from '.'

export const getBearerToken = () => {
  return getStorageString('access_token')
}

const accessToken = getBearerToken()

const serverFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const serverFetcher = <T = any>(url: string) => serverFetch.get<T>(url).then(res => res.data)

export const setBearerToken = (token: string) => {
  serverFetch.defaults.headers.common.Authorization = "Bearer " + token
  setStorageString("access_token", token)
}

if (accessToken) {
  setBearerToken(accessToken)
}

export const getErrorMessage = (error: any) => {
  if (error.response) {
    return error.response.data.message
  } else {
    return error.message
  }
}

export default serverFetch
