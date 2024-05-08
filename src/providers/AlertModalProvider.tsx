'use client'
import { DialogModal } from '@/components/modals/DialogModal'
import { MessageModal } from '@/components/modals/MessageModal'
import React, { PropsWithChildren, createContext, useContext, useState } from 'react'

export enum ModalType {
  MESSAGE, ERROR, DIALOG
}

export type ConfirmCallback = () => void | Promise<void>

export interface IAlertModalContext {
  show: boolean
  setShow: (showModal: boolean) => void,
  type: ModalType,
  setType: (type: ModalType) => void,
  setMessage: (message: string) => void,
  setOnConfirm: (callback: () => ConfirmCallback) => void 
}

export const AlertModalContext = createContext<IAlertModalContext>({
  show: false,
  setShow: (showModal: boolean) => {},
  type: ModalType.MESSAGE,
  setType: (type: ModalType) => {},
  setMessage: (message: string) => {},
  setOnConfirm: (callback: () => ConfirmCallback) => {},
})

export function useAlertModal() {
  const { show, setShow, setType, setMessage, setOnConfirm } = useContext(AlertModalContext)

  const close = () => {
    setShow(false)
    setType(ModalType.MESSAGE)
    setMessage('')
    setOnConfirm(() => () => {})
  }

  const showMessageModal = (message: string, callback: ConfirmCallback) => {
    setShow(true)
    setType(ModalType.MESSAGE)
    setMessage(message)
    setOnConfirm(() => callback)

    return { close }
  }

  const showDialogModal = (message: string, callback: ConfirmCallback) => {
    setShow(true)
    setType(ModalType.DIALOG)
    setMessage(message)
    setOnConfirm(() => callback)

    return { close }
  }

  const showDeleteModal = (dataName: string, callback: ConfirmCallback) => {
    const message = `Are you sure you want to delete this ${dataName || 'data'}?`

    return showDialogModal(message, callback)
  }

  return {
    showMessageModal,
    showDialogModal,
    showDeleteModal
  }
}

export default function AlertModalProvider({ children }: PropsWithChildren) {
  const [show, setShow] = useState(false)
  const [type, setType] = useState(ModalType.MESSAGE)
  const [message, setMessage] = useState('')
  const [onConfirm, setOnConfirm] = useState<ConfirmCallback>(() => () => {})

  const value = { show, setShow, type, setType, setMessage, setOnConfirm }

  const renderModal = () => {
    switch(type) {
      case ModalType.MESSAGE:
        return <MessageModal {...{show, setShow, message, onConfirm}} />
      case ModalType.DIALOG:
        return <DialogModal {...{show, setShow, message, onConfirm}} />
      default:
        return <></>
    }
  }

  return (
    <AlertModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </AlertModalContext.Provider>
  )
}
