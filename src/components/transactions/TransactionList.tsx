'use client';
import { PaginatedDocument } from '@/models';
import { BorrowTransaction } from '@/models/transaction';
import { useListenerSocket } from '@/socket/listenerSocket';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAppUser, isUserAdmin } from '@/store/reducers/user';
import serverFetch from '@/utils/serverFetch';
import { convertToUrlParams } from '@/utils/stringUtils';
import { Button, Datepicker, Label, Pagination, Select, Table } from 'flowbite-react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRef, useState } from 'react';
import LoadingComponent from '../LoadingComponent';
import RemarksFilterDropdown from './RemarksFilterDropdown';
import TransactionDetailsModal from './TransactionDetailsModal';
import TransactionEditModal from './TransactionEditModal';
import TransactionListItem from './TransactionListItem';
import UserNamesDropdown from './UserNamesDropdown';

export default function TransactionList() {
  const user = useAppSelector(getAppUser);
  const isAdmin = useAppSelector(isUserAdmin);
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([]);
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BorrowTransaction | null>();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editShouldReturn, setEditShouldReturn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [borrower, setBorrower] = useState<string>('');
  const [borrowerSearch, setBorrowerSearch] = useState<string>('');
  const [startTimestamp, setStartTimestamp] = useState<string | null>();
  const [endTimestamp, setEndTimestamp] = useState<string | null>();
  const remarksFilterRef = useRef<string>();
  const remarksRef = useRef<string[]>();
  const [remarksParams, setRemarksParams] = useState<{ remarksFilter?: string, remarks?: string[] }>({});
  const { remarksFilter, remarks } = remarksParams;
  const onPageChange = (page: number) => setCurrentPage(page);
  const queryParams = { page: currentPage, borrower: borrowerSearch, startTimestamp, endTimestamp, remarksFilter, remarks }

  useListenerSocket<PaginatedDocument<BorrowTransaction>>(
    'transactions', queryParams,
    (data) => {
      const transactions = data.docs
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
      let url = '/transactions/generateReport'

      if (Object.keys(queryParams).length > 0) {
        const urlParams = convertToUrlParams(queryParams)

        url += `?${urlParams}`
      }
      await serverFetch.post(url)
      const reportDate = DateTime.now().toFormat('MMM-d-yyyy')
      window.open(`/transactions/preview?date=${reportDate}`, '_blank', 'noopener,noreferrer')
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleClickDetails = (transaction: BorrowTransaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setSelectedTransaction(null)
  }

  const handleClickEdit = (transaction: BorrowTransaction) => {
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setSelectedTransaction(null)
    setEditShouldReturn(false)
  }

  const handleClickReturn = (transaction: BorrowTransaction) => {
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
    setBorrowerSearch(borrower);
    setStartTimestamp(startTimestamp);
    setEndTimestamp(endTimestamp);
    const isFilterWithRemarks = remarksFilterRef.current == 'With Remarks';
    setRemarksParams({ remarksFilter: remarksFilterRef.current, remarks: isFilterWithRemarks ? remarksRef.current : undefined });
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
          <UserNamesDropdown value={borrower} onChange={(value) => {
            const newValue = value.replace(/[^\w\s]/gi, '')
            console.log("borrower", newValue)
            setBorrower(newValue)
          }} />
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
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-sky-200 dark:bg-gray-700 dark:text-gray-400 border border-gray-600 border-b-2">
          <tr>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Date
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Borrower
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Status
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Total
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Approved By
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Returned At
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              Returned By
            </th>
            <th scope="col" className="px-6 py-3 border border-gray-400">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y bg-sky-100">
          {transactions.map(transaction => (
            <TransactionListItem key={transaction._id} transaction={transaction} onClickDetails={handleClickDetails} onClickEdit={handleClickEdit} onClickReturn={handleClickReturn} onSetPage={setCurrentPage} />
          ))}
        </tbody>
      </table>
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
