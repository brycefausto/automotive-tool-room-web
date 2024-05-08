import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const imageValidator = z
  .any()
  .refine((file) => {
    return file?.size <= MAX_FILE_SIZE;
  }, `Max image size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  )