import React, { useEffect } from "react";
import useLogout from "../Hooks/UseLogout";
import useAuth from "../Hooks/UseAuth";

function Navbar() {
  const logout = useLogout();
  const { auth } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      console.log("Logout promise resolved");
    });
  };

  useEffect(() => {
    if (auth?.username) {
      console.log("User authenticated as:", auth.username);
    } else {
      console.log("No authenticated user");
    }
  }, [auth?.username]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a
          className="navbar-brand"
          style={{ textDecoration: "underline" }}
          href="#"
        >
          <i className="bi bi-check-square me-2 mb-2"></i>My Todo-s
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
          </ul>

          <ul className="navbar-nav">
            {auth?.username ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text text-white me-3">
                    Welcome, <strong>{auth.username}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="nav-link btn btn-link text-white p-0"
                      style={{ textDecoration: "none" }}
                    >
                      Logout<i className="bi bi-box-arrow-right ms-1"></i>
                    </button>
                  </li>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    <i className="bi bi-person"></i> Sign Up
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    <i className="bi bi-box-arrow-in-right"></i> Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
