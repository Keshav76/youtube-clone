import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Video from "../models/video";
import axios from "axios";
import { useParams } from "react-router-dom";

type Props = {};

const Playlist = (props: Props) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const { name } = useParams();
  useEffect(() => {
    axios
      .get("/api/users/playlists/" + name)
      .then((res) => setVideos(res.data))
      .catch((err) => console.log(err));
  }, [name]);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">
        {name} <FontAwesomeIcon icon={faPlay} className="mx-3" />
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {videos.map((ele, ind) => (
          <Card key={ind} index={ind} video={ele} />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
