import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import SearchResult from "./pages/SearchResult";
import History from "./pages/History";
import Subscriptions from "./pages/Subscriptions";
import WatchLater from "./pages/WatchLater";
import YourVideos from "./pages/YourVideos";
import Trending from "./pages/Trending";
import Playlist from "./pages/Playlist";
import LikedVideos from "./pages/LikedVideos";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SubUserVideos from "./pages/SubUserVideos";
import CreateVideo from "./pages/CreateVideos";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="/search/:query" element={<SearchResult />} />
      <Route path="/history" element={<History />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/watch-later" element={<WatchLater />} />
      <Route path="/your-videos" element={<YourVideos />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/playlist/:name" element={<Playlist />} />
      <Route path="/liked-videos" element={<LikedVideos />} />
      <Route path="/subscriptions/:name/:id" element={<SubUserVideos />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<div>404</div>} />
      <Route path="create-video" element={<CreateVideo />} />
    </Route>
  )
);

export default router;
