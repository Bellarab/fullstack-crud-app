import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import UseRefreshToken from "../Hooks/UseRefreshToken";
import useAuth from "../Hooks/UseAuth";
import { useNavigate } from "react-router-dom";

const PersistLogin = () => {
  // Loading state while refreshing token
  const [isLoading, setIsLoading] = useState(true);

  // Custom hook to refresh access token
  const refresh = UseRefreshToken();

  // Auth context and persistence state
  const { auth, setAuth, persist } = useAuth();

  // Ref to prevent multiple refresh calls
  const hasRefreshed = useRef(false);

  // Navigation hook (not currently used, but imported)
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Track component mount status to avoid setting state after unmount

    const verifyRefreshToken = async () => {
      // Prevent multiple refresh attempts
      if (hasRefreshed.current) return;
      hasRefreshed.current = true;

      try {
        console.log("Refreshing token...");
        // Attempt to refresh the token
        const newAccessToken = await refresh();

        if (!newAccessToken) {
          console.warn("No new access token received. Clearing auth.");
          setAuth({}); // Clear auth if refresh failed or no token received
        } else {
          console.log("Token refreshed:", newAccessToken);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        setAuth({}); // Clear auth on error
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) setIsLoading(false);
      }
    };

    // Refresh token if no current access token and persist option is enabled
    if (!auth?.access_token && persist) {
      verifyRefreshToken();
    } else {
      // No refresh needed, loading complete
      setIsLoading(false);
    }

    // Cleanup function to update mount status on unmount
    return () => {
      isMounted = false;
    };
  }, [auth?.access_token, persist, refresh, setAuth]);

  return (
    <>
      {/* If persist is off, render child routes immediately */}
      {!persist ? (
        <Outlet />
      ) : // Show spinner while loading (refreshing token)
      isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        // Once loading finished, render child routes
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
