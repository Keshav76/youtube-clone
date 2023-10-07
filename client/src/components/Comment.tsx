import React, { useEffect, useState } from "react";

import timeSince from "../timeSince";
import User from "../models/user";
import axios from "../my-axios";

import CommentType from "../models/comments";
import { toast } from "react-toastify";

type Props = {
  comment: CommentType;
};

const Comment = (props: Props) => {
  const { comment } = props;
  const [user, setUser] = useState<User>();
  useEffect(() => {
    axios
      .get("/api/users/find/" + comment.userId)
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (!err.response || !err.response.data || !err.response.data.message) {
          toast.error("Server error");
          return;
        }
        toast.error(err.response.data.message);
      });
  }, [comment]);
  return (
    <div className="flex items-start mb-5 gap-3">
      <img
        src={user?.imgUrl}
        alt="pp"
        height={30}
        width={30}
        className="rounded-full h-auto object-cover aspect-square"
      />
      <div>
        <div className="flex gap-2">
          <div>{user?.userId}</div>
          <div className="text-zinc-400">
            {timeSince(comment?.createdAt)} ago.
          </div>
        </div>
        <div>{comment.desc}</div>
      </div>
    </div>
  );
};

export default Comment;
