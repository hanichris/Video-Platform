import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../store";
import { IUser, IChannel } from "../utils/types";
import styled from 'styled-components';

const Button = styled.button`
  border-radius: 3px;
  border: 1px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #cc1a00;
  color: white;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const ProfilePage = () => {
  const navigate = useNavigate();
  const store = useStore();

  const fetchUser = async () => {
    try {
      store.setRequestLoading(true);
      const response = await fetch(`${SERVER_ENDPOINT}/users/me`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      const user = data.data.user as IUser;
      // console.log(user);
      store.setRequestLoading(false);

      store.setAuthUser(user);
      store.setCurrentChannel(user.channels[0] as unknown as IChannel);
    } catch (error: any) {
      store.setRequestLoading(false);
      if (error.error) {
        error.error.forEach((err: any) => {
          toast.error(err.message, {
            position: "top-right",
          });
        });
        return;
      }
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.message === "You are not logged in") {
        navigate("/login");
      }

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const createChannel = async (data: any) => {
    try {
      store.setRequestLoading(true);
      const response = await fetch(
        `${SERVER_ENDPOINT}/channels`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw await response.json();
      }

      toast.success("Channel created successfully", {
        position: "top-right",
      });
      store.setRequestLoading(false);
      navigate("/profile");
    } catch (error: any) {
      store.setRequestLoading(false);
      if (error.error) {
        error.error.forEach((err: any) => {
          toast.error(err.message, {
            position: "top-right",
          });
        });
        return;
      }
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const user = store.authUser;

  return (
    <section className="bg-ct-blue-600  min-h-screen pt-20">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <div>
          <p className="text-5xl text-center font-semibold">Profile Page</p>
          {!user ? (
            <p>Loading...</p>
          ) : (
            <div className="flex items-center gap-8">
              <div>
                <img
                  src={
                    String(user.avatar)
                  }
                  className="max-h-36"
                  alt={`profile photo of ${user.username}`}
                />
              </div>
              <div className="mt-8">
                <p className="mb-3">ID: {user._id}</p>
                <p className="mb-3">Username: {user.username}</p>
                <p className="mb-3">Email: {user.email}</p>
                <p className="mb-3">Subscriptions: {user.subscriptions.length}</p>
                <p className="mb-3">Channels: {user.channels.length}</p>
                <p className="mb-3">Default Channel: {user.channels.length > 0 ? (user.channels[0] as unknown as IUser)._id : ""}</p>
                <p className="mb-3">Provider: {user.fromGoogle ? "Google" : "Default"}</p>
              </div>
              <div>
                {/* <Button onClick={createChannel}>
                  Create channel
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
