import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmergencyContacts from "./pages/EmergencyContacts";
import Authentication from "./pages/Authentication";
import Events from "./pages/Events/Events";
import About from "./pages/about";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Profile from "./pages/Profile";
import Vaccination from './pages/Vaccination';

const App = () => {
  return (
    <Router>
      <div className="f">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vaccination" element={<Vaccination />} />

          {/* Nested Routes for Authentication */}
          <Route path="/auth" element={<Authentication />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
