import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import MessageInput from "@/components/MessageInput";
import ChatHeader from "@/components/ChatHeader";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";
import { formatMessageTime } from "@/lib/utils";

type Props = {};

const ChatContainer = (props: Props) => {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log({ messages });

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((eachMessage) => {
          const currentUser =
            eachMessage.senderId === authUser?._id ? authUser : selectedUser;
          return (
            <div
              key={eachMessage._id}
              className={`chat ${
                eachMessage.senderId === authUser?._id
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border !flex items-center justify-center">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} alt="profile pic" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-sm opacity-50 ml-1">
                  {formatMessageTime(eachMessage.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col gap-2 rounded-md p-4">
                {eachMessage.image && (
                  <img
                    src={eachMessage.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-md"
                  />
                )}
                {eachMessage.text && <p>{eachMessage.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
