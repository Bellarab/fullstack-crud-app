import UseAuth from "./UseAuth";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import UseAxiosPrivate from "../Hooks/UseAxiosPrivate";
function useLogout() {
  const { auth, setAuth } = UseAuth();
  const navigate = useNavigate();
  const axiosPrivate = UseAxiosPrivate();
  return async () => {
    console.log("Logout function called");

    try {
      console.log("accesstoken : " + auth?.access_token);
      const response = await axiosPrivate.post(
        "/logout",
        {} // no body
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
