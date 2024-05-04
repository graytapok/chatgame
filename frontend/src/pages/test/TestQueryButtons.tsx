import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { IUser } from "types";

interface FetchLoginProps {
  login: string;
  password: string;
  remember?: boolean;
}

const fetchUser = async () => {
  const response = await fetch("/api/auth/");
  const json = await response.json();
  return json;
};

const fetchLogout = async () => {
  const response = await fetch("/api/auth/logout");
  const json = await response.json();
  return json;
};

const fetchLogin = async ({
  login,
  password,
  remember = true,
}: FetchLoginProps) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login: login,
      password: password,
      remember: remember,
    }),
  });
  const json = await response.json();
  return json;
};

function TestQueryButtons() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<IUser | null>();

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => fetchUser(),
  });

  const loginMutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  useEffect(() => {
    if (authQuery.status === "success") {
      setUser(authQuery.data.user);
    } else {
      setUser(null);
    }
  }, [authQuery]);

  return (
    <>
      <button
        className="bg-black text-white m-1 p-2 rounded-lg"
        onClick={async () => {
          try {
            await loginMutation.mutateAsync({
              login: "Wadim",
              password: "Wadim2204!",
            });
          } catch (e) {
            console.log(e);
          }
        }}
        disabled={loginMutation.isPending}
      >
        Login
      </button>
      <button
        className="bg-black text-white m-1 p-2 rounded-lg"
        onClick={async () => {
          try {
            await logoutMutation.mutateAsync();
            setUser(null);
          } catch (e) {
            console.log(e);
          }
        }}
        disabled={logoutMutation.isPending}
      >
        Logout
      </button>
      {(authQuery.isLoading ||
        logoutMutation.isPending ||
        loginMutation.isPending) && <ClipLoader />}
      {user && (
        <ul>
          {Object.keys(user).map((key: string) => (
            <li key={key}>
              {key}: {user[key as keyof typeof user].toString()}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default TestQueryButtons;
