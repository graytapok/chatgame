import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";
import { AxiosError } from "axios";

export const useCreateSession = () => {
  return useMutation<void, AxiosError, string>({
    mutationKey: ["payment", "create", "session"],
    mutationFn: async (priceId) => {
      const req = await apiClient.post("/store/payments/checkout_session", {
        price_id: priceId,
        success_url: "http://localhost:5173/store/chagcoins/success",
        cancel_url: "http://localhost:5173/store/chagcoins/cancel",
        payment_hash_alias: "p",
      });

      document.location.href = req.data.url;
    },
  });
};
