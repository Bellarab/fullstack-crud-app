import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./components/Routing/App";
import { AuthProvider } from "./components/Context/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1005769310011-m3ajvq5o02s8l5gn51ungu72bvhbv9ej.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
