import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {};

const Layout = (props: Props) => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden text-sm">
      <Navbar />
      <div
        id="main"
        className="flex flex-row h-[90vh] bg-zinc-900 text-white relative"
      >
        <Sidebar />
        <div className="flex grow ">
          <Outlet />
        </div>
      </div>
      <ToastContainer
        draggable={false}
        theme="colored"
        position="bottom-right"
      />
    </div>
  );
};

export default Layout;
