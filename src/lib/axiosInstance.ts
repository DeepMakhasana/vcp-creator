import axios from "axios";
import { constants } from "./constants";

export const BASEURL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up the token (this example assumes token is stored in localStorage)
const token = localStorage.getItem(constants.TOKEN);

if (token) {
  // Set the Authorization header with the Bearer token
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  delete axiosInstance.defaults.headers.common["Authorization"];
}

export default axiosInstance;
