import React, { useEffect, useState } from "react";

import CardLong from "../components/CardLong";

import { useParams } from "react-router-dom";
import Video from "../models/video";
import axios from "axios";

const SearchResult = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    axios
      .get("/api/videos/search/name/?q=" + query)
      .then((res) => setVideos(res.data))
      .catch((err) => console.log(err));
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
