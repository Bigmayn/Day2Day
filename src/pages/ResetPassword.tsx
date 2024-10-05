import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setMessage('Invalid reset token. Please try the password reset process again.');
      return;
    }

    try {
      await axios.post('/api/reset-password', { ...data, token });
      setMessage('Your password has been reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                {...register('password', { required: true, minLength: 8 })}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                {...register('confirmPassword', {
                  required: true,
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
              />
            </div>
          </div>

          {errors.password && <span className="text-red-500 text-sm">Password must be at least 8 characters long</span>}
          {errors.confirmPassword && <span className="text-red-500 text-sm">Passwords must match</span>}

          {message && <div className="text-sm text-center text-green-600">{message}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;