import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "..";
import { toast } from "react-toastify";

interface useRegisterProps {
  username: string;
  email: string;
  password: string;
}

const postRegister = async (registerData: useRegisterProps) => {
  const response = await apiClient.post("/auth/register", registerData);
  return response.data;
};

const getConfirmRegister = async ({ token }: { token: string }) => {
  const response = await apiClient.post(`/auth/register/confirm?t=${token}`);
  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: postRegister,
    mutationKey: ["auth", "register"],
  });
};

export const useConfirmRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getConfirmRegister,
    mutationKey: ["auth", "confirmRegister"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"], exact: true });
      toast.success("Registration complete!", {
        toastId: "registerSuccessMessage",
      });
    },
  });
};
