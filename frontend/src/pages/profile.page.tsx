import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import styled from 'styled-components';
import axios from 'axios';
import useStore from '../store';
import { IChannel } from '../utils/types';

// const Button = styled.button`
//   border-radius: 3px;
//   border: 1px;
//   padding: 10px 20px;
//   font-weight: 500;
//   cursor: pointer;
//   background-color: #cc1a00;
//   color: white;
// `;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

function ProfilePage() {
  const navigate = useNavigate();
  const store = useStore();

  const fetchUser = async () => {
    try {
      store.setRequestLoading(true);
      await axios
        .get(`${SERVER_ENDPOINT}/users/me`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((data) => {
          if (data.status !== 200) {
            throw new Error(data.statusText);
          }
          const { user } = data.data.data as any;
          store.setAuthUser(user);
          store.setCurrentChannel(user.channels[0] as unknown as IChannel);
          return user;
        });
      store.setRequestLoading(false);
      return;
    } catch (error: any) {
      store.setRequestLoading(false);
      if (error.error) {
        error.error.forEach((err: any) => {
          toast.error(err.message, {
            position: 'top-right',
          });
        });
        return;
      }
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      if (error?.message === 'You are not logged in') {
        navigate('/login');
      }

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  // const createChannel = async (data: any) => {
  //   try {
  //     store.setRequestLoading(true);
  //     const response = await axios.post(
  //       `${SERVER_ENDPOINT}/channels`,
  //       JSON.stringify(data),
  //       {
  //         withCredentials: true,
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     if (response.status !== 200) {
  //       throw response.statusText;
  //     }

  //     toast.success('Channel created successfully', {
  //       position: 'top-right',
  //     });
  //     store.setRequestLoading(false);
  //     navigate('/profile');
  //   } catch (error: any) {
  //     store.setRequestLoading(false);
  //     if (error.error) {
  //       error.error.forEach((err: any) => {
  //         toast.error(err.message, {
  //           position: 'top-right',
  //         });
  //       });
  //       return;
  //     }
  //     const resMessage = (error.response
  //         && error.response.data
  //         && error.response.data.message)
  //       || error.message
  //       || error.toString();

  //     toast.error(resMessage, {
  //       position: 'top-right',
  //     });
  //   }
  // };

  useEffect(() => {
    fetchUser();
  }, []);

  const user = useStore((state) => state.authUser);

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
                  src={String(user.avatar)}
                  className="max-h-36"
                  alt={`profile of ${user.username}`}
                />
              </div>
              <div className="mt-8">
                <p className="mb-3">
                  ID:
                  {user._id}
                </p>
                <p className="mb-3">
                  Username:
                  {user.username}
                </p>
                <p className="mb-3">
                  Email:
                  {user.email}
                </p>
                <p className="mb-3">
                  Subscriptions:
                  {' '}
                  {user?.subscriptions?.length}
                </p>
                <p className="mb-3">
                  Channels:
                  {user.channels?.length}
                </p>
                <p className="mb-3">
                  Default Channel:
                  {' '}
                  {user.channels?.length > 0
                    ? (user.channels[0] as unknown as IChannel)._id
                    : ''}
                </p>
                <p className="mb-3">
                  Provider:
                  {' '}
                  {user.fromGoogle ? 'Google' : 'Default'}
                </p>
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
}

export default ProfilePage;
