import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "../Apis/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Hooks/UseAuth";
import { GoogleLogin } from "@react-oauth/google";

function Login(props) {
  // Auth and persistence state from custom hook
  const { setAuth, setPersist, persist } = useAuth();

  // Show or hide password state
  const [showPassword, setShowPassword] = useState(true);

  // Refs and states for form fields
  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Navigation and location to redirect after login
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Focus the username input on component mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Clear error message when username or password changes
  useEffect(() => {
    setErrMsg("");
  }, [username, pwd]);

  // Show toast notification if there's an error message
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
      setErrMsg("");
    }
  }, [errMsg]);

  // Handle toggling the password visibility
  const togglePasswordView = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, pwd);

    try {
      const response = await axios.post(
        "/login",
        JSON.stringify({ username, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Extract tokens and user data from response
      const access_token = response?.data?.access_token;
      const userId = response?.data?.userId;

      // Set authentication state
      setAuth({ username, pwd, access_token, userId });

      console.log(response?.data);

      // Reset form fields
      setUsername("");
      setPwd("");

      // Redirect user to the page they came from or home
      navigate(from, { replace: true });
    } catch (err) {
      // Error handling based on response status
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  // Toggle "Remember me" persistence state
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  // Persist "Remember me" setting in localStorage
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  // Handle Google OAuth login success
  const handleLoginSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    console.log(" Received Google Token:", googleToken);

    try {
      const res = await axios.post(
        "/oauth-login",
        { token: googleToken },
        {
          withCredentials: true,
        }
      );

      // Extract auth info from backend response
      const { access_token, userId, username } = res.data;

      console.log(" Response from backend:", res);
      console.log(" Parsed JWT:", access_token);
      console.log(" User ID from backend:", userId);
      console.log(" Username from backend:", username);

      // Update auth context state
      setAuth({ access_token, userId, username });
      console.log(" Auth state set!");

      // Redirect after successful OAuth login
      navigate(from, { replace: true });
      console.log(" Navigated to:", from);
    } catch (err) {
      console.error(" Google login failed:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <section className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="border bg-white rounded shadow p-4 p-md-5 rounded-4">
                {/* Header */}
                <h2
                  className="card-title text-center mb-2 fw-semibold"
                  style={{
                    fontSize: "2.2rem",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Organize Your Day
                </h2>
                <p
                  className="text-center text-muted mb-3 fst-italic"
                  style={{
                    fontSize: "1.1rem",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Manage tasks effortlessly, boost your productivity
                </p>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Username Input */}
                  <div className="mb-4 input-group">
                    <span className="input-group-text fs-5">
                      <MdAlternateEmail />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      ref={userRef}
                      autoComplete="off"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  {/* Password Input with toggle visibility */}
                  <div className="mb-4">
                    <div className="input-group position-relative w-100">
                      <span className="input-group-text fs-5">
                        <FaFingerprint />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        required
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3 fs-5 text-muted"
                        role="button"
                        onClick={togglePasswordView}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                      />
                      <label className="form-check-label" htmlFor="persist">
                        Remember me
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 btn-lg mb-3"
                  >
                    Sign in
                  </button>

                  {/* Google OAuth Login Button */}
                  <div className="w-100 mb-3">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={() => console.log("Login Failed")}
                    />
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-muted fs-6">
                    Don't have an account yet?{" "}
                    <a
                      href="/register"
                      className="text-primary text-decoration-none fs-6"
                    >
                      Sign up
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
