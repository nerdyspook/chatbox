import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { User, X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {selectedUser?._id && (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              {selectedUser.profilePic ? (
                <div className="size-10 rounded-full relative">
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                  />
                </div>
              ) : (
                <User className="size-10 object-cover rounded-full p-3 border border-base-300" />
              )}
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className=" hover:bg-base-300 rounded-md"
        >
          <X className="size-10 p-2" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
