import type { RouteObject } from 'react-router-dom';
import HomeLayout from '../components/HomeLayout';
import HomePage from '../pages/home.page';
import LoginPage from '../pages/login.page';
import ProfilePage from '../pages/profile.page';
import RegisterPage from '../pages/register.page';
import ResetPasswordPage from '../pages/resetPassword.page';
import SearchPage from '../pages/search.page';
import VideoPage from '../pages/video.page';
import UploadPage from '../pages/upload.page';
import HistoryPage from '../pages/history.page';
import SubscriptionsPage from '../pages/subscriptions.page';
import SettingsPage from '../pages/settings.page';
import ReportPage from '../pages/report.page';
import HelpPage from '../pages/help.page';
import ErrorPage from '../pages/error.page';

const normalRoutes: RouteObject = {
  // path: "*",
  element: <HomeLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'profile',
      element: <ProfilePage />,
    },
    {
      path: 'subscriptions',
      element: <SubscriptionsPage />,
    },
    {
      path: 'history',
      element: <HistoryPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'reset-password',
      element: <ResetPasswordPage />,
    },
    {
      path: 'videos/:id',
      element: <VideoPage />,
    },
    {
      path: 'videos/search',
      element: <SearchPage />,
    },
    {
      path: 'upload',
      element: <UploadPage />,
    },
    {
      path: 'settings',
      element: <SettingsPage />,
    },
    {
      path: 'report',
      element: <ReportPage />,
    },
    {
      path: 'help',
      element: <HelpPage />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
