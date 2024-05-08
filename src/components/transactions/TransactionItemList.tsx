import { BASE_ITEMS_IMAGE_URL } from '@/globals';
import { BorrowTransactionItem } from '@/models/transaction';
import { capitalizeWords } from '@/utils/stringUtils';
import { Table } from 'flowbite-react';
import Image from 'next/image';

export interface TransactionItemListProps {
    transactionId: string
    items: BorrowTransactionItem[]
}

export default function TransactionItemList({ transactionId, items }: TransactionItemListProps) {
    return (
        <Table>
            <Table.Head>
                <Table.HeadCell>Item Name</Table.HeadCell>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Size</Table.HeadCell>
                <Table.HeadCell>Quantity</Table.HeadCell>
                <Table.HeadCell>Fill Status</Table.HeadCell>
                <Table.HeadCell>Remarks</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {items.map(transactItem => (
                    <Table.Row key={transactionId + "_" + transactItem.item._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="font-medium text-gray-900 dark:text-white min-w-[250px] w-[250px] max-w-[250px]">
                            {transactItem.item.name}
                        </Table.Cell>
                        <Table.Cell>
                            <Image src={BASE_ITEMS_IMAGE_URL + transactItem.item.image} alt='' width={80} height={80} />
                        </Table.Cell>
                        <Table.Cell>{transactItem.item.category}</Table.Cell>
                        <Table.Cell>{transactItem.size}</Table.Cell>
                        <Table.Cell>{transactItem.quantity}</Table.Cell>
                        <Table.Cell>{transactItem.fillStatus}</Table.Cell>
                        <Table.Cell>{transactItem.remarks}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
