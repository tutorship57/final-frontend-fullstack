import React, {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AuthContext, type User } from "./type";
import { apiFetch } from "../components/utils/api";


// 2. Create the Context


// 3. Create the Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Here is your exact function!
  const fetchUser = async () => {
    try {
      const response = await apiFetch("/auth/me", {
        method: "GET",
        credentials: "include", // REQUIRED for HttpOnly cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Save the user data to global state
      } else {
        setUser(null); // Not logged in
      }
    } catch (error) {
      console.error("Not logged in or network error", error);
      setUser(null);
    } finally {
      setLoading(false); // Done checking
    }
  };

  // Run this once when the application first loads
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};  


