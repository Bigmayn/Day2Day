import { format, parse, isWithinInterval, addMinutes } from 'date-fns';

interface Settings {
  days: string[];
  startTime: string;
  endTime: string;
  interval: number;
}

export const scheduleNotifications = (settings: Settings) => {
  const now = new Date();
  const currentDay = format(now, 'EEEE');

  if (!settings.days.includes(currentDay)) {
    return null;
  }

  const startTime = parse(settings.startTime, 'HH:mm', now);
  const endTime = parse(settings.endTime, 'HH:mm', now);

  if (!isWithinInterval(now, { start: startTime, end: endTime })) {
    return null;
  }

  const nextNotificationTime = addMinutes(now, settings.interval);

  if (nextNotificationTime > endTime) {
    return null;
  }

  return nextNotificationTime;
};

export const showNotification = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Time to Log Activity', {
        body: 'It\'s time to log your current activity!',
        icon: '/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      });
    });
  } else if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Time to Log Activity', {
          body: 'It\'s time to log your current activity!',
          icon: '/icon-192x192.png'
        });
      }
    });
  }
};