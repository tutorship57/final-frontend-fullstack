import { createContext, useContext } from "react";

export interface User {
  userId: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};