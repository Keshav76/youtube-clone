import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import Video from "../models/video";
import axios from "axios";

type Props = {};

const Trending = (props: Props) => {
  const [video, setVideo] = useState<Video[]>([]);
  useEffect(() => {
    const getVideos = async () => {
      axios
        .get("/api/videos/trending")
        .then((res) => setVideo(res.data))
        .catch((err) => console.log(err));
    };
    getVideos();
  }, []);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">
        Trending <FontAwesomeIcon icon={faFire} className="mx-3" />{" "}
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {video.map((ele, ind) => (
          <Card key={ind} index={ind} video={ele} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
