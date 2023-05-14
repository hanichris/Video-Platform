import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import getGoogleUrl from '../utils/getGoogleUrl';
import GoogleLogo from '../assets/google.svg';
import useStore from '../store';

const registerUserModel = object({
  username: string().min(1, 'Full name is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

export type RegisterInput = TypeOf<typeof registerUserModel>;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const from = ((location.state as any)?.from?.pathname as string) || '/profile';

  const registerUser = async (data: RegisterInput) => {
    try {
      store.setRequestLoading(true);
      const response = await axios.post(
        `${SERVER_ENDPOINT}/auth/register`,
        JSON.stringify(data),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.status);
      if (response.status !== 201) {
        throw new Error(response.statusText);
      }

      toast.success('Account created successfully', {
        position: 'top-right',
      });
      store.setRequestLoading(false);
      navigate('/profile');
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

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerUserModel),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    registerUser(values);
  };

  return (
    <section className="bg-ct-blue-600 min-h-screen pt-20">
      <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
        <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="mb-6">
              <input
                type="text"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.username?.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <input
                type="email"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Confirm Password"
                {...register('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.passwordConfirm?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign up
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <a
              className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
              style={{ backgroundColor: '#3b5998' }}
              href={getGoogleUrl(from)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <img
                className="pr-2"
                src={GoogleLogo}
                alt=""
                style={{ height: '2rem' }}
              />
              Register with Google
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
