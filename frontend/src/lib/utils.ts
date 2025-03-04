import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  const err = error as AxiosError;
  const errorData = err.response?.data as { message?: string } | undefined;
  return errorData?.message || "Something went wrong!";
};

export function formatMessageTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
