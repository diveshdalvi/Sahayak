import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./components/Auth/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/Events/Events";
import EmergencyContacts from "./pages/EmergencyContacts";
import Profile from "./pages/Profile";
import Authentication from "./pages/Authentication"; // Ensure this import is correct
import Signup from "./components/Auth/Signup";
import Vaccination from "./pages/Vaccination";
import PregnancyCalendar from "./pages/PregagnancyCalender";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/events" element={<Events />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/about" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vaccination" element={<Vaccination />} />
          <Route path="/pregnancy-calendar" element={<PregnancyCalendar />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
