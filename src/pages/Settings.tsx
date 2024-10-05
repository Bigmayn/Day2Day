import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface SettingsForm {
  days: string[];
  startTime: string;
  endTime: string;
  interval: number;
}

const Settings: React.FC = () => {
  const { control, handleSubmit, setValue } = useForm<SettingsForm>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setValue('days', parsedSettings.days);
      setValue('startTime', parsedSettings.startTime);
      setValue('endTime', parsedSettings.endTime);
      setValue('interval', parsedSettings.interval);
    }
  }, [setValue]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      // Save settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(data));
      localStorage.setItem('settingsSaved', 'true');
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Settings update failed', error);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Days</label>
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
                            checked={field.value.includes(day)}
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
                <Controller
                  name="startTime"
                  control={control}
                  defaultValue="09:00"
                  render={({ field }) => (
                    <input
                      type="time"
                      id="startTime"
                      {...field}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                  )}
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <Controller
                  name="endTime"
                  control={control}
                  defaultValue="17:00"
                  render={({ field }) => (
                    <input
                      type="time"
                      id="endTime"
                      {...field}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                  )}
                />
              </div>

              <div>
                <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                  Interval (minutes)
                </label>
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                  )}
                />
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
      </main>
    </div>
  );
};

export default Settings;