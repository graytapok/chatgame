import { apiClient } from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChangePasswordProps {
  password: string;
  userHash?: string;
  token?: string;
}

const postForgotPasswordChange = async (params: ChangePasswordProps) => {
  if (params.userHash && params.token) {
    const res = await apiClient.post(
      `/auth/change_password?u=${params.userHash}&t=${params.token}`,
      {
        password: params.password,
      }
    );
    return res.data;
  } else {
    const res = await apiClient.post(`/auth/change_password`, {
      password: params.password,
    });
    return res.data;
  }
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postForgotPasswordChange,
    mutationKey: ["auth", "passwordChange"],
    onSuccess: (_data, { userHash, token }) => {
      if (userHash && token) {
        queryClient.invalidateQueries({ queryKey: ["auth"], exact: true });
      }
    },
  });
};
