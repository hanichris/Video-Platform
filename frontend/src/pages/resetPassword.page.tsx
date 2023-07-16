import { useNavigate } from 'react-router-dom';
import { object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import axios from 'axios';
import useStore from '../store';

const resetPasswordModel = object({
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

export type ResetPasswordInput = TypeOf<typeof resetPasswordModel>;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const store = useStore();

  const resetUserPassword = async (data: ResetPasswordInput) => {
    try {
      store.setRequestLoading(true);
      const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
      const response = await axios.post(
        `${SERVER_ENDPOINT}/auth/reset-password`,
        JSON.stringify(data),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      store.setRequestLoading(false);
      navigate('/login');
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

  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordModel),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<ResetPasswordInput> = (values) => {
    resetUserPassword(values);
  };

  return (
    <section className="bg-ct-blue-600 min-h-screen pt-20">
      <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
        <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
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
                placeholder="Create new password"
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
              Reset Password
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
              >
                Already have an account?
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
