import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { scheduleNotifications, showNotification } from '../utils/notificationScheduler';
import ActivityForm from '../components/ActivityForm';
import InstallPrompt from '../components/InstallPrompt';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
    const settingsSaved = localStorage.getItem('settingsSaved');
    if (settingsSaved === 'true') {
      setShowSettingsSaved(true);
      localStorage.removeItem('settingsSaved');
      setTimeout(() => setShowSettingsSaved(false), 3000);
    }

    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (settings.interval) {
      const checkNotification = () => {
        const nextNotification = scheduleNotifications(settings);
        if (nextNotification) {
          const timeUntilNotification = nextNotification.getTime() - new Date().getTime();
          setTimeout(() => {
            showNotification();
            setShowActivityForm(true);
          }, timeUntilNotification);
        }
      };

      checkNotification();
      const intervalId = setInterval(checkNotification, 60000); // Check every minute

      return () => clearInterval(intervalId);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const fetchActivities = () => {
    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  };

  const handleActivitySubmit = (newActivity: any) => {
    const updatedActivities = [...activities, { ...newActivity, id: Date.now() }];
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    setShowActivityForm(false);
  };

  const handleAddActivity = (date: Date) => {
    setSelectedDate(date);
    setShowActivityForm(true);
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Day2Day Time Tracker</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/settings')}
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Overview</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <WeeklyCalendar activities={activities} onAddActivity={handleAddActivity} />
          </div>
        </div>
      </main>

      {showSettingsSaved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          Settings saved successfully!
        </div>
      )}

      {showActivityForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Log Your Activity</h3>
            <ActivityForm onSubmit={handleActivitySubmit} date={selectedDate} />
            <button 
              onClick={() => setShowActivityForm(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4">
        <button
          onClick={handleInstall}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
        >
          Download Here
        </button>
      </div>

      <InstallPrompt />
    </div>
  );
};

export default Dashboard;