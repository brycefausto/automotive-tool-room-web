import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey : process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY || '',
  privateKey : process.env.NEXT_PUBLIC_IMAGE_KIT_PRIVATE_KEY || '',
  urlEndpoint : process.env.NEXT_PUBLIC_IMAGE_KIT_URL || ''
});