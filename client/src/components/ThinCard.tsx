import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Video from "../models/video";
import User from "../models/user";
import axios from "axios";
import timeSince from "../timeSince";
import { toast } from "react-toastify";

type Props = {
  index: Number;
  video: Video;
};

const ThinCard = (props: Props) => {
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
  return (
    <Link to={"/video/" + video._id}>
      <div className="flex items-center">
        <img
          src={video.imgUrl}
          alt="_"
          className="aspect-video object-contain bg-zinc-800 w-1/2 rounded-lg"
        />
        <div className="mx-4">
          <div>{video.title}</div>
          <div className="text-zinc-400">
            <div>{user?.userId}</div>
            <div className="flex">
              {video.views.toString()} views
              <div className="hidden xl:block">
                <FontAwesomeIcon icon={faCircle} width={5} className="mx-2" />
                {timeSince(video.createdAt)} ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThinCard;
