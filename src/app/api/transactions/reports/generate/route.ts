import { generateReport } from '@/utils/reportGenerator';

export async function POST(request: Request, response: Response) {
  const data = await request.json()
  
  const fileName = "transactions.html";

  try {
    await generateReport(
      './public/html/transaction-report-template.html',
      './public/reports/' + fileName,
      data
    )
  
    return Response.json({
      url: "/reports/" + fileName,
      name: fileName
    })
  } catch (error: any) {
    return Response.json(error.message, { status: 500 })
  }
}