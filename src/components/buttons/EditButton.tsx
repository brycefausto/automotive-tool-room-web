import { Button, Tooltip } from 'flowbite-react'
import { ComponentProps } from 'react'
import { FaEdit } from 'react-icons/fa'

export default function EditButton({ onClick, disabled }: ComponentProps<"button">) {
  return (
    <Tooltip content="Edit">
      <Button color="blue" onClick={onClick} disabled={disabled}>
        <FaEdit size={20} />
      </Button>
    </Tooltip>
  )
}
