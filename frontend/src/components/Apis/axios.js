import axios from "axios";

const BASE_URL = "http://localhost:8080";

export default axios.create({
  baseURL: BASE_URL,
});

// Export a named Axios instance for private (authenticated) requests
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }, // Set the default content type for JSON
  withCredentials: true, // Include cookies (e.g., refresh tokens) with each request
});
