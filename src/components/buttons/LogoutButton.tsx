// components/LogoutButton.tsx
import React, { useState } from "react";
import { apiFetch } from "../utils/api";

const LogoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  setIsLoading(true);
  try {
    const response = await apiFetch("/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      // 1. Clear any metadata in localStorage
      localStorage.removeItem("user"); 
      localStorage.removeItem("token"); 
    
      window.location.href = "/login"; 
    } else {
      console.error("Logout failed on server");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;