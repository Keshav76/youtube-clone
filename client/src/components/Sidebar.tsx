import React, { useEffect, useState } from "react";

import {
  faClapperboard,
  faClock,
  faFilm,
  faFire,
  faHistory,
  faHouse,
  faMoon,
  faPlay,
  faSun,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import Element from "../components/Element";

import { useSelector } from "react-redux";
import { State } from "../store/store";
import User from "../img/user.png";
import axios from "../my-axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};
type Subs = {
  name: string;
  id: string;
};

const Sidebar = (props: Props) => {
  const { currentUser: user } = useSelector((state: State) => state.user);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [subs, setSubs] = useState<Subs[]>([]);
  const [theme, setTheme] = useState("dark");
  const handleThemeChange = () => {
    const x = theme === "dark" ? 1 : 0;
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    document.body.style.filter = `invert(${x})`;
    let img = Array.from(
      document.getElementsByTagName("img") as HTMLCollectionOf<HTMLElement>
    );
    let video = Array.from(
      document.getElementsByTagName("video") as HTMLCollectionOf<HTMLElement>
    );
    let media = img.concat(video);
    media.forEach((i) => {
      i.style.filter = `invert(${x})`;
    });
  };
  var location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      const x = theme === "dark" ? 0 : 1;
      let img = Array.from(
        document.getElementsByTagName("img") as HTMLCollectionOf<HTMLElement>
      );
      let video = Array.from(
        document.getElementsByTagName("video") as HTMLCollectionOf<HTMLElement>
      );
      let media = img.concat(video);
      media.forEach((i) => {
        i.style.filter = `invert(${x})`;
      });
    }, 1000);
  }, [location, theme]);

  useEffect(() => {
    const getData = async () => {
      axios
        .get("/api/users/playlists")
        .then((res) => setPlaylist(res.data))
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
      axios
        .get("/api/users/subscribers")
        .then((res) => setSubs(res.data))
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
    if (user) getData();
  }, []);
  return (
    <div
      id="side"
      className="hidden absolute bg-zinc-900 left-0 flex-col gap-4 p-1 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 z-10 h-full overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
    >
      <Element label="Home" icon={faHouse} link="/" />
      <Element
        label="Subscriptions"
        icon={faClapperboard}
        link="/subscriptions"
      />
      <Element label="Trending" icon={faFire} link="/trending" />
      <hr />
      <Element label="History" icon={faHistory} link="/history" />
      <Element label="Your videos" icon={faPlay} link="/your-videos" />
      <Element label="Watch Later" icon={faClock} link="/watch-later" />
      <Element label="Liked Videos" icon={faThumbsUp} link="/liked-videos" />
      {user &&
        playlist.map((ele, ind) => (
          <Element label={ele} icon={faFilm} link={`/playlist/${ele}`} />
        ))}
      <hr />
      {user && <div className="ml-4 ">Subscriptions</div>}
      {user &&
        subs.map((ele, ind) => (
          <Element
            key={ele.id}
            label={ele.name}
            icon={User}
            link={`/subscriptions/${ele.name}/${ele.id}`}
          />
        ))}
      <div className="ml-4">
        <button onClick={handleThemeChange}>
          <FontAwesomeIcon
            icon={theme === "dark" ? faSun : faMoon}
            className="mr-7"
          ></FontAwesomeIcon>
          {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
