import Footer from "@/components/Footer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cart",
  description: "E-Commerce Store by create next app",
};

interface CartLayoutProps {
  children: React.ReactNode;
}

const CartLayout = ({ children }: CartLayoutProps) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default CartLayout;
