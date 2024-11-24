import { cookies } from "next/headers";
import { checkIsAdmin } from "@/utils/verifyToken";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const Actions = async () => {
  const token = (await cookies()).get("refreshToken");
  const refreshToken = token?.value;

  const user = await checkIsAdmin(refreshToken!);

  return (
    <div>
      {user && (
        <Link
          href={"/cart"}
          className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
          ease-in-out"
        >
          <ShoppingCart
            className="inline-block mr-1 group-hover:text-emerald-400"
            size={20}
          />
          <span className="hidden sm:inline">Cart</span>

          <span
            className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                  text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
          >
            3
          </span>
        </Link>
      )}
    </div>
  );
};

export default Actions;
