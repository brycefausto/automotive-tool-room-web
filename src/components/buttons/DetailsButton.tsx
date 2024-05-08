import { Tooltip } from 'flowbite-react';
import { ComponentProps } from 'react';
import { CgNotes } from "react-icons/cg";

export default function DetailsButton({ className, onClick }: ComponentProps<"div">) {
  return (
    <div className={className} onClick={onClick}>
      <Tooltip content="Details">
        <CgNotes size={24} className="text-blue-700 hover:text-blue-800" />
      </Tooltip>
    </div>
  )
}
