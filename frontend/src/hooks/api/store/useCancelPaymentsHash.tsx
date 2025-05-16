import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { AxiosError } from "axios";

export function useCancelPaymentsHash(paymentHash: string) {
  return useQuery<{}, AxiosError>({
    queryKey: ["store", "payments", "cancel"],
    queryFn: async () => {
      await apiClient.delete(`/store/payments/${paymentHash}`);

      return {};
    },
    enabled: !!paymentHash,
    retry: false,
  });
}
