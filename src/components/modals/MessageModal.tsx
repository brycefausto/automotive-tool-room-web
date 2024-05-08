
'use client';

import { Button, Modal } from 'flowbite-react';

export interface MessageModalProps {
  show: boolean
  setShow: (show: boolean) => void
  message?: string
  onConfirm: () => void | Promise<void>
}

export function MessageModal({ show, setShow, message, onConfirm }: MessageModalProps) {
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
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={handleConfirm}>
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
