import Loader from '@/components/Loader'
import { useState } from 'react'

export function useLoader(initialValue? : boolean) {
  const [loading, setLoading] = useState(initialValue != undefined ? initialValue : true)
  
  return { loading, setLoading, Loader }
}
