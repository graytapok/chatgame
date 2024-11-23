import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/api";

interface postResendProps {
  login: string;
}

const postResend = async (props: postResendProps) => {
  const response = await apiClient.post("/auth/register/resend", props);
  return response.data;
};

export const useResend = () => {
  return useMutation({
    mutationFn: postResend,
    mutationKey: ["auth", "resend"],
  });
};
