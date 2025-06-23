import axios from "../Apis/axios";
import useAuth from "./UseAuth";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate(); // for redirection

  const refresh = async () => {
    try {
      const response = await axios.post("/refresh_token", null, {
        withCredentials: true,
      });

      setAuth((prev) => {
        console.log("Refreshed token:", response.data.access_token);
        return {
          ...prev,
          access_token: response.data.access_token,
          username: response.data.username,
          userId: response.data.userId,
        };
      });

      return response.data.access_token;
    } catch (err) {
      console.error("Refresh token failed:", err);
      setAuth({});
      navigate("/login", { replace: true }); // redirect to login on failure
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
