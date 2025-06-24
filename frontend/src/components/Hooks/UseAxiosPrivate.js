import axiosPrivate from "../Apis/axios";
import { useEffect } from "react";
import UseRefreshToken from "./UseRefreshToken";
import UseAuth from "./UseAuth";

// Custom hook that returns a configured Axios instance for authenticated requests
const UseAxiosPrivate = () => {
  const refresh = UseRefreshToken();
  // Get the current authentication state (contains accessToken)
  const { auth } = UseAuth();
  console.log("in axiosPrivate use");
  useEffect(() => {
    // Add a request interceptor to attach the Authorization header before each request
    //The request interceptor runs before the request is sent, to add the access token.
    //console.log("axiosPRV token " + auth?.access_token);
    console.log("token in axios prv :" + auth.access_token);
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // If there's no Authorization header, add one using the access token
        if (!config.headers["Authorization"]) {
          console.log("Access token found:", auth.access_token);
          config.headers["Authorization"] = `Bearer ${auth?.access_token}`;
        } else {
          console.log("No access token available");
        }
        return config; // Proceed with the request
      },
      (error) => Promise.reject(error) // Forward any request errors
    );

    // Add a response interceptor to handle expired tokens (403 errors)
    //The response interceptor runs after the request is sent and a response is received.
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, // If response is successful, just return it
      async (error) => {
        const prevRequest = error?.config; // Save the failed request config
        // If the response is 403 (Forbidden) and we haven't retried this request yet
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true; // Mark this request as already retried
          const newAccessToken = await refresh(); // Refresh the access token
          // Attach the new token to the Authorization header and retry the request
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest); // Retry the failed request with new token
        }
        return Promise.reject(error); // Forward any other errors
      }
    );

    // Cleanup: remove interceptors when component unmounts or dependencies change
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]); // Dependencies for useEffect: update if auth or refresh changes

  // Return the configured Axios instance for use in API calls
  return axiosPrivate;
};

export default UseAxiosPrivate;
