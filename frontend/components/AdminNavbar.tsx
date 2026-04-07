"use client";

import { useRouter, usePathname } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItem = (path: string, label: string) => (
    <button
      onClick={() => router.push(path)}
      className={`px-4 py-2 rounded-lg ${
        pathname === path
          ? "bg-black text-white"
          : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-4 p-4 border-b">
      {navItem("/admin/question", "Add Question")}
      {navItem("/admin/response", "View Responses")}
    </div>
  );
}