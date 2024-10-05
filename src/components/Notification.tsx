import React, { useState, useEffect } from 'react';
import ActivityForm from './ActivityForm';

interface NotificationProps {
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleSubmit = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Time to log your activity!</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              What have you been working on? Log your activity below.
            </p>
          </div>
          <ActivityForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Notification;