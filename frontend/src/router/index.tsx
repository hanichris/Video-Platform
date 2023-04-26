import type { RouteObject } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";
import HomeLayout from "../components/HomeLayout";
import HomePage from "../pages/home.page";
import LoginPage from "../pages/login.page";
import ProfilePage from "../pages/profile.page";
import RegisterPage from "../pages/register.page";
import ResetPasswordPage from "../pages/resetPassword.page";
import SearchPage from "../pages/search.page";
import VideoPage from "../pages/video.page";
import UploadPage from "../pages/upload.page";

const normalRoutes: RouteObject = {
  // path: "*",
  element: <HomeLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
	  {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "videos/:id",
      element: <VideoPage />,
    },
    {
      path: "videos/search",
      element: <SearchPage type={""}/>,
    },
    {
      path: "upload",
      element: <UploadPage />,
    },
    // {
    //   path: "videos/:id/download",
    //   element: <DownloadPage />,
    // },
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
