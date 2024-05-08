import { Tooltip } from 'flowbite-react';
import { ComponentProps } from 'react';
import { IoChatboxEllipses } from "react-icons/io5";

export interface ChatButtonProps extends ComponentProps<"div"> {
  userFullName: string;
}

export default function ChatButton({ userFullName, className, onClick }: ChatButtonProps) {
  return (
    <div className={className} onClick={onClick}>
      <Tooltip content={`Chat with ${userFullName}`}>
        <IoChatboxEllipses size={24} className="text-blue-700 hover:text-blue-800" />
      </Tooltip>
    </div>
  )
}
