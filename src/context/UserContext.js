"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "@/utils/fetchUser";

const UserContext = createContext({ user: null, isLoggedIn: false, loading: true });

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
