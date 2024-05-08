import { BorrowTransactionDTO, BorrowTransactionStatus } from '@/models/transaction'
import { useAppSelector } from '@/store'
import { getAppUser } from '@/store/reducers/user'
import serverFetch from '@/utils/serverFetch'
import { Button, Table } from 'flowbite-react'
import React from 'react'
import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa"
import { MdAssignmentReturned, MdAssignmentLate } from "react-icons/md"
import DetailsButton from '../buttons/DetailsButton'
import TransactionItemList from './TransactionItemList'
import { useAlertModal } from '@/providers/AlertModalProvider'
import EditButton from '../buttons/EditButton'

export interface TransactionListItemProps {
    transaction: BorrowTransactionDTO
    onClickDetails: (transaction: BorrowTransactionDTO) => void | Promise<void>
    onClickEdit: (transaction: BorrowTransactionDTO) => void | Promise<void>
    onClickReturn: (transaction: BorrowTransactionDTO) => void
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
                alert("Error: " + error.message);
            }
        }
    }

    const handleCancelTransaction = () => {
        alertModal.showDialogModal("Cancel this transaction?", async () => {
            try {
                await serverFetch.delete(`/transactions/${transaction._id}`)
                onSetPage(1)
            } catch (error: any) {
                alert("Error: " + error.message);
            }
        })
    }

    return (
        <React.Fragment>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <span>{transaction.borrowedAtString || transaction.createdAtString}</span>
                    <div className="float-right">
                        <DetailsButton onClick={() => onClickDetails(transaction)} />
                    </div>
                </Table.Cell>
                <Table.Cell>{transaction.user.name}</Table.Cell>
                <Table.Cell>
                    <span>
                        {transaction.statusString}
                        <span className="m-5">
                            {renderStatusIcon()}
                        </span>
                    </span>
                </Table.Cell>
                <Table.Cell>{transaction.total}</Table.Cell>
                <Table.Cell>{transaction.approveUser?.name}</Table.Cell>
                <Table.Cell>{transaction.returnedAtString}</Table.Cell>
                <Table.Cell>{transaction.returnUser?.name}</Table.Cell>
                <Table.Cell>
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
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell colSpan={9} className="pt-0 pb-0 pl-10 pr-0">
                    <TransactionItemList transactionId={transaction._id} items={transaction.displayItems} />
                </Table.Cell>
            </Table.Row>
        </React.Fragment>
    )
}

