import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { State } from "../store/store";
import Video from "../models/video";
import axios from "axios";

type Props = {};

const History = (props: Props) => {
  const user = useSelector((state: State) => state.user);
  const [video, setVideo] = useState<Video[]>([]);
  useEffect(() => {
    const getVideos = async () => {
      axios
        .get("/api/users/history")
        .then((res) => setVideo(res.data))
        .catch((err) => console.log(err));
    };
    getVideos();
  }, []);

  return (
    <div className="overflow-scroll h-full w-full box-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 p-4">
      <div className="text-3xl m-4">
        History <FontAwesomeIcon icon={faHistory} className="mx-3" />{" "}
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 ">
        {user.currentUser &&
          video.map((ele, ind) => <Card key={ind} index={ind} video={ele} />)}
        {!user.currentUser && (
          <div className="mx-4 text-lg">Login to see history...</div>
        )}
      </div>
    </div>
  );
};

export default History;
