import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

interface Activity {
  id: number;
  name: string;
  duration: number;
  date: string;
}

interface WeeklyCalendarProps {
  activities: Activity[];
  onAddActivity: (date: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ activities, onAddActivity }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Previous Week
        </button>
        <h3 className="text-lg font-semibold text-black">
          Week of {format(currentWeekStart, 'MMM d, yyyy')}
        </h3>
        <button onClick={goToNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="border p-2">
            <h4 className="font-semibold text-black">{format(day, 'EEE')}</h4>
            <p className="text-sm text-gray-500">{format(day, 'MMM d')}</p>
            <ul className="mt-2 space-y-1">
              {activities
                .filter((activity) => isSameDay(parseISO(activity.date), day))
                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                .map((activity) => (
                  <li key={activity.id} className="text-sm bg-gray-100 p-1 rounded">
                    <span className="font-medium text-black">{activity.name}</span>
                    <br />
                    <span className="text-xs text-gray-600">{activity.duration} min</span>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => onAddActivity(day)}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;