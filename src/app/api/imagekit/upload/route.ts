import { imagekit } from '@/config/imagekit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const fileName = data.get('fileName') as unknown as string
  const folder = data.get('folder') as unknown as string

  if (!file || !fileName || !folder) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const res = await imagekit.upload({
    file: buffer,
    fileName,
    folder
  })

  return NextResponse.json(res)
}