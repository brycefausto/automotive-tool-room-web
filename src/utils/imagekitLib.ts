import axios from "axios";
import ImageKit from "imagekit-javascript";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL || '',
});

export async function uploadImage(file: File, folder: string) {
  // const { data: { token, signature, expire } } = await axios.post('/api/imagekit/auth')
  // const result = await imagekit.upload({
  //   file,
  //   fileName: file.name,
  //   folder,
  //   token,
  //   signature,
  //   expire,
  // })

  const formData = new FormData()
  formData.set('file', file)
  formData.set('fileName', file.name)
  formData.set('folder', folder)
  const { data } = await axios.post('/api/imagekit/upload', formData)

  return data
}
