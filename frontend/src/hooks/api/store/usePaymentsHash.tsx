import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { AxiosError } from "axios";

interface Payment {
  id: number;
  user_id: number;
  fulfilled: boolean;
  created_at: string;

  total_amount?: number;
  expires_at?: string;
  receipt_url?: string;
  payment_method?: string;
  billing_email?: string;
  full_name?: string;
  country?: string;
}

export const usePaymentsHash = (paymentHash: string) => {
  return useQuery<Payment, AxiosError>({
    queryKey: ["payments", "hash"],
    queryFn: async () => {
      const req = await apiClient.get(`/store/payments/${paymentHash}`);

      return req.data as Payment;
    },
    refetchInterval: (query) => {
      if (query.state.data?.fulfilled) {
        return false;
      }
      return 1000;
    },
    retry: false,
    enabled: !!paymentHash,
  });
};
