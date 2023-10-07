import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "../my-axios";
import Video from "../models/video";
import { useSelector } from "react-redux";
import { State } from "../store/store";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};

const SubUserVideos = (props: Props) => {
  const { user } = useSelector((state: State) => state);
  const { name, id } = useParams();
  const [video, setVideo] = useState<Video[]>([]);
  useEffect(() => {
    const getVideos = async () => {
      axios
        .get("/api/videos/user-video/" + id)
        .then((res) => setVideo(res.data))
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
    getVideos();
  }, [id]);
  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">{name}</div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {user.currentUser &&
          video.map((ele, ind) => <Card key={ind} index={ind} video={ele} />)}
        {!user.currentUser && (
          <div className="mx-4 text-lg">Login to see this content..</div>
        )}
      </div>
    </div>
  );
};

export default SubUserVideos;
