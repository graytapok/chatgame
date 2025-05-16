import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { AxiosError } from "axios";
import { useAppSelector } from "src/hooks";
import { store } from "src/store";
import { addBalance } from "src/features/balanceSlice";

export interface Balance {
  chagcoins: number;
  items: Item[];
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  images: object;
}

export const useBalance = () => {
  const user = useAppSelector((s) => s.user);
  return useQuery<Balance, AxiosError>({
    queryKey: ["store", "balance"],
    queryFn: async () => {
      const req = await apiClient.get("/store/balance");

      store.dispatch(addBalance(req.data));

      return req.data as Balance;
    },
    retry: false,
    enabled: !!user.id,
  });
};
