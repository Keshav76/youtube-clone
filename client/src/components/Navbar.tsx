import React, { useEffect, useState } from "react";
import YoutubeLogo from "../img/youtube.png";

import {
  faSearch,
  faBars,
  faUserPlus,
  faVideo,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../store/store";
import { login, logout } from "../store/reducers/userReducer";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {};

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex flex-row items-center gap-2 my-auto">
        <img src={YoutubeLogo} alt="YT" className="h-10" />
        YouTube <sup>IN</sup>
      </div>
    </Link>
  );
};

const handleSidebarOpenClose = (val: string = "") => {
  const sidebar = document.getElementById("side");
  let sidebarState = sidebar?.style.display;
  sidebarState = sidebarState !== "flex" ? "flex" : "none";
  if (val) sidebarState = val;
  if (sidebar) sidebar.style.display = sidebarState;
};

let searchbarState = "flex";
const handleSearchOpenClose = () => {
  const main = document.getElementById("main");
  const search = document.getElementById("dangling-search");
  if (search) search.style.display = searchbarState;
  if (searchbarState === "none") {
    searchbarState = "flex";
    if (main) main.style.height = "90vh";
  } else {
    searchbarState = "none";
    if (main) main.style.height = "82vh";
  }
};

let wid = 1024;
const onResize = () => {
  const size = window.innerWidth;
  if (wid < 640 && size > 640) {
    searchbarState = "none";
    handleSearchOpenClose();
  }
  if (wid > 640 && size < 640) {
    handleSidebarOpenClose("none");
  }
  wid = size;
};

window.addEventListener("resize", onResize);

const Navbar = (props: Props) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.user);

  var location = useLocation();
  useEffect(() => {
    if (!user.loggedIn) return;
    axios.get("/api/users/find/" + user.currentUser?._id).then((res) => {
      dispatch(login(res.data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const logoutHandle = () => {
    axios.get("/api/auth/logout").then((res) => {
      toast.success(res.data.message);
    });
    dispatch(logout());
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex flex-row justify-between w-screen h-[10vh] items-center bg-zinc-900 m-0 text-white pl-1 pr-4">
        <div className="flex flex-row gap-6 items-center ml-4">
          <button onClick={() => handleSidebarOpenClose()}>
            <FontAwesomeIcon icon={faBars} className="w-5" />
          </button>
          <Logo />
        </div>
        <div className=" sm:block hidden" id="search">
          <form
            className=" border border-[#2f2f2f] rounded-full pl-4 py-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              onChange={(e) => inputChange(e)}
              name="query"
              className="w-[35vw] p-1 bg-zinc-900 border-none rounded-full outline-none px-4 py-1"
            />
            <Link
              to={search ? "/search/" + search : "/"}
              className="bg-zinc-600 w-12 rounded-tr-full rounded-br-full px-4 py-1.5 box-border  border-none"
            >
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 block sm:hidden"
            onClick={handleSearchOpenClose}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <Link to={"/create-video"}>
            <FontAwesomeIcon icon={faVideo} />
          </Link>
          {!user.loggedIn && (
            <div>
              <Link to="/signin">
                <div className="rounded-full w-8 h-8 bg-zinc-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
              </Link>
              {/* <img src={User} alt="user" className="w-8" /> */}
            </div>
          )}
          {user.currentUser != null && (
            <div className="flex gap-1">
              <div className="rounded-full w-8 h-8 bg-zinc-600 flex items-center justify-center overflow-hidden">
                <img src={user.currentUser.imgUrl} alt="_" />
              </div>
              <button
                className="rounded-full w-8 h-8 bg-zinc-600 flex items-center justify-center"
                onClick={logoutHandle}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Extra search line */}
      <div
        id="dangling-search"
        className="hidden w-screen h-[8vh] bg-zinc-900 text-white"
      >
        <form className="flex mx-[10vw] mb-2 mt-0 border border-[#2f2f2f] rounded-full pl-4 py-0">
          <input
            type="text"
            name="query"
            className="p-1 w-[70vw] grow bg-zinc-900 border-none rounded-full outline-none px-4 py-1"
          />
          <button className="bg-zinc-600 w-[10vw] rounded-tr-full rounded-br-full p-1.5 box-border  border-none">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Navbar;
