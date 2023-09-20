import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import Video from "../models/video";

type Props = {};

const Home = (props: Props) => {
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    const fetchVideos = async () => {
      axios
        .get("/api/videos/random")
        .then((res) => setVideos(res.data))
        .catch((err) => console.log(err));
    };
    fetchVideos();
  }, []);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 p-4">
      {videos.map((ele, i) => {
        return <Card key={i} index={i} video={ele} />;
      })}
    </div>
  );
};

export default Home;
