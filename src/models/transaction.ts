import _ from "lodash";
import { Item } from "./item";
import { Subject } from "./subject";
import { AppUser } from "./user";
import { Section } from "./section";
import { Department } from "./department";

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
  department?: Department
  section?: Section
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
  statusString: string
  total: number
  createdAtString: string
  borrowedAtString?: string
  returnedAtString?: string
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
