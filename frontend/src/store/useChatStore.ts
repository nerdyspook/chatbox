import { useAuthStore, UserType } from "@/store/useAuthStore";
import { create } from "zustand";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";

type ChatStore = {
  messages: any[];
  users: UserType[];
  selectedUser: UserType | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: UserType | null) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    try {
      set({ isUserLoading: true });
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: UserType | null) => set({ selectedUser }),
}));
