"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/admin");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DF</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">
              DynamicForm
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center space-x-6">
        
          </div>

          {/* Auth Section */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-[var(--accent-danger)] to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}