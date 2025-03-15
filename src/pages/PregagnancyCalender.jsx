import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  ArrowRight,
  Stethoscope,
} from "lucide-react"; // You can use any icon you prefer (e.g. Stethoscope)
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/common/Navbar";
import pregnancySchedule from "../Data/pregnancySchedule.json";

const PregnancyCalendar = () => {
  // State to store checkup events from Firestore (for upcoming events)
  const [checkupEvents, setCheckupEvents] = useState([]);
  // State to store the full list (for roadmap)
  const [fullCheckupEvents, setFullCheckupEvents] = useState([]);
  // Roadmap selection state (dropdown for checkup names)
  const [selectedCheckup, setSelectedCheckup] = useState("");
  // Calendar navigation/selection states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pregnancyDate, setPregnancyDate] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserPregnancyData();
    }
  }, [user]);

  // Fetch user data and compute checkup events based on pregnancyDate
  const fetchUserPregnancyData = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Ensure the user is female, pregnant, and has a pregnancyDate
        if (
          data.gender === "Female" &&
          data.pregnancyStatus === "Pregnant" &&
          data.pregnancyDate
        ) {
          const pDate = new Date(data.pregnancyDate);
          setPregnancyDate(pDate);
          const fullEvents = [];
          const upcomingEvents = [];
          const currentDate = new Date();
          // Loop over pregnancyCheckupSchedule JSON
          pregnancySchedule.pregnancyCheckupSchedule.forEach((item) => {
            const gestationalAge = item.gestationalAge; // in weeks
            Object.entries(item.checkups).forEach(
              ([checkupName, checkupData]) => {
                const dueDate = new Date(pDate);
                dueDate.setDate(dueDate.getDate() + checkupData.dueAt * 7); // dueAt is in weeks
                const event = {
                  checkup: checkupName,
                  dueDate: dueDate.toISOString(),
                  details: checkupData.details,
                  completed: false,
                  gestationalAge, // for sorting/roadmap
                };
                fullEvents.push(event);
                if (dueDate > currentDate) {
                  upcomingEvents.push(event);
                }
              }
            );
          });
          // Sort events by gestationalAge (ascending)
          fullEvents.sort((a, b) => a.gestationalAge - b.gestationalAge);
          upcomingEvents.sort((a, b) => a.gestationalAge - b.gestationalAge);
          setFullCheckupEvents(fullEvents);
          setCheckupEvents(upcomingEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching pregnancy data:", error);
    }
  };

  // Function to mark a checkup event as completed.
  const handleMarkCompleted = async (eventToMark) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const updatedFullEvents = fullCheckupEvents.map((event) => {
        if (
          event.dueDate === eventToMark.dueDate &&
          event.checkup === eventToMark.checkup
        ) {
          return { ...event, completed: true };
        }
        return event;
      });
      // Update Firestore (you can store these in a field, e.g., "pregnancyCheckupStatus")
      await updateDoc(userDocRef, {
        pregnancyCheckupStatus: updatedFullEvents,
      });
      setFullCheckupEvents(updatedFullEvents);
      setCheckupEvents(updatedFullEvents.filter((e) => !e.completed));
    } catch (error) {
      console.error("Error updating checkup status:", error);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getEventsForDate = (date) => {
    return checkupEvents.filter((event) => {
      const eventDate = new Date(event.dueDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Month navigation functions
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );
  };

  // Render calendar cells with a maximum of 2 events per cell
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-100"></div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const events = getEventsForDate(date);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const displayedEvents = events.slice(0, 2);
      const extraCount = events.length - displayedEvents.length;
      cells.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-20 border border-gray-100 p-2 cursor-pointer transition-all ${
            isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-sm">{day}</div>
          {displayedEvents.map((event, index) => (
            <div
              key={index}
              className={`mt-1 text-xs p-1 rounded-md truncate ${
                event.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {event.checkup}
            </div>
          ))}
          {extraCount > 0 && (
            <div className="mt-1 text-xs text-gray-600">+{extraCount} more</div>
          )}
        </div>
      );
    }
    return cells;
  };

  const selectedEvents = getEventsForDate(selectedDate);

  // Upcoming checkups in the next 6 months
  const upcomingSixMonthsEvents = checkupEvents.filter((event) => {
    const eventDate = new Date(event.dueDate);
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    return eventDate >= new Date() && eventDate <= sixMonthsLater;
  });

  // Compute unique checkup names for the roadmap dropdown from fullCheckupEvents
  const uniqueCheckups = useMemo(() => {
    const checkups = [];
    fullCheckupEvents.forEach((event) => {
      if (!checkups.includes(event.checkup)) {
        checkups.push(event.checkup);
      }
    });
    return checkups;
  }, [fullCheckupEvents]);

  // Get roadmap data for selected checkup (sorted by gestationalAge)
  const roadmapData = useMemo(() => {
    if (!selectedCheckup) return [];
    const events = fullCheckupEvents
      .filter((event) => event.checkup === selectedCheckup)
      .sort((a, b) => a.gestationalAge - b.gestationalAge);
    // If the earliest checkup is missing, prepend a dummy event indicating first checkup is complete.
    if (events.length === 0 || events[0].gestationalAge !== 0) {
      const dummy = {
        doseNumber: 1, // For checkups, you might omit this
        completed: true,
        checkup: selectedCheckup,
        dueDate: null,
        gestationalAge: 0,
      };
      return [dummy, ...events];
    }
    return events;
  }, [selectedCheckup, fullCheckupEvents]);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Roadmap Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Pregnancy Checkup Roadmap
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Checkup
              </label>
              <select
                value={selectedCheckup}
                onChange={(e) => setSelectedCheckup(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Checkup --</option>
                {uniqueCheckups.map((checkup, index) => (
                  <option key={index} value={checkup}>
                    {checkup}
                  </option>
                ))}
              </select>
            </div>
            {selectedCheckup && roadmapData.length > 0 ? (
              <div className="flex items-center space-x-4 overflow-x-auto">
                {roadmapData.map((event, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          event.completed ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {event.dueDate === null ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          event.gestationalAge
                        )}
                      </div>
                      {event.dueDate !== null && (
                        <div className="mt-1 text-xs">
                          {new Date(event.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {index !== roadmapData.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : selectedCheckup ? (
              <p className="text-gray-500">No roadmap data available.</p>
            ) : (
              <p className="text-gray-500">
                Please select a checkup to view its roadmap.
              </p>
            )}
          </div>

          {/* Upcoming Checkups Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Checkups (Next 6 Months)
            </h2>
            {upcomingSixMonthsEvents.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {upcomingSixMonthsEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-semibold">{event.checkup}</div>
                    <div className="text-xs">
                      Due: {new Date(event.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No upcoming checkups in the next 6 months.
              </p>
            )}
          </div>

          {/* Calendar Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
                <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
                Pregnancy Checkup Schedule
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ←
                </button>
                <h2 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-100">
              {renderCalendar()}
            </div>
          </div>

          {/* Selected Date Events Section */}
          {selectedEvents.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Events for {formatDate(selectedDate)}
              </h3>
              <div className="space-y-4">
                {selectedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <Stethoscope className="w-5 h-5 text-blue-500 mr-2" />
                          <h4 className="font-semibold text-gray-800">
                            {event.checkup}
                          </h4>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Gestational Age: {event.gestationalAge} weeks
                          </div>
                          <div className="flex items-center mt-1">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            Due Date:{" "}
                            {new Date(event.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center ${
                          event.completed ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {event.completed ? (
                          <>
                            <Check className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">
                              Completed
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Show Mark as Completed button only if due date is today and event is not yet completed */}
                    {!event.completed &&
                      new Date(event.dueDate).toDateString() ===
                        new Date().toDateString() && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleMarkCompleted(event)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedEvents.length === 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <p className="text-gray-500">
                No checkup events for {formatDate(selectedDate)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PregnancyCalendar;
