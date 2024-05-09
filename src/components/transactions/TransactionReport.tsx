'use client'
import serverFetch from '@/utils/serverFetch';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function TransactionReport() {
  const [reportDoc, setReportDoc] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await serverFetch.get('/transactions/report');
      setReportDoc(data);
    })()
  }, [])

  const handlePrint = () => {
    (document.getElementById("report") as any).contentWindow.print();
  }
  return (
    <div className="p-2">
      <Button className="ml-10" onClick={handlePrint}>Print Report</Button>
      <div className="flex h-screen">
        <iframe srcDoc={reportDoc}  id="report" className="w-full">
        </iframe>
      </div>
    </div>
  )
}