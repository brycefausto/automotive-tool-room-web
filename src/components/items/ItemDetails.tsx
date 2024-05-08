'use client'
import { BASE_ITEMS_IMAGE_URL } from '@/globals';
import { Item } from '@/models/item';
import { PropsWithData } from '@/types';
import { convertLinebreaksText } from '@/utils';
import { Button, Table } from 'flowbite-react';
import { useState } from 'react';
import ImageHolder from '../ImageHolder';
import QRCodeModal from './QRCodeModal';

export default function ItemDetails({ data }: PropsWithData<Item>) {
  const item = data;
  const [showQRCode, setShowQRCode] = useState(false)

  const handleShowQRCode = () => {
    setShowQRCode(true)
  }

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 block">
            <span className="font-bold">Name: </span>
            <span>{item.name}</span>
          </div>
          <div className="mb-2 block">
            <span className="font-bold">Brand: </span>
            <span>{item.brand}</span>
          </div>
          <div className="mb-2 block">
            <span className="font-bold">Category: </span>
            <span>{item.category}</span>
          </div>
          <div className="mb-2 block">
            <span className="font-bold">Stock: </span>
            <span>{item.stock}</span>
          </div>
        </div>
        <div>
          <div className="border-2 border-gray-200 mb-2">
            <ImageHolder imageName={BASE_ITEMS_IMAGE_URL + item.image} width={250} height={250} className='h-250 w-250' />
          </div>
          <div className="mb-2 block">
            <Button onClick={handleShowQRCode}>Show QR Code</Button>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <span className="font-bold">Description: </span>
          <p>{convertLinebreaksText(item.description)}</p>
        </div>
      </div>
      {item.itemSizes.length > 0 && (
        <div>
          <div className="mb-2 block">
            <span className="font-bold">Sizes: </span>
          </div>
          <div className="mb-2 block">
            <Table className="w-[100%]">
              <Table.Head>
                <Table.HeadCell>
                  Name:
                </Table.HeadCell>
                <Table.HeadCell>
                  Stock:
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {item.itemSizes.map((it, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{it.size}</Table.Cell>
                    <Table.Cell>{it.stock}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      )}
      <QRCodeModal show={showQRCode} setShow={setShowQRCode} item={item} />
    </div>
  )
}
