'use client';
import { PaginatedDocument } from '@/models';
import { BorrowTransaction, BorrowTransactionDTO, constructReportData, toTransactionDto } from '@/models/transaction';
import { useListenerSocket } from '@/socket/listenerSocket';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAppUser, isUserAdmin } from '@/store/reducers/user';
import serverFetch from '@/utils/serverFetch';
import axios from 'axios';
import { Button, Label, Pagination, Select, Table, Datepicker } from 'flowbite-react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRef, useState } from 'react';
import LoadingComponent from '../LoadingComponent';
import TransactionDetailsModal from './TransactionDetailsModal';
import TransactionListItem from './TransactionListItem';
import TransactionEditModal from './TransactionEditModal';
import RemarksFilterDropdown from './RemarksFilterDropdown';
import { convertToUrlParams } from '@/utils/stringUtils';

export default function TransactionList() {
  const user = useAppSelector(getAppUser);
  const isAdmin = useAppSelector(isUserAdmin);
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<BorrowTransactionDTO[]>([]);
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BorrowTransactionDTO | null>();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editShouldReturn, setEditShouldReturn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startTimestamp, setStartTimestamp] = useState<string | null>();
  const [endTimestamp, setEndTimestamp] = useState<string | null>();
  const remarksFilterRef = useRef<string>();
  const remarksRef = useRef<string[]>();
  const [remarksParams, setRemarksParams] = useState<{ remarksFilter?: string, remarks?: string[] }>({});
  const { remarksFilter, remarks } = remarksParams;
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { page: currentPage, startTimestamp, endTimestamp, remarksFilter, remarks }

  useListenerSocket<PaginatedDocument<BorrowTransaction>>(
    'transactions', queryParams,
    (data) => {
      const transactions = data.docs.map(toTransactionDto)
      setTransactions(transactions)
      setTotalPages(data.totalPages)
      setLoading(false)
    })

  const getTimestampsFromDateRange = () => {
    let startTimestamp: string | null = null;
    let endTimestamp: string | null = null;
    switch (dateRange) {
      case "today":
        startTimestamp = DateTime.now().startOf('day').toISO();
        endTimestamp = DateTime.now().endOf('day').toISO();;
        break;
      case "this_week":
        startTimestamp = DateTime.now().startOf('week').toISO();
        endTimestamp = DateTime.now().endOf('week').toISO();
        break;
      case "this_month":
        startTimestamp = DateTime.now().startOf('month').toISO();
        endTimestamp = DateTime.now().endOf('month').toISO();
        break;
      case "select_date":
        startTimestamp = DateTime.fromJSDate(startDate).startOf('day').toISO();
        endTimestamp = DateTime.fromJSDate(startDate).endOf('day').toISO();
        break;
      case "select_date_range":
        startTimestamp = DateTime.fromJSDate(startDate).startOf('day').toISO();
        endTimestamp = DateTime.fromJSDate(endDate).endOf('day').toISO();
        break;
    }

    return { startTimestamp, endTimestamp };
  }

  const handleGenerateReport = async () => {
    try {
      // const { startTimestamp, endTimestamp } = getTimestampsFromDateRange();
      // const timestampParamString = (startTimestamp && endTimestamp) ? `&startTimestamp=${encodeURIComponent(startTimestamp)}&endTimestamp=${encodeURIComponent(endTimestamp)}` : ''
      let url = '/transactions?limit=500'

      if (Object.keys(queryParams).length > 0) {
        const urlParams = convertToUrlParams(queryParams)
        
        url += `?${urlParams}`
      }
      const { data } = await serverFetch.get(url)
      const transactions = data.docs.map(toTransactionDto)
      const transactionReportData = constructReportData(transactions)
      await axios.post("/api/transactions/reports/generate", transactionReportData)
      const reportDate = DateTime.now().toFormat('MMM-d-yyyy')
      window.open(`/transactions/preview?date=${reportDate}`, '_blank', 'noopener,noreferrer')
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleClickDetails = (transaction: BorrowTransactionDTO) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setSelectedTransaction(null)
  }

  const handleClickEdit = (transaction: BorrowTransactionDTO) => {
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setSelectedTransaction(null)
    setEditShouldReturn(false)
  }

  const handleClickReturn = (transaction: BorrowTransactionDTO) => {
    setEditShouldReturn(true)
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  if (loading) {
    return <LoadingComponent />;
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    switch (value) {
      case "select_date":
        setShowStartDate(true);
        setShowEndDate(false);
        break;
      case "select_date_range":
        setShowStartDate(true);
        setShowEndDate(true);
        break;
      default:
        setShowStartDate(false);
        setShowEndDate(false);
        break;
    }
  }

  const handleSearch = () => {
    const { startTimestamp, endTimestamp } = getTimestampsFromDateRange();
    setStartTimestamp(startTimestamp);
    setEndTimestamp(endTimestamp);
    const isFilterWithRemarks = remarksFilterRef.current == 'With Remarks';
    setRemarksParams({ remarksFilter: remarksFilterRef.current, remarks: isFilterWithRemarks ? remarksRef.current: undefined });
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex p-5">
        <div className="flex">
          <span className="text-2xl font-bold">Transactions</span>
        </div>
        <div className="flex flex-auto">
        </div>
        <div className="flex items-center mr-2">
          <Label htmlFor="dateFilter">Date Filter: </Label>
        </div>
        <Select id="dateFilter" className="mr-5" value={dateRange} onChange={(e) => handleDateRangeChange(e.target.value)}>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="select_date">Select Date</option>
          <option value="select_date_range">Select Date Range</option>
        </Select>
        {showStartDate && (
          <div className="flex flex-row mr-2">
            <div className="flex items-center mr-2">
              <Label htmlFor="startDate">Start Date: </Label>
            </div>
            <Datepicker id="startDate" onSelectedDateChanged={(date) => setStartDate(date)} />
          </div>
        )}
        {showEndDate && (
          <div className="flex flex-row mr-2">
            <div className="flex items-center mr-2">
              <Label htmlFor="endDate">End Date: </Label>
            </div>
            <Datepicker id="endDate" onSelectedDateChanged={(date) => setEndDate(date)} />
          </div>
        )}
        <div className="mr-5">
          <RemarksFilterDropdown
            onChangeFilter={(value) => remarksFilterRef.current = value}
            onChangeRemarks={(value) => remarksRef.current = value}
          />
        </div>
        <Button className="justify-self-end mr-5" onClick={handleSearch}>Search</Button>
        <Button className="justify-self-end mr-5" onClick={handleGenerateReport}>Generate Report</Button>
        <Link href="/transactions/create">
          <Button className="justify-self-end">Add</Button>
        </Link>
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Borrower</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Approved By</Table.HeadCell>
          <Table.HeadCell>Returned At</Table.HeadCell>
          <Table.HeadCell>Returned By</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions.map(transaction => (
            <TransactionListItem key={transaction._id} transaction={transaction} onClickDetails={handleClickDetails} onClickEdit={handleClickEdit} onClickReturn={handleClickReturn} onSetPage={setCurrentPage} />
          ))}
        </Table.Body>
      </Table>
      {transactions.length == 0 && (
        <div className="flex justify-center p-10">
          <p className="text-gray-500 text-2xl">The list is empty.</p>
        </div>
      )}
      <div className="flex overflow-x-auto sm:justify-center mt-5">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
      </div>
      {selectedTransaction && (
        <>
          <TransactionDetailsModal
            show={showDetailsModal}
            setShow={setShowDetailsModal}
            onClose={handleCloseDetails}
            transaction={selectedTransaction}
          />
          <TransactionEditModal
            show={showEditModal}
            setShow={setShowEditModal}
            onClose={handleCloseEditModal}
            transaction={selectedTransaction}
            shouldReturn={editShouldReturn}
          />
        </>
      )}
    </div>
  )
}
