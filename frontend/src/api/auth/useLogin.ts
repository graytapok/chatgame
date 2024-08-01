import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { apiClient } from "src/api";

interface FetchLoginProps {
  login: string;
  password: string;
  remember?: boolean;
}

const postLogin = async (loginData: FetchLoginProps) => {
  const response = await apiClient.post("/auth/login", loginData);
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLogin,
    mutationKey: ["auth", "login"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"], exact: true });
      toast.success("Logged in!", { toastId: "loginSuccessMessage" });
    },
  });
};
