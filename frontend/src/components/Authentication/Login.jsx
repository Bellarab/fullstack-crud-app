import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "../Apis/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Hooks/UseAuth";

function Login(props) {
  const { setAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(true);
  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
      setErrMsg("");
    }
  }, [errMsg]);

  const togglePasswordView = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd]);

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

      const access_token = response?.data?.access_token;
      setAuth({ username, pwd, access_token });

      setUsername("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
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

  return (
    <div className="d-flex flex-column">
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <section className="flex-grow-1 d-flex align-items-center justify-content-center p-5 bg-light">
        <div
          className="w-100 border bg-white rounded shadow p-5"
          style={{ maxWidth: "500px" }}
        >
          <h1 className="h3 fw-bold text-center mb-4">
            One account
            <br />
            Many possibilities
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4 input-group input-group-lg">
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

            {/* Password Field */}
            <div className="mb-4">
              <div className="input-group input-group-lg position-relative">
                <span className="input-group-text fs-5">
                  <FaFingerprint />
                </span>
                <input
                  type={showPassword ? "password" : "text"}
                  className="form-control pe-5"
                  placeholder="Password"
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />

                {/* Eye Icon inside input-group */}
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-4 fs-5 text-muted"
                  role="button"
                  onClick={togglePasswordView}
                  style={{ cursor: "pointer", zIndex: 10 }}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>

            {/* Remember Me */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="persist"
                />
                <label className="form-check-label" htmlFor="persist">
                  Remember me
                </label>
              </div>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="btn btn-dark w-100 btn-lg mb-3">
              Sign in
            </button>

            {/* Google Sign In */}
            {/* <button
              type="button"
              className="btn btn-outline-secondary w-100 btn-lg d-flex align-items-center justify-content-center mb-4"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width="22"
                height="22"
                className="me-2"
              />
              Sign in with Google
            </button> */}

            {/* Sign Up Link */}
            <p className="text-center text-muted fs-6">
              Don't have an account yet?{" "}
              <a
                href="/register"
                className="text-warning text-decoration-none fw-semibold"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
