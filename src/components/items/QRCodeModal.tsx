import { Item } from '@/models/item';
import { downloadElement, printElement } from '@/utils/htmlPrinter';
import { Button, Modal } from 'flowbite-react';
import QRCode from 'react-qr-code';
import slugify from 'slugify';

export interface QRCodeModalProps {
  show: boolean
  setShow: (show: boolean) => void
  item: Item
}

export default function QRCodeModal({ show, setShow, item }: QRCodeModalProps) {
  const handlePrint = () => {
    printElement("qrCode")
  }
  const handleDownload = () => {
    downloadElement("qrCode", slugify(item.name) + "_qr_code")
  }
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>
        QR Code
      </Modal.Header>
      <Modal.Body>
        <div className="flex gap-4 justify-items-center">
          <div>
            <div>
              <div className="mb-2 block">
                <span className="font-bold">Name: </span>
                <span>{item.name}</span>
              </div>
            </div>
            <div id="qrCode" className="border-2 border-gray-200 bg-white mb-2 w-fit p-4">
              <QRCode value={item._id} size={250} />
            </div>
            <div className="mb-2 flex flex-row">
              <Button className="mr-2" onClick={handlePrint}>Print</Button>
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
