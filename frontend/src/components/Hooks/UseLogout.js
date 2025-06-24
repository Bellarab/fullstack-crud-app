import axios from "axios";
import UseAuth from "./UseAuth";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
function useLogout() {
  const { auth, setAuth } = UseAuth();
  const navigate = useNavigate();

  return async () => {
    console.log("Logout function called");

    try {
      console.log("accesstoken : " + auth?.access_token);
      const response = await axios.post(
        "http://localhost:8080/logout",
        {}, // no body
        {
          headers: {
            Authorization: `Bearer ${auth?.access_token}`, // send token
            "Content-Type": "application/json",
          },
          withCredentials: true, // in case you're using cookies too
        }
      );
      googleLogout();
      console.log("Logout response:", response);

      setAuth({}); // clear local auth context
      console.log("Navigating to login...");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.error("Logout failed - Server responded:", err.response.data);
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("Logout failed - No response received:", err.request);
      } else {
        console.error("Logout failed - Request setup error:", err.message);
      }
    }
  };
}

export default useLogout;
