import { BorrowTransaction } from '@/models/transaction'
import { UserRole } from '@/models/user'
import { Modal } from 'flowbite-react'
import React from 'react'

export interface TransactionDetailsModalProps {
  show: boolean
  setShow: (show: boolean) => void
  onClose: () => void
  transaction: BorrowTransaction
}

export default function TransactionDetailsModal({ show, setShow, onClose, transaction }: TransactionDetailsModalProps) {
  const handleClose = () => {
    setShow(false)
    onClose()
  }

  const isStudent = transaction.user?.role == UserRole.STUDENT;

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>
        Transaction Details
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <p><span className="font-bold">Date:</span> {transaction.borrowedAtString || transaction.createdAtString}</p>
            <p><span className="font-bold">Borrower:</span> {transaction.user.name}</p>
            <p><span className="font-bold">Department:</span> {transaction.department?.name || ''}</p>
            {isStudent && (
              <>
                <p><span className="font-bold">Section:</span> {transaction.user.section?.name || ''}</p>
                <p><span className="font-bold">Subject:</span> {transaction.subject?.name || ''}</p>
              </>
            )}
            <p><span className="font-bold">Professor:</span> {transaction.subject?.professor || ''}</p>
            <p><span className="font-bold">Group No:</span> {transaction.groupNo}</p>
            <p><span className="font-bold">Members:</span></p>
            {transaction.members?.map((member, i) => (
              <p key={i}>{member}</p>
            ))}
          </div>
          <div>
            <p><span className="font-bold">Total:</span> {transaction.total}</p>
            <p><span className="font-bold">Approved By:</span> {transaction.approveUser?.name}</p>
            <p><span className="font-bold">Returned At:</span> {transaction.returnedAtString}</p>
            <p><span className="font-bold">Returned By:</span> {transaction.returnUser?.name}</p>
          </div>
        </div>
        <div>
          <p><span className="font-bold">Items:</span></p>
          <table className="w-[100%] text-left border border-gray-500">
            <thead className="border border-gray-500">
              <tr>
                <th className="border border-gray-500 px-1">Name</th>
                <th className="border border-gray-500 px-1">Category</th>
                <th className="border border-gray-500 px-1">Size</th>
                <th className="border border-gray-500 px-1">Qty</th>
                <th className="border border-gray-500 px-1">Remaining Qty</th>
                <th className="border border-gray-500 px-1">Fill Status</th>
                <th className="border border-gray-500 px-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item, i) => (
                <tr key={i} className="border border-gray-500">
                  <td className="border border-gray-500 px-1">{item.item.name}</td>
                  <td className="border border-gray-500 px-1">{item.item.category}</td>
                  <td className="border border-gray-500 px-1">{item.size}</td>
                  <td className="border border-gray-500 px-1 text-center">{item.quantity}</td>
                  <td className="border border-gray-500 px-1 text-center">{item.returnQuantity}</td>
                  <td className="border border-gray-500 px-1">{item.fillStatus}</td>
                  <td className="border border-gray-500 px-1">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal >
  )
}
