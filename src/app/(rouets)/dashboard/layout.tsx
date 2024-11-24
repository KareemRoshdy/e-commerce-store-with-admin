import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "E-Commerce Store by create next app",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <div>{children}</div>;
};

export default AdminLayout;
