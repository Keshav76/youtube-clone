import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ThinCard from "../components/ThinCard";
import Comment from "../components/Comment";

import timeSince from "../timeSince";
import { State } from "../store/store";
import User from "../models/user";
import Video from "../models/video";
import CommentType from "../models/comments";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState<User>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  let currentUser = useSelector((state: State) => state.user.currentUser);
  const me = currentUser?._id;

  useEffect(() => {
    const getData = async () => {
      let a = "1";
      await axios
        .put("/api/videos/view/" + id)
        .catch((err) => console.log(err));
      await axios
        .get("/api/videos/get/" + id)
        .then((res) => {
          a = res.data.userId;
          setVideo(res.data);
          setLikes(res.data.likes.length);
          if (me && res.data.likes.includes(me)) {
            setLiked(true);
          }
          if (me && res.data.dislikes.includes(me)) {
            setDisliked(true);
          }
        })
        .catch((err) => console.log(err));

      await axios
        .get("/api/users/find/" + a)
        .then((res) => {
          setUser(res.data);
          console.log(currentUser, res.data);
          if (currentUser?.subscribedUsers.includes(res.data._id)) {
            setSubscribed(true);
          }
        })
        .catch((err) => console.log(err));

      await axios
        .get("/api/comments/get/" + id)
        .then((res) => setComments(res.data))
        .catch((err) => console.log(err));

      await axios
        .get("/api/videos/random")
        .then((res) => setVideos(res.data))
        .catch((err) => console.log(err));
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, id]);

  const likehandle = () => {
    axios
      .post("/api/users/" + (liked ? "unlike/" : "like/") + id)
      .then((res) => {
        setDisliked(false);
        setLikes(likes + (liked ? -1 : 1));
        setLiked(!liked);
      })
      .catch((err) => console.log(err));
  };

  const dislikeHandle = () => {
    axios
      .post("/api/users/" + (disliked ? "un" : "") + "dislike/" + id)
      .then((res) => {
        if (liked) {
          setLikes(likes - 1);
          setLiked(false);
        }
        setDisliked(!disliked);
      })
      .catch((err) => console.log(err));
  };

  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inp = document.getElementById("comment-box") as HTMLInputElement;
    axios
      .post("/api/comments/create/" + id, { desc: inp.value })
      .then((res) => setComments([res.data, ...comments]))
      .catch((err) => console.log(err));
    inp.value = "";
  };

  const handleSubscribe = () => {
    axios
      .post(
        "/api/users/" +
          (subscribed ? "unsubscribe" : "subscribe") +
          "/" +
          video?.userId
      )
      .then(() => {
        setSubscribed(!subscribed);
      })
      .catch((err) => console.log(err));
  };

  const handleWatchLater = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    axios
      .put("/api/videos/watch-later/" + id)
      .then(() => {
        (e.target as HTMLButtonElement).disabled = true;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex md:flex-row w-full flex-col p-4 scrollbar-thin overflow-scroll scrollbar-thumb-gray-300 scrollbar-thumb-rounded box-content">
      {/* LHS */}
      <div className=" flex flex-col grow md:w-2/3 gap-2">
        <video
          src={video?.videoUrl}
          controls
          autoPlay
          controlsList="nodownload"
          className="aspect-video w-full object-fill rounded-xl"
        ></video>

        <div className="text-xl">{video?.title}</div>

        <div className="flex flex-col-reverse md:flex-row gap-2 w-full md:items-center items-start justify-between">
          <div className="flex gap-3 justify-between items-center">
            <img
              src={user?.imgUrl}
              alt="_"
              width={30}
              height={30}
              className="rounded-full"
            />
            <div className="text-zinc-400">
              <div>{user?.userId}</div>
              <div className="text-xs ">
                {user?.subscribers?.toString()} subscribers
              </div>
            </div>
            <button
              className={"mx-3 py-2 px-3 rounded-full"}
              style={{
                backgroundColor: subscribed ? "gray" : "red",
              }}
              onClick={handleSubscribe}
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-2 bg-zinc-800 py-2 px-4 rounded-full">
              <button
                onClick={likehandle}
                id="like-btn"
                style={{ color: liked ? "blue" : "white" }}
              >
                <FontAwesomeIcon icon={faThumbsUp} /> {likes.toString()}
              </button>
              {" | "}
              <button
                onClick={dislikeHandle}
                id="dislike-btn"
                style={{ color: disliked ? "blue" : "white" }}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </button>
            </div>
            <div className="bg-zinc-800 py-2 px-4 rounded-full">
              <button
                className="flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => handleWatchLater(e)}
              >
                <FontAwesomeIcon icon={faClock} /> Watch Later
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-zinc-800 mt-10 rounded-lg p-3">
          <div className="flex gap-3">
            <div>{video?.views?.toString()} views</div>
            <div>{timeSince(video?.createdAt || "")} ago</div>
            <div className="text-zinc-300">
              {video?.tags.map((ele, ind) => (
                <span key={ind}>#{ele} </span>
              ))}
            </div>
          </div>
          <div className="">{video?.desc}</div>
        </div>

        <form
          className="mt-10 items-center hidden md:flex"
          onSubmit={(e) => handleComment(e)}
        >
          <img
            src={currentUser?.imgUrl}
            alt=""
            width={30}
            className="rounded-full h-auto object-cover aspect-square"
          />
          <input
            id="comment-box"
            name="query"
            type="text"
            placeholder="Add a comment"
            className="w-full bg-inherit border-b-zinc-400 border-b border-0 outline-none focus:border-b-2 focus:border-b-white mx-4"
          />
          <input
            className="cursor-pointer p-1 bg-blue-800 py-2 px-4 rounded-full"
            type="submit"
            name="submit"
            value="Comment"
          />
        </form>

        <div className="mt-10 hidden md:block">
          {comments?.map((ele, ind) => (
            <Comment key={ind} comment={ele} />
          ))}
        </div>
      </div>

      {/* RHS */}
      <div className="grow md:w-1/3">
        <div className="w-full flex flex-col gap-2 md:px-4 mt-2 md:mt-0">
          {videos?.map((ele, i) => {
            return <ThinCard key={i} index={i} video={ele} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
