import React from "react";
import { Outlet } from "react-router-dom";

function Layout(props) {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
}

export default Layout;
