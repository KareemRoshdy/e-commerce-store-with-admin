import axios from "axios";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://e-commerce-store-with-admin.vercel.app";

const axiosInstance = axios.create({
  baseURL: `${URL}/api`,
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
