import { ChatMessage } from '@/models/chat';
import { AppUser } from '@/models/user';
import { DateTime } from 'luxon';
import ChatMessageBubble from './ChatMessageBubble';

export interface ChatMessagesListProps {
  appUser: AppUser
  messages: ChatMessage[],
}

export default function ChatMessagesList({ appUser, messages }: ChatMessagesListProps) {
  let messagesCounter = 0;
  let characterCounter = 0;
  const dateTimeNow = DateTime.now();

  return (
    <>
      {messages.map((message, i) => {
        let prevUserId: string | undefined;
        let dateString: string | undefined;
        messagesCounter++;
        characterCounter += message.message?.length || 0;
        const currentDate = DateTime.fromISO(message.createdAt);

        if (messagesCounter == 1) {
          const dateDiff = dateTimeNow.diff(currentDate, ["years", "months", "days"]);
          if (dateDiff.years >= 1) {
            dateString = currentDate.toFormat("MMM d yyyy, h:mm a");
          } else if (dateDiff.days >= 2) {
            dateString = currentDate.toFormat("MMM d 'AT' h:mm a");
          } else if (dateDiff.days >= 1) {
            dateString = currentDate.toFormat("ccc 'AT' h:mm a");
          } else {
            dateString = currentDate.toFormat("h:mm a");
          }
        }

        if (i > 0) {
          const prevMessage = messages[i - 1];
          const prevDate = DateTime.fromISO(prevMessage.createdAt);

          if (messagesCounter > 1) {
            prevUserId = prevMessage.user?._id;
          }

          if (currentDate.diff(prevDate, "hours").hours >= 1) {
            messagesCounter = 0;
          }
        }

        if (messagesCounter >= 5 || characterCounter >= 100) {
          messagesCounter = 0;
          characterCounter = 0;
        }

        return (
          <ChatMessageBubble key={i} appUser={appUser} chatMessage={message} prevUserId={prevUserId} dateString={dateString} />
        )
      })}
    </>
  )
}
