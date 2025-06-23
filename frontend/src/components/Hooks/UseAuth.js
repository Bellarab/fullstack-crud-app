import { useContext } from "react";
import AuthContext from "../Context/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext); //	Allows other components to access or update the auth state
};

export default useAuth;
