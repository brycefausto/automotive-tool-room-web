import _ from "lodash";
import { DateTime } from "luxon";
import { Item } from "./item";
import { Subject } from "./subject";
import { AppUser } from "./user";

export enum BorrowTransactionStatus {
  RESERVED = 'reserved',
  APPROVED = 'approved',
  RETURNED = 'returned',
  NOT_RETURNED = 'not_returned'
}

export type FillStatus = 'High' | 'Medium' | 'Low';

export interface BorrowTransactionItem {
  item: Item,
  quantity: number,
  size?: string,
  fillStatus?: FillStatus,
  remarks?: string
}

export interface BorrowTransaction {
  _id: string
  user: AppUser
  subject?: Subject
  groupNo?: string
  members?: string[]
  items: BorrowTransactionItem[]
  displayItems: BorrowTransactionItem[]
  status: BorrowTransactionStatus
  approveUser?: AppUser
  returnUser?: AppUser
  createdAt: string
  borrowedAt?: string
  returnedAt?: string
}

export interface BorrowTransactionDTO extends BorrowTransaction {
  statusString: string
  total: number
  createdAtString: string
  borrowedAtString?: string
  returnedAtString?: string
}

export function convertStatusText(status: BorrowTransactionStatus) {
  const words = status.split('_')
  return words
      .map(word => _.upperFirst(word))
      .join(" ")
}

export function toTransactionDto(transaction: BorrowTransaction) {
  const transactionDto: BorrowTransactionDTO = _.merge(
    {
      statusString: convertStatusText(transaction.status),
      members: transaction.members || [],
      total: transaction.items.reduce((count, item) => count + item.quantity, 0),
      createdAtString: toDateTimeString(transaction.createdAt),
      borrowedAtString: transaction.borrowedAt ? toDateTimeString(transaction.borrowedAt) : '',
      returnedAtString: transaction.returnedAt ? toDateTimeString(transaction.returnedAt) : ''
    },
    transaction)

  return transactionDto
}

export function toDateTimeString(iso: string) {
  return DateTime.fromISO(iso).toFormat('ccc, MMM d yyyy, h:mm a')
}

export interface TransactionReportItemDto {
  item: string
  size: string
  quantity: number
  fillStatus: string
  remarks: string
}

export interface TransactionReportDTO {
  id: string
  date: string
  borrower: string
  section: string
  subject: string
  professor: string
  items: TransactionReportItemDto[]
  status: string
  total: number
  approved: string
  returned: string
}

export interface TransactionReportData {
  date: string
  rows: TransactionReportDTO[]
}

export function constructReportData(transactions: BorrowTransactionDTO[]) {
  const date = DateTime.now().toFormat('ccc, MMM d yyyy, h:mm a')
  const rows = transactions.map(transaction => {
    const items = transaction.displayItems.map(transactionItem => {
      return {
        item: transactionItem.item.name,
        size: transactionItem.size,
        quantity: transactionItem.quantity,
        fillStatus: transactionItem.fillStatus || '',
        remarks: transactionItem.remarks || ''
      } as TransactionReportItemDto
    })
    const approved = transaction.borrowedAtString && transaction.approveUser ?
      `At ${transaction.borrowedAtString} by ${transaction.approveUser?.name}`
      : ''
    const returned = transaction.returnedAtString && transaction.returnUser ?
      `At ${transaction.returnedAtString} by ${transaction.returnUser?.name}`
      : ''

    return {
      id: transaction._id,
      date: transaction.borrowedAtString || transaction.createdAtString,
      borrower: transaction.user.name,
      section: transaction.user.section?.name || '',
      subject: transaction.subject?.name || '',
      professor: transaction.subject?.professor || '',
      items,
      status: transaction.statusString,
      total: transaction.total,
      approved,
      returned,
      borrowedAtString: transaction.borrowedAtString,
      approveUser: transaction.approveUser?.name,
      returnedAtString: transaction.returnedAtString,
      returnUser: transaction.returnUser?.name
    } as TransactionReportDTO
  })

  const totalBorrowed = transactions.reduce((prev, transaction) => {
    if ([BorrowTransactionStatus.APPROVED, BorrowTransactionStatus.RETURNED].includes(transaction.status)) {
      return prev + transaction.total
    }
    return prev
  }, 0)

  const totalReturned = transactions.reduce((prev, transaction) => {
    if (transaction.status == BorrowTransactionStatus.RETURNED) {
      return prev + transaction.total
    }
    return prev
  }, 0)

  const total = totalBorrowed + totalReturned

  return {
    date,
    rows,
    total,
    totalBorrowed,
    totalReturned
  } as TransactionReportData
}
