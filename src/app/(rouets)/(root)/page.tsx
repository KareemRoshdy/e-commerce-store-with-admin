import { Metadata } from "next";
import Home from "./_components/home-page";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "Home",
  description: "E-Commerce Store by create next app",
};

const HomePage = () => {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
};

export default HomePage;
