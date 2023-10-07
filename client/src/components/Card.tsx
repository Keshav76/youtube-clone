import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Video from "../models/video";
import User from "../models/user";
import axios from "../my-axios";
import timeSince from "../timeSince";
import { toast } from "react-toastify";

type Props = {
  index: Number;
  video: Video;
};

const Card = (props: Props) => {
  let key = props.index;
  const video = props.video;
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
    <Link to={"/video/" + video._id} state={video}>
      <div
        id={"card-" + key}
        className="bg-zinc-900 max-w-xl rounded-lg hover:lg:scale-105 duration-200 transition-all ease-in-out"
      >
        <video
          onMouseOver={videoStart}
          onMouseOut={videoEnd}
          className=" rounded-lg aspect-video bg-zinc-800"
          poster={video.imgUrl}
          muted
          width="100%"
          src={video.videoUrl}
          preload="none"
        ></video>
        <div className="flex flex-row items-start justify-start my-2  gap-3">
          <img
            src={user?.imgUrl}
            alt="_"
            width={30}
            className="rounded-full aspect-square object-cover"
          />
          <div>
            <div>{video.title}</div>
            <div className="text-gray-400">{user?.userId}</div>
            <div className="text-gray-400">
              {video.views.toString()} views
              <FontAwesomeIcon icon={faCircle} width={3} className="mx-1" />
              {timeSince(video.createdAt)} ago
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
