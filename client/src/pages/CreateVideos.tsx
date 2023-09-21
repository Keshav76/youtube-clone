import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { State } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = {};

const CreateVideo = (props: Props) => {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: State) => state.user);
  const [data, setData] = useState({
    title: "",
    desc: "",
    tags: "",
    videoUrl: "",
    imgUrl: "",
  });
  const [video, setVideo] = useState<File>();
  const [img, setImg] = useState<File>();
  const [imgPercent, setImgPercent] = useState(0);
  const [videoPercent, setVideoPercent] = useState(0);

  const fileUpload = async (file: File, name: string) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (name === "imgUrl") setImgPercent(progress);
        else setVideoPercent(progress);
        console.log("Upload is " + progress + "% done for " + name);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newData = { ...data, [name]: downloadURL };
          setData(newData);
          console.log("File available at", downloadURL, "for" + name);
          console.log(data);
        });
      }
    );
  };

  useEffect(() => {
    if (img) fileUpload(img, "imgUrl");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);
  useEffect(() => {
    if (video) fileUpload(video, "videoUrl");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/api/videos/create", data)
      .then((res) => {
        navigate("/video/" + res.data._id);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {!currentUser && "Login First to create videos"}
      {currentUser && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col justify-around h-full grow w-full md:w-1/3 lg:w-1/4 bg-zinc-800 md:rounded-lg md:my-4">
            <div className="p-5 text-xl">Upload Video</div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-4/5 gap-2 p-5 justify-around"
            >
              <div className="flex flex-col">
                <label htmlFor="title">Title:</label>
                <input
                  className="bg-transparent border-0 border-b-2 border-b-white outline-none"
                  onChange={handleChange}
                  type="text"
                  placeholder="Video Title"
                  name="title"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="desc">Description:</label>
                <textarea
                  placeholder="Video Description"
                  onChange={handleChange}
                  className="bg-transparent border-0 border-b-2 border-b-white outline-none resize-none"
                  name="desc"
                  rows={3}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="tags">Tags:</label>
                <input
                  onChange={handleChange}
                  placeholder="Video Tags (seperated by commas)"
                  className="bg-transparent border-0 border-b-2 border-b-white outline-none"
                  type="text"
                  name="tags"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="thumbnail">Thumbnail:</label>
                {img && `Uploaded ${imgPercent}%`}
                {!img && (
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={(e) => setImg(e.target.files![0])}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="video">Video:</label>
                {video && `Uploaded ${videoPercent}%`}
                {!video && (
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files![0])}
                  />
                )}
              </div>
              <button
                type="submit"
                className="bg-zinc-600 rounded-full py-2 px-6 mx-auto"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateVideo;
