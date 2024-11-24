import { Metadata } from "next";
import Home from "./_components/home-page";
export const metadata: Metadata = {
  title: "Home",
  description: "E-Commerce Store by create next app",
};

const HomePage = () => {
  return <Home />;
};

export default HomePage;
