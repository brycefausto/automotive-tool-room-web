import serverFetch from '@/utils/serverFetch';
import { useEffect, useState } from 'react';

export default function useDataFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    (async () => {
      try {
        const {data} = await serverFetch<T>(url);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error)
      }
    })()
  }, [])

  return { data, isLoading, error }
}
