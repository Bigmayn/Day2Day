import React from 'react';
import { useForm } from 'react-hook-form';

interface ActivityFormProps {
  onSubmit: (data: ActivityFormData) => void;
  date?: Date | null;
}

interface ActivityFormData {
  name: string;
  duration: number;
  description: string;
  date: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, date }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>({
    defaultValues: {
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
  });

  const submitActivity = (data: ActivityFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitActivity)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Activity Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Activity name is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          {...register('duration', { required: 'Duration is required', min: 1 })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        ></textarea>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register('date', { required: 'Date is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Log Activity
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;