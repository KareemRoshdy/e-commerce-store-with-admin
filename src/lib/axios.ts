import axios from "axios";

const URL = "https://e-commerce-store-with-admin.vercel.app";

const axiosInstance = axios.create({
  baseURL: `${URL}/api`,
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
