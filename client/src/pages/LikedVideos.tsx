import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Video from "../models/video";
import { useSelector } from "react-redux";
import { State } from "../store/store";

type Props = {};

const LikedVideos = (props: Props) => {
  const { user } = useSelector((state: State) => state);
  const [video, setVideo] = useState<Video[]>([]);
  useEffect(() => {
    const getVideos = async () => {
      axios
        .get("/api/users/liked")
        .then((res) => setVideo(res.data))
        .catch((err) => console.log(err));
    };
    getVideos();
  }, []);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">
        Liked Videos <FontAwesomeIcon icon={faThumbsUp} className="mx-3" />{" "}
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {user.currentUser &&
          video.map((ele, ind) => <Card key={ind} index={ind} video={ele} />)}
        {!user.currentUser && (
          <div className="mx-4 text-lg">Login to see your liked videos...</div>
        )}
      </div>
    </div>
  );
};

export default LikedVideos;
