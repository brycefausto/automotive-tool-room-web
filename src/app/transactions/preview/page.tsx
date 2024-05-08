import TransactionReport from "@/components/transactions/TransactionReport";
import type { Metadata } from 'next';
 
export async function generateMetadata(
  { searchParams: { date } }: { searchParams: { date: string } }
): Promise<Metadata> {
  return {
    title: "Transaction Report - " + date,
  }
}

export default function TransactionPreview() {
  return (
    <TransactionReport />
  )
}
