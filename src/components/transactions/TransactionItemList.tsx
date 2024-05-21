import { BASE_ITEMS_IMAGE_URL } from '@/globals';
import { BorrowTransactionItem } from '@/models/transaction';
import Image from 'next/image';

export interface TransactionItemListProps {
    transactionId: string
    items: BorrowTransactionItem[]
}

export default function TransactionItemList({ transactionId, items }: TransactionItemListProps) {
    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400 border border-gray-600 border-b-2">
                    <tr>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Item Name
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Image
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Size
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Qty
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Fill Status
                        </th>
                        <th scope="col" className="px-6 py-3 border border-gray-400">
                            Remarks
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-slate-100">
                    {items.map(transactItem => (
                        <tr key={transactionId + "_" + transactItem.item._id} className="border-b border-gray-800">
                            <td scope="row" className="px-6 py-4 border border-gray-400 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {transactItem.item.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                <Image src={BASE_ITEMS_IMAGE_URL + transactItem.item.image} alt='' width={80} height={80} />
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                {transactItem.item.category}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                {transactItem.size}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                {transactItem.quantity}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                {transactItem.fillStatus}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-gray-400">
                                {transactItem.remarks}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
