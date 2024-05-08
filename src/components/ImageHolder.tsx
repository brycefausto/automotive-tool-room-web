import Image, { ImageProps } from 'next/image'
import React from 'react'

interface ImageHolderProps extends Omit<ImageProps, "src" | "alt"> {
  imageName: string
}

export default function ImageHolder({ imageName, ...props }: ImageHolderProps) {
  let src = '/placeholder.jpg'

  if (imageName != '') {
    src = imageName
  }

  return (
    <Image src={src} placeholder="blur" blurDataURL="/placeholder.jpg" alt={imageName} {...props} />
  )
}
