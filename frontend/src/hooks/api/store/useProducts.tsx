import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { AxiosError } from "axios";
import { ApiException } from "src/types/api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  price_id: string;
  images: string[];
  createdAt: number;
  type: string;
}

export const useProducts = () => {
  return useQuery<Product[], AxiosError<ApiException>>({
    queryKey: ["store", "products"],
    queryFn: async () => {
      const req = await apiClient.get("/store/products");

      const data = req.data as Product[];

      return data.sort((p, n) => (p.price > n.price ? 1 : -1));
    },
  });
};
