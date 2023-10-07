import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Video from "../models/video";
import timeSince from "../timeSince";
import User from "../models/user";
import axios from "../my-axios";
import { toast } from "react-toastify";

type Props = {
  index: Number;
  video: Video;
};

const Card = (props: Props) => {
  let key = props.index;
  const { video } = props;

  const [user, setUser] = useState<User>();
  useEffect(() => {
    const getUser = async () => {
      axios
        .get("/api/users/find/" + video.userId)
        .then((res) => setUser(res.data))
        .catch((err) => {
          if (
            !err.response ||
            !err.response.data ||
            !err.response.data.message
          ) {
            toast.error("Server error");
            return;
          }
          toast.error(err.response.data.message);
        });
    };
    getUser();
  }, [video]);

  const videoStart = async () => {
    const vid = document.getElementById("card-" + key)?.querySelector("video");
    if (vid?.readyState !== 4) vid?.load();
    vid?.play().catch((err) => {});
  };

  const videoEnd = () => {
    const vid = document.getElementById("card-" + key)?.querySelector("video");
    vid?.pause();
    vid?.load();
  };

  return (
    <Link to={"/video/" + video._id} state={{ props }}>
      <div
        id={"card-" + key}
        className="flex flex-col md:flex-row bg-zinc-900 rounded-lg duration-200 transition-all ease-in-out mx-10 my-3 gap-4"
      >
        <video
          onMouseOver={videoStart}
          onMouseOut={videoEnd}
          className="rounded-lg w-full md:w-2/6 aspect-video bg-zinc-800"
          poster={video.imgUrl}
          muted
          width="100%"
          src={video.videoUrl}
          preload="none"
        ></video>
        {/* <div className=" items-start justify-start my-2  gap-3"> */}
        <div className="flex flex-col">
          <div className="text-lg">{video.title}</div>
          <div className="text-gray-400">
            {video.views.toString()} views
            <FontAwesomeIcon icon={faCircle} width={3} className="mx-1" />
            {timeSince(video.createdAt)} ago
          </div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={user?.imgUrl}
              alt="_"
              width={30}
              className="rounded-full"
            />
            <div className="text-gray-400">{user?.userId}</div>
          </div>
          <div className="hidden md:block">Description: {video.desc}</div>
        </div>
        {/* </div> */}
      </div>
    </Link>
  );
};

export default Card;
