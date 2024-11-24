import LoginForm from "./login-form";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
  description: "E-Commerce Store by create next app",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
