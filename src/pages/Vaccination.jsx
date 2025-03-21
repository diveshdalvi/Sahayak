import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Syringe,
  ArrowRight,
} from "lucide-react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/common/Navbar";
import vaccinesData from "../Data/vaccines.json";

const VaccineCalendar = () => {
  // State to store vaccination events fetched from Firestore
  const [vaccinationEvents, setVaccinationEvents] = useState([]); // upcoming events (incomplete)
  const [fullVaccinationEvents, setFullVaccinationEvents] = useState([]); // complete list for roadmap
  // Roadmap selection state (vaccine names come from JSON)
  const [selectedVaccine, setSelectedVaccine] = useState("");
  // Calendar navigation and selection states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserVaccinationStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch the user document and, if the user is a child, retrieve his vaccinationStatus array.
  const fetchUserVaccinationStatus = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.userType === "children" && userData.vaccinationStatus) {
          // Save full vaccinationStatus (for roadmap) and upcoming events (for calendar)
          setFullVaccinationEvents(userData.vaccinationStatus);
          const upcomingEvents = userData.vaccinationStatus.filter(
            (event) => !event.completed
          );
          setVaccinationEvents(upcomingEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Function to mark a vaccine event as completed.
  const handleMarkCompleted = async (eventToMark) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      // Update the full vaccinationStatus array by setting the matching event's completed flag to true.
      const updatedFullEvents = fullVaccinationEvents.map((event) => {
        if (
          event.dueDate === eventToMark.dueDate &&
          event.vaccine === eventToMark.vaccine &&
          event.doseNumber === eventToMark.doseNumber
        ) {
          return { ...event, completed: true };
        }
        return event;
      });
      await updateDoc(userDocRef, { vaccinationStatus: updatedFullEvents });
      setFullVaccinationEvents(updatedFullEvents);
      setVaccinationEvents(updatedFullEvents.filter((e) => !e.completed));
    } catch (error) {
      console.error("Error updating vaccine status:", error);
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
    return vaccinationEvents.filter((event) => {
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-100"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const events = getEventsForDate(date);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      // Show maximum 2 events per cell
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
              {event.vaccine} (Dose {event.doseNumber})
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

  // Get selected date events for calendar details
  const selectedEvents = getEventsForDate(selectedDate);

  // Upcoming events in the next 6 months (for calendar section)
  const upcomingSixMonthsEvents = vaccinationEvents.filter((event) => {
    const eventDate = new Date(event.dueDate);
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    return eventDate >= new Date() && eventDate <= sixMonthsLater;
  });

  // Compute unique vaccine names from the JSON file (for dropdown)
  const jsonVaccines = useMemo(() => {
    const vaccines = [];
    vaccinesData.vaccinationSchedule.forEach((schedule) => {
      Object.keys(schedule.vaccines).forEach((vaccine) => {
        if (!vaccines.includes(vaccine)) {
          vaccines.push(vaccine);
        }
      });
    });
    return vaccines;
  }, []);

  // Compute roadmap data for selected vaccine (sorted by scheduleAge) from Firebase data
  const roadmapData = useMemo(() => {
    if (!selectedVaccine) return [];
    const events = fullVaccinationEvents
      .filter((event) => event.vaccine === selectedVaccine)
      .sort((a, b) => a.scheduleAge - b.scheduleAge);
    // If the first dose is not present (i.e. first upcoming dose is not dose 1),
    // prepend a dummy event for dose 1 indicating it's complete (with no dueDate).
    if (events.length === 0 || events[0].doseNumber !== 1) {
      const dummy = {
        doseNumber: 1,
        completed: true,
        vaccine: selectedVaccine,
        dueDate: null,
        scheduleAge: 0,
      };
      return [dummy, ...events];
    }
    return events;
  }, [selectedVaccine, fullVaccinationEvents]);

  return (
    <>
      <Navbar />
      {/* Extra top padding so content is not hidden behind fixed Navbar */}
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Roadmap Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Vaccine Roadmap</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vaccine
              </label>
              <select
                value={selectedVaccine}
                onChange={(e) => setSelectedVaccine(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Vaccine --</option>
                {jsonVaccines.map((vaccine, index) => (
                  <option key={index} value={vaccine}>
                    {vaccine}
                  </option>
                ))}
              </select>
            </div>
            {selectedVaccine && roadmapData.length > 0 ? (
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
                          event.doseNumber
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
            ) : selectedVaccine ? (
              <p className="text-gray-500">No roadmap data available.</p>
            ) : (
              <p className="text-gray-500">
                Please select a vaccine to view its roadmap.
              </p>
            )}
          </div>

          {/* Upcoming Vaccines Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Vaccines (Next 6 Months)
            </h2>
            {upcomingSixMonthsEvents.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {upcomingSixMonthsEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-semibold">
                      {event.vaccine} (Dose {event.doseNumber})
                    </div>
                    <div className="text-xs">
                      Due: {new Date(event.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No upcoming vaccines in the next 6 months.
              </p>
            )}
          </div>

          {/* Calendar Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
                <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
                Vaccine Schedule
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
                          <Syringe className="w-5 h-5 text-blue-500 mr-2" />
                          <h4 className="font-semibold text-gray-800">
                            {event.vaccine} (Dose {event.doseNumber})
                          </h4>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Schedule Age: {event.scheduleAge} months
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
                No vaccine events for {formatDate(selectedDate)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VaccineCalendar;
