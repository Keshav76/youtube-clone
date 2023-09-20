import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import { login } from "../store/reducers/userReducer";

type Props = {};

const Signin = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async () => {
    const form = new FormData(
      document.getElementById("login-form") as HTMLFormElement
    );
    const data = Object.fromEntries(form);
    axios
      .post("/api/auth/signin", data)
      .then((res) => {
        dispatch(login(res.data));
        navigate(-1);
      })
      .catch((err) => alert(err.response.data.message));
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        axios
          .post("/api/auth/google", {
            userId: res.user.displayName,
            email: res.user.email,
            imgUrl: res.user.photoURL,
          })
          .then((res) => {
            dispatch(login(res.data));
            navigate(-1);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="grow w-full md:w-1/3 lg:w-1/4 bg-zinc-800 md:rounded-lg md:my-4">
        <form
          className=" flex flex-col items-center p-5 h-full justify-around"
          id="login-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="text-3xl">Login</div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full">
              <label htmlFor="email">Email</label>
              <div className="p-2 w-full flex items-center gap-4 border-b-2  border-b-white">
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  name="email"
                  className="grow bg-transparent outline-none"
                  id="signin-userId"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="password">Password</label>
              <div className="p-2 w-full flex items-center gap-4 border-b-2  border-b-white">
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  name="password"
                  id="signin-password"
                  className="grow bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <input
                type="submit"
                value="Sign In"
                name="submit"
                className="p-2 px-4 rounded-lg bg-zinc-900 cursor-pointer"
                onClick={handleSignin}
              />
              <button
                className="p-2 px-4 rounded-full bg-zinc-900"
                onClick={handleGoogleLogin}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>
          </div>
          <Link to="/signup">New user, Sign Up</Link>
        </form>
      </div>
    </div>
  );
};

export default Signin;
