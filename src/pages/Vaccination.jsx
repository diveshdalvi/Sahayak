import React from 'react';
import { Syringe } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Enhanced vaccination dates with reminder details
const vaccinationReminders = [
  {
    date: new Date(2025, 1, 15),
    vaccine: "COVID-19",
    type: "Booster Shot",
    location: "City Hospital",
    time: "10:00 AM",
    notes: "Bring vaccination card"
  },
  {
    date: new Date(2025, 1, 28),
    vaccine: "MMR",
    type: "First Dose",
    location: "Family Clinic",
    time: "9:30 AM",
    notes: "Pediatric vaccination"
  },
  {
    date: new Date(2025, 2, 10),
    vaccine: "Flu Shot",
    type: "Annual Vaccination",
    location: "Community Clinic",
    time: "2:30 PM",
    notes: "No appointment needed"
  },
  {
    date: new Date(2025, 2, 22),
    vaccine: "Tdap",
    type: "Booster",
    location: "Health Center",
    time: "3:45 PM",
    notes: "Every 10 years"
  },
  {
    date: new Date(2025, 3, 5),
    vaccine: "Hepatitis B",
    type: "Second Dose",
    location: "Medical Center",
    time: "11:15 AM",
    notes: "Fasting required"
  },
  {
    date: new Date(2024, 3, 18),
    vaccine: "HPV",
    type: "Third Dose",
    location: "Women's Clinic",
    time: "1:00 PM",
    notes: "Final dose of series"
  },
  {
    date: new Date(2025, 4, 7),
    vaccine: "Pneumonia",
    type: "Single Dose",
    location: "Senior Care Center",
    time: "10:45 AM",
    notes: "Recommended for 65+"
  },
  {
    date: new Date(2025, 4, 25),
    vaccine: "Shingles",
    type: "First Dose",
    location: "Wellness Center",
    time: "4:00 PM",
    notes: "For adults 50+"
  }
];

const defaultVaccinationStatus = {
  covid19: "Fully Vaccinated",
  fluShot: "Partially Vaccinated",
  hepatitisB: "Not Vaccinated",
  tdap: "Fully Vaccinated",
  mmr: "Fully Vaccinated"
};

const Vaccination = ({ vaccinationStatus = defaultVaccinationStatus }) => {
  const [date, setDate] = React.useState(new Date());

  // Function to check if a date has a vaccination scheduled
  const isVaccinationDay = (day) => {
    return vaccinationReminders.some(reminder => 
      reminder.date.getDate() === day.getDate() &&
      reminder.date.getMonth() === day.getMonth() &&
      reminder.date.getFullYear() === day.getFullYear()
    );
  };

  const getReminder = (date) => {
    return vaccinationReminders.find(reminder =>
      reminder.date.getDate() === date.getDate() &&
      reminder.date.getMonth() === date.getMonth() &&
      reminder.date.getFullYear() === date.getFullYear()
    );
  };

  
  const tileContent = ({ date }) => {
    const reminder = vaccinationReminders.find(reminder =>
      reminder.date.getDate() === date.getDate() &&
      reminder.date.getMonth() === date.getMonth() &&
      reminder.date.getFullYear() === date.getFullYear()
    );

    if (reminder) {
      return (
        <div className="relative h-full">
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-1 mb-1 text-xs bg-blue-500 text-white rounded px-1 py-0.5 truncate">
              {reminder.vaccine}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const reminder = vaccinationReminders.find(reminder =>
      reminder.date.getDate() === date.getDate() &&
      reminder.date.getMonth() === date.getMonth() &&
      reminder.date.getFullYear() === date.getFullYear()
    );
    return reminder ? 'has-event' : null;
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Syringe className="w-5 h-5 text-gray-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Vaccination Status</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {Object.entries(vaccinationStatus).map(([vaccine, status]) => (
            <div key={vaccine} className="flex justify-between items-center">
              <span className="text-gray-600 capitalize">{vaccine.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                status === 'Fully Vaccinated' ? 'bg-green-100 text-green-800' :
                status === 'Partially Vaccinated' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Syringe className="w-6 h-6 text-gray-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Upcoming Vaccinations</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6">
          <style>
            {`
              .react-calendar { 
                border: none;
                font-family: Arial, sans-serif;
                width: 100% !important;
                max-width: 100%;
                background: white;
                line-height: 1.125em;
              }
              .react-calendar__tile {
                height: 80px;
                position: relative;
                padding-bottom: 20px !important;
              }
              @media (max-width: 640px) {
                .react-calendar__tile {
                  height: 60px;
                  padding-bottom: 15px !important;
                  font-size: 0.875rem;
                }
                .react-calendar__month-view__days__day {
                  font-size: 12px;
                }
                .react-calendar__navigation button {
                  padding: 4px;
                  font-size: 14px;
                }
                .react-calendar__navigation {
                  margin-bottom: 0.5em;
                }
                .mx-1 {
                  margin-left: 0.1rem;
                  margin-right: 0.1rem;
                }
                .mb-1 {
                  margin-bottom: 0.1rem;
                }
                .text-xs {
                  font-size: 0.65rem;
                }
                .px-1 {
                  padding-left: 0.1rem;
                  padding-right: 0.1rem;
                }
              }
              .react-calendar__month-view__days__day {
                font-size: 14px;
              }
              .react-calendar__tile:enabled:hover,
              .react-calendar__tile:enabled:focus {
                background-color: #f0f0f0;
              }
              .react-calendar__tile--active {
                background: #e6f3ff !important;
                color: black !important;
              }
              .has-event {
                font-weight: bold;
                color: #1a73e8;
              }
              .react-calendar__month-view__weekdays {
                text-transform: uppercase;
                font-weight: bold;
                font-size: 0.75rem;
                padding: 4px 0;
              }
              @media (max-width: 640px) {
                .react-calendar__month-view__weekdays {
                  font-size: 0.7rem;
                }
              }
            `}
          </style>
          <Calendar
            value={date}
            onChange={setDate}
            className="mx-auto"
            tileContent={tileContent}
            tileClassName={tileClassName}
            minDetail="month"
            formatShortWeekday={(locale, date) => 
              date.toLocaleDateString('en-US', {weekday: 'short'})
            }
          />
          {isVaccinationDay(date) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              {(() => {
                const reminder = getReminder(date);
                return (
                  <div className="space-y-2">
                    <p className="text-green-800 font-medium text-lg">
                      🗓️ Vaccination Reminder
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Vaccine:</strong> {reminder.vaccine}</p>
                      <p><strong>Type:</strong> {reminder.type}</p>
                      <p><strong>Time:</strong> {reminder.time}</p>
                      <p><strong>Location:</strong> {reminder.location}</p>
                      <p className="col-span-2"><strong>Notes:</strong> {reminder.notes}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vaccination;
