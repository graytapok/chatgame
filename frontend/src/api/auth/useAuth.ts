import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { apiClient } from "src/api";
import { IUser } from "src/types/auth";


const getAuth = async () => {
  const response = await apiClient.get("/auth/");
  return response.data
}; 

interface UseAuthProps {
  enabled: boolean
}

export const useAuth = ({ enabled = true}: Partial<UseAuthProps> = {}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const query = useQuery({
      queryKey: ["auth"],
      queryFn: getAuth,
      retry: false,
      retryDelay: 0,
      enabled: enabled
    })

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data.user)
    } else {
      setUser(null)
    }
  }, [user, query])
  
  return {query, user}
}