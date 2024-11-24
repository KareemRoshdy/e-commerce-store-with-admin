import SignUpForm from "./signup-form";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account",
  description: "E-Commerce Store by create next app",
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
