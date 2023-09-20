import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Video from "../models/video";
import axios from "axios";
import { useSelector } from "react-redux";
import { State } from "../store/store";

type Props = {};

const YourVideos = (props: Props) => {
  const { user } = useSelector((state: State) => state);
  const [video, setVideo] = useState<Video[]>([]);
  useEffect(() => {
    const getVideos = async () => {
      axios
        .get("/api/users/user-videos")
        .then((res) => setVideo(res.data))
        .catch((err) => console.log(err));
    };
    getVideos();
  }, []);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">
        Your Videos <FontAwesomeIcon icon={faPlay} className="mx-3" />{" "}
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {user.currentUser &&
          video.map((ele, ind) => <Card key={ind} index={ind} video={ele} />)}
        {!user.currentUser && (
          <div className="mx-4 text-lg">Login to see your videos...</div>
        )}
      </div>
    </div>
  );
};

export default YourVideos;
