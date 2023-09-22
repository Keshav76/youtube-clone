import React, { useEffect, useState } from "react";

import CardLong from "../components/CardLong";

import { useParams } from "react-router-dom";
import Video from "../models/video";
import axios from "axios";
import { toast } from "react-toastify";

const SearchResult = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    axios
      .get("/api/videos/search/name/?q=" + query)
      .then((res) => setVideos(res.data))
      .catch((err) => {
        if (!err.response || !err.response.data || !err.response.data.message) {
          toast.error("Server error");
          return;
        }
        toast.error(err.response.data.message);
      });
    if (videos.length === 0) toast.warn("No videos found");
  }, [query]);
  return (
    <div className="overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded w-full">
      {videos.map((ele, ind) => (
        <CardLong key={ind} index={ind} video={ele} />
      ))}
    </div>
  );
};

export default SearchResult;
