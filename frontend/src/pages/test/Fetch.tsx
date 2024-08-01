import { ClipLoader } from "react-spinners";
import { useState, useRef } from "react";
import { User } from "src/types/auth";

function Buttons() {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [error, setError] = useState<any>();
  const [message, setMessage] = useState<string | null>();

  const abortControllerRef = useRef<AbortController | null>(null);

  const auth = async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/", {
        signal: abortControllerRef.current?.signal,
      });
      const json = await response.json();
      if (response.status === 200) {
        const resUser = json.user as User;
        setUser(resUser);
      } else {
        setMessage(json.message);
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        return;
      } else {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: "Wadim",
          password: "Wadim2204!",
          remember: true,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        const resUser = json.user as User;
        setUser(resUser);
      } else {
        setMessage(json.message);
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        return;
      } else {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout");
      const json = await response.json();
      if (response.status === 200) {
        setUser(null);
      } else {
        setMessage(json.message);
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        return;
      } else {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        className="bg-black text-white m-1 p-2 rounded-lg"
        onClick={login}
      >
        Login
      </button>
      <button
        className="bg-black text-white m-1 p-2 rounded-lg"
        onClick={logout}
      >
        Logout
      </button>
      <button className="bg-black text-white m-1 p-2 rounded-lg" onClick={auth}>
        Auth
      </button>
      {loading && <ClipLoader />}
      {message && <span>{message}</span>}
      {error && <span>Some error accured</span>}
      {user && (
        <ul>
          {Object.keys(user).map((key: string) => (
            <li key={key}>
              {key}: {user[key as keyof typeof user].toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Buttons;
