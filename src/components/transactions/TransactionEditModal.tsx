import { BorrowTransactionDTO } from '@/models/transaction'
import serverFetch, { getErrorMessage } from '@/utils/serverFetch'
import { Button, Modal, Select } from 'flowbite-react'
import { useRef } from 'react'
import RemarksDropdown from './RemarksDropdown'

export interface TransactionEditModalProps {
  show: boolean
  setShow: (show: boolean) => void
  onClose: () => void
  transaction: BorrowTransactionDTO
  shouldReturn?: boolean
}

interface TransactItemDto {
  itemId: string
  fillStatus?: string
  remarks?: string
}

export default function TransactionEditModal({ show, setShow, onClose, transaction, shouldReturn }: TransactionEditModalProps) {
  const modalTitle = shouldReturn ? 'Return Transaction': 'Edit Transaction';
  const saveButtonTitle = shouldReturn ? 'Return': 'Save';
  const transactItemDtos = useRef<TransactItemDto[]>(transaction.items.map(
    ({ item, fillStatus, remarks }) => ({ itemId: item._id, fillStatus: fillStatus?.toString(), remarks })
  ));

  let index = 0;
  const tools = transaction.items.filter(item => item.item.category == 'tool');
  const consumables = transaction.items.filter(item => item.item.category == 'consumable');

  const handleClose = () => {
    setShow(false)
    onClose()
  }

  const handleSave = async () => {
    try {
      if (!shouldReturn) {
        await serverFetch.put(`/transactions/items/${transaction._id}`, transactItemDtos.current);
        alert("Successfully saved transaction!");
      } else {
        await serverFetch.put(`/transactions/return/${transaction._id}`, transactItemDtos.current);
        alert("Successfully returned transaction!");
      }
      setShow(false);
      onClose();
    } catch (error) {
      getErrorMessage(error);
    }
  }

  return (
    <Modal show={show} onClose={handleClose}>
      <Modal.Header>
        {modalTitle}
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <p><span className="font-bold">Date:</span> {transaction.borrowedAtString || transaction.createdAtString}</p>
            <p><span className="font-bold">Borrower:</span> {transaction.user.name}</p>
            <p><span className="font-bold">Section:</span> {transaction.user.section?.name || ''}</p>
            <p><span className="font-bold">Subject:</span> {transaction.subject?.name || ''}</p>
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
        {tools.length > 0 && (
          <div className="mt-5">
            <p><span className="font-bold">Tools:</span></p>
            <table className="w-[100%] text-left">
              <tr>
                <th className="px-2">Name</th>
                <th className="px-2">Size</th>
                <th className="px-2">Qty</th>
                <th className="px-2">Remarks</th>
              </tr>
              {tools.map((item, i) => {
                const transactItemDto = transactItemDtos.current[index];
                index++;
                return (
                  <tr key={i}>
                    <td className="px-2">{item.item.name}</td>
                    <td className="px-2">{item.size}</td>
                    <td className="px-2">{item.quantity}</td>
                    <td className="px-2 w-[300px]">
                      <RemarksDropdown
                        defaultValue={transactItemDto.remarks}
                        onChange={(val) => transactItemDto.remarks = val}
                      />
                    </td>
                  </tr>
                )
              })}
            </table>
          </div>
        )}
        {consumables.length > 0 && (
          <div className="mt-5">
            <p><span className="font-bold">Consumables:</span></p>
            <table className="w-[100%] text-left">
              <tr>
                <th className="px-2">Name</th>
                <th className="px-2">Size</th>
                <th className="px-2">Qty</th>
                <th className="px-2">Fill Status</th>
                <th className="px-2">Remarks</th>
              </tr>
              {consumables.map((item, i) => {
                const transactItemDto = transactItemDtos.current[index];
                index++;
                return (
                  <tr key={i}>
                    <td className="px-2">{item.item.name}</td>
                    <td className="px-2">{item.size}</td>
                    <td className="px-2">{item.quantity}</td>
                    <td className="px-2 w-[150px]">
                      <Select
                        defaultValue={transactItemDto.fillStatus || 'High'}
                        onChange={(e) => transactItemDto.fillStatus = e.target.value}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Select>
                    </td>
                    <td className="px-2 w-[380px]">
                      <RemarksDropdown
                        defaultValue={transactItemDto.remarks}
                        onChange={(val) => transactItemDto.remarks = val}
                        isConsumable={true}
                      />
                    </td>
                  </tr>
                )
              })}
            </table>
          </div>
        )}
        <div className="mt-5 flex flex-row gap-4">
          <Button onClick={handleSave}>{saveButtonTitle}</Button>
          <Button color="gray" onClick={handleClose}>Close</Button>
        </div>
      </Modal.Body>
    </Modal >
  )
}
