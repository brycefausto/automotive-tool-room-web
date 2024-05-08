import { Button, Tooltip } from 'flowbite-react'
import { ComponentProps } from 'react'
import { FaTrash } from 'react-icons/fa'

export interface DeleteButtonProps extends ComponentProps<"button"> {
  tooltipContent?: string
}

export default function DeleteButton({ onClick, disabled, tooltipContent }: DeleteButtonProps) {
  return (
    <Tooltip content={tooltipContent || "Delete"}>
      <Button color="failure" onClick={onClick} disabled={disabled} className="disabled:bg-slate-500">
        <FaTrash size={20} />
      </Button>
    </Tooltip>
  )
}
