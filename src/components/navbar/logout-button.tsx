"use client";

import { useUserStore } from "@/store/use-user-store";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const { logout, loading } = useUserStore();
  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      title="logout"
      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center  transition duration-300 ease-in-out"
    >
      {loading ? (
        <Loader className="size-5 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut size={18} />
      )}
      {/* <span className="hidden sm:inline ml-2">Log Out</span> */}
    </button>
  );
};

export default LogoutButton;
