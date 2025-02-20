import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  const err = error as AxiosError;
  const errorData = err.response?.data as { message?: string } | undefined;
  return errorData?.message || "Something went wrong!";
};
