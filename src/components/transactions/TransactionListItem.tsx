import { BorrowTransaction, BorrowTransactionStatus } from '@/models/transaction'
import { useAppSelector } from '@/store'
import { getAppUser } from '@/store/reducers/user'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Button, Table } from 'flowbite-react'
import React from 'react'
import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa"
import { MdAssignmentReturned, MdAssignmentLate } from "react-icons/md"
import DetailsButton from '../buttons/DetailsButton'
import TransactionItemList from './TransactionItemList'
import { useAlertModal } from '@/providers/AlertModalProvider'
import EditButton from '../buttons/EditButton'

export interface TransactionListItemProps {
    transaction: BorrowTransaction
    onClickDetails: (transaction: BorrowTransaction) => void | Promise<void>
    onClickEdit: (transaction: BorrowTransaction) => void | Promise<void>
    onClickReturn: (transaction: BorrowTransaction) => void
    onSetPage: (page: number) => void
}

export default function TransactionListItem({ transaction, onClickDetails, onClickEdit, onClickReturn, onSetPage }: TransactionListItemProps) {
    const user = useAppSelector(getAppUser);
    const alertModal = useAlertModal()

    const renderStatusIcon = () => {
        switch (transaction.status) {
            case BorrowTransactionStatus.RESERVED:
                return <FaCalendarCheck size={24} color="gray" />
            case BorrowTransactionStatus.APPROVED:
                return <FaCheckCircle size={24} color="green" />
            case BorrowTransactionStatus.RETURNED:
                return <MdAssignmentReturned size={24} color="blue" />
            case BorrowTransactionStatus.NOT_RETURNED:
                return <MdAssignmentLate size={24} color="red" />
        }
    }

    const handleApprove = async () => {
        if (confirm("Approve transaction")) {
            try {
                await serverFetch.put(`/transactions/approve/${transaction._id}`)
            } catch (error: any) {
                alert(getErrorMessage(error));
            }
        }
    }

    const handleCancelTransaction = () => {
        alertModal.showDialogModal("Cancel this transaction?", async () => {
            try {
                await serverFetch.delete(`/transactions/${transaction._id}`)
                onSetPage(1)
            } catch (error: any) {
                alert(getErrorMessage(error));
            }
        })
    }

    return (
        <React.Fragment>
            <tr className="border-b border-gray-800">
                <td className="px-6 py-4 border border-gray-400 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span>{transaction.borrowedAtString || transaction.createdAtString}</span>
                    <div className="float-right">
                        <DetailsButton onClick={() => onClickDetails(transaction)} />
                    </div>
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.user.name}
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    <span>
                        {transaction.statusString}
                        <span className="m-5">
                            {renderStatusIcon()}
                        </span>
                    </span>
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.total}
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.approveUser?.name}
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.returnedAtString}
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.returnUser?.name}
                </td>
                <td className="px-6 py-4 border border-gray-400">
                    {transaction.status == BorrowTransactionStatus.RESERVED
                        && <Button
                            className="mr-3 mb-2 bg-green-400"
                            color="success"
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>}
                    {[BorrowTransactionStatus.APPROVED, BorrowTransactionStatus.NOT_RETURNED].includes(transaction.status)
                        && <Button
                            className="mr-3 mb-2"
                            color="blue"
                            onClick={() => onClickReturn(transaction)}
                        >Return
                        </Button>}
                    {[BorrowTransactionStatus.RESERVED, BorrowTransactionStatus.APPROVED].includes(transaction.status)
                        && <Button color="failure" onClick={handleCancelTransaction}>
                            Cancel
                        </Button>
                    }
                    {[BorrowTransactionStatus.APPROVED, BorrowTransactionStatus.NOT_RETURNED].includes(transaction.status)
                        && <div className="my-2">
                            <EditButton onClick={() => onClickEdit(transaction)} />
                        </div>
                    }
                </td>
            </tr>
            <tr className="border-b border-gray-800">
                <td colSpan={9} className="border border-gray-400 pl-10 pr-3 py-2 bg-white">
                    <div className="font-bold text-gray-900 text-md p-1">
                        Items:
                    </div>
                    <TransactionItemList transactionId={transaction._id} items={transaction.displayItems} />
                </td>
            </tr>
        </React.Fragment>
    )
}

