import { serverFetcher } from '@/utils/serverFetch'
import useSwr from 'swr'

export default function useDataFetch<T = any>(url: string) {
  const res = useSwr<T>(url, serverFetcher, {
    revalidateOnMount: true,
    refreshWhenHidden: true
  })

  return res
}
