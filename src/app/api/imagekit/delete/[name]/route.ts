import { imagekit } from '@/config/imagekit';

export async function DELETE(request: Request, { params: { name } }: { params: { name: string } }) {
  const result = await imagekit.listFiles({
    searchQuery : `name="${name}"`
  })
  
  if (result.length > 0) {
    await imagekit.deleteFile(result[0].fileId)
  } else {
    return Response.json("Image Not Found", { status: 404 })
  }

  return Response.json("success")
}