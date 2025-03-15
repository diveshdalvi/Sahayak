
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EmergencyContacts from "./pages/EmergencyContacts";
import Authentication from "./pages/Authentication";

import About from "./pages/about";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";

const App = () => {
  return (
    <Router>
      <div className="f">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/about" element={<About />} />
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
