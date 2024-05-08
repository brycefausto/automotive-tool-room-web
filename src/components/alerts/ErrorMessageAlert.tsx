import { Alert } from 'flowbite-react'
import React, { useEffect } from 'react'
import { HiInformationCircle } from 'react-icons/hi2'

export interface ErrorMessageAlertProps {
  message: string
  setMessage: (messsage: string) => void
  timeout?: number
}

export default function ErrorMessageAlert({ message, setMessage, timeout }: ErrorMessageAlertProps) {
  const handleOnDismiss = () => {
    setMessage('')
  }

  useEffect(() => {
    if (timeout) {
      if (message) {
        setTimeout(() => {
          setMessage('')
        }, timeout)
      }
    }
  }, [message])


  if (!message) {
    return <></>
  }

  return (
    <Alert color="failure" icon={HiInformationCircle} onDismiss={handleOnDismiss}>
      <span>{message}</span>
    </Alert>
  )
}
