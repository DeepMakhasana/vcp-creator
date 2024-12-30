import axios from "axios";
import { constants } from "./constants";

export const BASEURL = "https://mjd4dzx78k.execute-api.ap-south-1.amazonaws.com/dev/api";
// export const BASEURL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Fetch the token dynamically from localStorage
      const token = localStorage.getItem(constants.TOKEN);

      if (token) {
        // Set the Authorization header dynamically
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // Remove the Authorization header if no token exists
        delete config.headers["Authorization"];
      }
    }
    return config;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
