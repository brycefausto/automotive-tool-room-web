
'use client';

import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export interface DialogModalProps {
  show: boolean
  setShow: (show: boolean) => void
  message?: string
  onConfirm: () => void | Promise<void>
}

export function DialogModal({ show, setShow, message, onConfirm }: DialogModalProps) {
  const handleConfirm = () => {
    setShow(false)
    onConfirm()
  }

  return (
    <>
      <Modal dismissible show={show} size="md" onClose={() => setShow(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleConfirm}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setShow(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
