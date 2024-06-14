import { APK_URL } from '@/config/apk-url';
import { downloadElement, printElement } from '@/utils/htmlPrinter';
import { Button, Modal } from 'flowbite-react';
import QRCode from 'react-qr-code';
import { MdGetApp } from "react-icons/md";

export interface APKQRCodeModalProps {
  show: boolean
  setShow: (show: boolean) => void
}

export default function APKQRCodeModal({ show, setShow }: APKQRCodeModalProps) {
  const handlePrint = () => {
    printElement("qrCode")
  }
  const handleDownload = () => {
    downloadElement("qrCode", "APK_QR_CODE")
  }
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>
        App Download
      </Modal.Header>
      <Modal.Body>
        <div className="flex gap-4 justify-items-center">
          <div>
            <div className="mb-5">
              <a href={APK_URL} download={true}>
                <Button>
                  <MdGetApp className="mr-2" />
                  Download App
                </Button>
              </a>
            </div>
            <div>
              <div className="mb-2 block">
                <span className="font-bold">Scan App QR Code</span>
              </div>
            </div>
            <div id="qrCode" className="border-2 border-gray-200 bg-white mb-2 w-fit p-4">
              <QRCode value={APK_URL} size={250} />
            </div>
            <div className="mb-2 flex flex-row">
              <Button className="mr-2" onClick={handlePrint}>Print QR Code</Button>
              <Button className="mr-2" onClick={handleDownload}>Download QR Code</Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
