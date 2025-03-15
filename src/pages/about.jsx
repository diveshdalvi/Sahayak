import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const About = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [disease, setDisease] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [vaccinationDetails, setVaccinationDetails] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <div className="flex flex-col p-4 space-y-4">
      {/* User Info Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">User Information</h2>
        <p>
          <strong>Name:</strong> {userInfo.name}
        </p>
        <p>
          <strong>Age:</strong> {userInfo.age}
        </p>
        <p>
          <strong>Gender:</strong> {userInfo.gender}
        </p>
        <p>
          <strong>Mobile Number:</strong> {userInfo.phone}
        </p>
        <p>
          <strong>Blood Group:</strong> {userInfo.bloodType}
        </p>
      </div>

      {/* Disease Info Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Health Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Diagnosed Disease:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />
        </div>
        {userInfo.gender === "female" && (
          <div className="mb-4">
            <label className="block text-gray-700">Pregnancy Status:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={pregnancyStatus}
              onChange={(e) => setPregnancyStatus(e.target.value)}
            />
          </div>
        )}
        {userInfo.type === "children" && (
          <div className="mb-4">
            <label className="block text-gray-700">Vaccination Details:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={vaccinationDetails}
              onChange={(e) => setVaccinationDetails(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Calendar Section */}
      {(userInfo.gender === "female" || userInfo.type === "children") && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Health Calendar</h2>
          <p>Track your health status and appointments here.</p>
          {/* Placeholder for calendar component */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Calendar will be displayed here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
