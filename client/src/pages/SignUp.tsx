import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faImage,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { login } from "../store/reducers/userReducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

type Props = {};

const SignUp = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  const [data, setData] = React.useState({
    userId: "",
    email: "",
    password: "",
    imgUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const imageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const storage = getStorage();
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      console.error,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newData = { ...data, imgUrl: downloadURL };
          setData(newData);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  const handleSignup = async () => {
    if (data.email === "" || data.password === "" || data.userId === "") {
      alert("Please fill all the fields");
      return;
    }
    const emailFormat = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailFormat.test(data.email)) {
      alert("Please enter a valid email");
      return;
    }
    axios
      .post("/api/auth/signup", data)
      .then((res) => {
        dispatch(login(res.data));
        navigate(-2);
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
            navigate(-2);
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
          onSubmit={(e) => e.preventDefault()}
          id="signup-form"
        >
          <div className="text-3xl">Sign Up</div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex">
              <div className="w-5/6">
                <label htmlFor="userId">User Id:</label>
                <div className="p-2 w-full flex items-center gap-4 border-b-2  border-b-white">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    type="text"
                    name="userId"
                    className="grow bg-transparent outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="w-1/6 flex items-center justify-center ">
                <div className="w-3/4 aspect-square flex items-center justify-center rounded-full bg-zinc-600 cursor-pointer overflow-hidden">
                  <label htmlFor="user-img">
                    {progress === 0 && (
                      <FontAwesomeIcon icon={faImage} size="lg" />
                    )}
                    {progress > 0 && progress < 100 && <>{progress}%</>}
                    {data.imgUrl && <img src={data.imgUrl} alt="" />}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="user-img"
                    id="user-img"
                    className="hidden"
                    onChange={imageInput}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="email">Email</label>
              <div className="p-2 w-full flex items-center gap-4 border-b-2  border-b-white">
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  className="grow bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="password">Password</label>
              <div className="p-2 w-full flex items-center gap-4 border-b-2  border-b-white">
                <FontAwesomeIcon icon={faLock} />
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  className="grow bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between w-full">
              <input
                type="submit"
                value="Sign Up"
                name="submit"
                onClick={handleSignup}
                className="p-2 px-4 rounded-lg bg-zinc-900 cursor-pointer"
              />
              <button
                onClick={handleGoogleLogin}
                className="p-2 px-4 rounded-full bg-zinc-900"
              >
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>
          </div>
          <Link to="/signin">Existing user, Sign In</Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
