import BorrowersSlipReport from "@/components/transactions/BorrowersSlipReport";
import type { Metadata } from 'next';
 
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Borrower's Slip Report",
  }
}

export default function TransactionPreview() {
  return (
    <BorrowersSlipReport />
  )
}
