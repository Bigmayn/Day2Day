import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface SetupForm {
  days: string[];
  startTime: string;
  endTime: string;
  interval: number;
}

const Setup: React.FC = () => {
  const { control, handleSubmit } = useForm<SetupForm>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SetupForm) => {
    try {
      await axios.post('/api/settings', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Setup failed', error);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set Up Your Time Tracker
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Days
              </label>
              <div className="mt-2 space-y-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center">
                    <Controller
                      name="days"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id={day}
                          value={day}
                          onChange={(e) => {
                            const updatedDays = e.target.checked
                              ? [...field.value, e.target.value]
                              : field.value.filter((d: string) => d !== e.target.value);
                            field.onChange(updatedDays);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <label htmlFor={day} className="ml-2 block text-sm text-gray-900">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <div className="mt-1">
                <Controller
                  name="startTime"
                  control={control}
                  defaultValue="09:00"
                  render={({ field }) => (
                    <input
                      type="time"
                      id="startTime"
                      {...field}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <div className="mt-1">
                <Controller
                  name="endTime"
                  control={control}
                  defaultValue="17:00"
                  render={({ field }) => (
                    <input
                      type="time"
                      id="endTime"
                      {...field}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                Interval (minutes)
              </label>
              <div className="mt-1">
                <Controller
                  name="interval"
                  control={control}
                  defaultValue={60}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="interval"
                      {...field}
                      min="15"
                      max="240"
                      step="15"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;