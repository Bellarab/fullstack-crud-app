import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "../Apis/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Hooks/UseAuth";

function Login(props) {
  const { setAuth, setPersist, persist } = useAuth();

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
      const userId = response?.data?.userId;
      setAuth({ username, pwd, access_token, userId });
      console.log("username while loggin in : " + username);
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
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <section className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="border bg-white rounded shadow p-4 p-md-5 rounded-4">
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

                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
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

                  {/* Password Field */}
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

                  {/* Remember Me */}
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

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 btn-lg mb-3"
                  >
                    Sign in
                  </button>

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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
