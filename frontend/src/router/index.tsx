import type { RouteObject } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";
import HomePage from "../pages/home.page";
import LoginPage from "../pages/login.page";
import ProfilePage from "../pages/profile.page";
import RegisterPage from "../pages/register.page";
import ForgotPasswordPage from "../pages/forgotPassword.page";
import ResetPasswordPage from "../pages/resetPassword.page";

const normalRoutes: RouteObject = {
  path: "*",
  element: <DefaultLayout />,
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
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },
	{
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
