import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { apiClient } from "src/hooks/api";

const getLogout = async () => {
  await apiClient.get("/auth/logout");
  return {};
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
