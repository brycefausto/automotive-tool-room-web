'use client'
import { Button } from 'flowbite-react';

export default function TransactionReport() {
  const handlePrint = () => {
    (document.getElementById("report") as any).contentWindow.print();
  }
  return (
    <div className="p-2">
      <Button className="ml-10" onClick={handlePrint}>Print Report</Button>
      <div className="flex h-screen">
        <iframe src="/reports/transactions.html" id="report" className="w-full">
        </iframe>
      </div>
    </div>
  )
}