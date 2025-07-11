import { useRef, useState, useEffect } from "react";
import {
  FaUserCircle,
  FaFingerprint,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../Apis/axios";
import { useNavigate } from "react-router-dom";

// Regex patterns for validation
const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const navigate = useNavigate();

  // Refs for focusing inputs and error messages
  const userRef = useRef();
  const errRef = useRef();

  // Username state and validation
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  // Email state and validation
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  // Password state and validation
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // Confirm password state and validation
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // Error and success messages
  const [errMsg, setErrMsg] = useState("");
  const [APIerrMsg, setAPIErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if username or email already exists
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Focus username input on mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate username on change
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  // Validate email and set specific error messages
  useEffect(() => {
    if (email === "") {
      setValidEmail(false);
      setErrMsg("");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      if (!email.includes("@")) {
        setErrMsg("Missing '@' symbol.");
      } else if (!/\.[a-zA-Z]{2,}$/.test(email)) {
        setErrMsg("Domain extension is missing or invalid.");
      } else if (/[^a-zA-Z0-9@._%+-]/.test(email)) {
        setErrMsg("Invalid characters used.");
      } else {
        setErrMsg("Email format is incorrect.");
      }
      setValidEmail(false);
    } else {
      setErrMsg("");
      setValidEmail(true);
    }
  }, [email]);

  // Validate password and confirm password match
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // Clear error message when relevant inputs change
  useEffect(() => {
    setErrMsg("");
  }, [username, pwd, matchPwd]);

  // Navigate to login on successful registration
  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordView = () => setShowPassword((prev) => !prev);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if inputs invalid or username/email taken
    if (
      !validUsername ||
      !validEmail ||
      !validPwd ||
      !validMatch ||
      usernameExists ||
      emailExists
    ) {
      setErrMsg("Invalid Entry or already taken.");
      return;
    }

    try {
      const userData = {
        username,
        email,
        password: pwd,
        role: "USER",
      };

      // Send registration request
      const response = await axios.post("/register", userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log(response?.data);
      setSuccess(true);

      // Reset form fields
      setUsername("");
      setEmail("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setAPIErrMsg("No Server Response");
      } else if (err.response?.status === 403) {
        setAPIErrMsg("Username or Email Taken");
      } else {
        setAPIErrMsg("Registration Failed");
      }
      errRef.current?.focus();
    }
  };

  // Show API error messages as toast notifications
  useEffect(() => {
    if (APIerrMsg) {
      toast.error(APIerrMsg);
      setAPIErrMsg("");
    }
  }, [APIerrMsg]);

  // Check availability of username and email by querying backend
  const checkUsernameAndEmail = async (username, email) => {
    try {
      const response = await axios.get("/api/users/exists", {
        params: {
          username: username || undefined,
          email: email || undefined,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      return { usernameExists: false, emailExists: false };
    }
  };

  // Debounced username availability check
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (validUsername) {
        checkUsernameAndEmail(username, "").then((res) =>
          setUsernameExists(res.usernameExists)
        );
      } else {
        setUsernameExists(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [username, validUsername]);

  // Debounced email availability check
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (validEmail) {
        checkUsernameAndEmail("", email).then((res) =>
          setEmailExists(res.emailExists)
        );
      } else {
        setEmailExists(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email, validEmail]);

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-white"
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card shadow p-3 p-md-4 my-4 rounded-4">
              <div className="card-body">
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
                  Welcome to your To-Do's
                </h2>
                <p
                  className="text-center text-muted mb-3 fst-italic"
                  style={{
                    fontSize: "1.1rem",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Stay organized, stay productive.
                </p>

                {/* Registration form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Username Input */}
                  <div className="mb-3 position-relative">
                    <div className="input-group">
                      <span className="input-group-text fs-5">
                        <FaUserCircle />
                      </span>
                      <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="form-control"
                        ref={userRef}
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        aria-describedby="usernameHelp"
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                      />
                      {/* Validation Icons */}
                      {validUsername && !usernameExists && (
                        <span className="input-group-text text-success">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {username && (!validUsername || usernameExists) && (
                        <span className="input-group-text text-danger">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </div>

                    {/* Username error/info messages */}
                    {usernameExists && (
                      <div className="form-text text-danger d-flex align-items-center mt-1 small">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                        Username is already taken.
                      </div>
                    )}
                    {usernameFocus && username && !validUsername && (
                      <div
                        id="usernameHelp"
                        className="form-text text-danger d-flex align-items-center mt-1 small"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                        3 to 24 characters, start with a letter. Letters,
                        numbers, underscores, hyphens allowed.
                      </div>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="mb-3 position-relative">
                    <div className="input-group">
                      <span className="input-group-text fs-5">
                        <MdAlternateEmail />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-describedby="emailHelp"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        autoComplete="off"
                        placeholder="Enter your email"
                      />
                      {/* Validation Icons */}
                      {validEmail && !emailExists && (
                        <span className="input-group-text text-success">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {email && (!validEmail || emailExists) && (
                        <span className="input-group-text text-danger">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                    </div>

                    {/* Email error/info messages */}
                    {email && emailExists && (
                      <div className="form-text text-danger d-flex align-items-center mt-1 small">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                        Email is already registered.
                      </div>
                    )}
                    {emailFocus && email && !validEmail && (
                      <div
                        id="emailHelp"
                        className="form-text text-danger d-flex align-items-center mt-1 small"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                        {errMsg}
                      </div>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="mb-3 position-relative">
                    <div className="input-group">
                      <span className="input-group-text fs-5">
                        <FaFingerprint />
                      </span>
                      <input
                        type={showPassword ? "password" : "text"}
                        id="password"
                        className="form-control"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        aria-describedby="passwordHelp"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        placeholder="Type password"
                      />
                      {/* Validation Icons */}
                      {validPwd && (
                        <span className="input-group-text text-success">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {!validPwd && pwd && (
                        <span className="input-group-text text-danger">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                      {/* Toggle password visibility */}
                      <span
                        className="input-group-text cursor-pointer fs-5"
                        onClick={togglePasswordView}
                        role="button"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </div>

                    {/* Password requirements */}
                    {pwdFocus && !validPwd && (
                      <div
                        id="passwordHelp"
                        className="form-text text-danger d-flex flex-column mt-1 small"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="mb-1" />
                        <span>8 to 24 characters.</span>
                        <span>
                          Must include uppercase and lowercase letters, a
                          number, and a special character (! @ # $ %).
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="mb-3 position-relative">
                    <div className="input-group">
                      <span className="input-group-text fs-5">
                        <FaFingerprint />
                      </span>
                      <input
                        type={showPassword ? "password" : "text"}
                        id="confirm_pwd"
                        className="form-control"
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        required
                        aria-describedby="confirmHelp"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        placeholder="Confirm password"
                      />
                      {/* Validation Icons */}
                      {validMatch && matchPwd && (
                        <span className="input-group-text text-success">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                      {!validMatch && matchPwd && (
                        <span className="input-group-text text-danger">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      )}
                      {/* Toggle password visibility */}
                      <span
                        className="input-group-text cursor-pointer fs-5"
                        onClick={togglePasswordView}
                        role="button"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </div>

                    {/* Confirm password match message */}
                    {matchFocus && !validMatch && (
                      <div
                        id="confirmHelp"
                        className="form-text text-danger d-flex align-items-center mt-1 small"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                        Must match the first password input field.
                      </div>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={
                      !validUsername || !validEmail || !validPwd || !validMatch
                    }
                    className="btn btn-dark w-100 fs-5 "
                  >
                    Sign up
                  </button>

                  {/* Link to login page */}
                  <p className="text-center text-muted small mt-3">
                    Have an account?{" "}
                    <a
                      href="/login"
                      className="text-primary text-decoration-none fs-6"
                    >
                      Sign in
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
