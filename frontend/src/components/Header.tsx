/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store';
import Spinner from './Spinner';

function Header() {
  const store = useStore();
  const location = useLocation();
  const user = store.authUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      store.setRequestLoading(true);
      const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
      const response = await fetch(`${SERVER_ENDPOINT}/api/auth/logout`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw await response.json();
      }

      store.setRequestLoading(false);
      store.setAuthUser(null);
      navigate('/login');
    } catch (error: any) {
      store.setRequestLoading(false);
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

  return (
    <>
      <header className="bg-white h-20">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link to="/" className="text-ct-dark-600 text-2xl font-semibold">
              VideoTube
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <Link to="/" className="text-ct-dark-600">
                Home
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    state={{
                      from: {
                        pathname: location.pathname,
                        search: location.search,
                      },
                    }}
                    className="text-ct-dark-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    state={{
                      from: {
                        pathname: location.pathname,
                        search: location.search,
                      },
                    }}
                    className="text-ct-dark-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link to="/profile" className="text-ct-dark-600">
                    Profile
                  </Link>
                </li>
                <li className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <div className="pt-4 pl-2 bg-ct-blue-600 fixed">
        {store.requestLoading && <Spinner color="text-ct-yellow-600" />}
      </div>
    </>
  );
}

export default Header;
