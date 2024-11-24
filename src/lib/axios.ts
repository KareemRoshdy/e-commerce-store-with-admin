import axios from "axios";

const URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: `${URL}/api`,
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
