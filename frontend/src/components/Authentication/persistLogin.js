import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import UseRefreshToken from "../Hooks/UseRefreshToken";
import useAuth from "../Hooks/UseAuth";
import { useNavigate } from "react-router-dom";
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = UseRefreshToken();
  const { auth, setAuth, persist } = useAuth();
  const hasRefreshed = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      if (hasRefreshed.current) return;
      hasRefreshed.current = true;

      try {
        console.log("Refreshing token...");
        const newAccessToken = await refresh();

        if (!newAccessToken) {
          console.warn("No new access token received. Clearing auth.");
          setAuth({});
        } else {
          console.log("Token refreshed:", newAccessToken);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        setAuth({});
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!auth?.access_token && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.access_token, persist, refresh, setAuth]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border " role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
