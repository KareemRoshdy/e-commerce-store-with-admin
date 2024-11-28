import { verifyTokenForPages } from "@/utils/verifyToken";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "E-Commerce Store by create next app",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const token = (await cookies()).get("accessToken")?.value as string;

  const user = await verifyTokenForPages(token);
  if (user?.role !== "admin") redirect("/");

  return <div>{children}</div>;
};

export default AdminLayout;
