import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { apiClient } from "src/api";

const getLogout = async () => {
  const response = await apiClient.get("/auth/logout");
  return response.data;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: getLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"], exact: true });
      toast.success("Logged out!", { toastId: "logoutSuccessMessage" });
    },
  });
};
