import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Droplet,
  CreditCard,
  UserCheck,
  PlusCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../Context/AuthContext";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

// List of diseases for the dropdown
const diseaseOptions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Anemia",
  "Hypothyroidism",
  "Pre-eclampsia",
  "Malaria",
  "Cholera",
  "Hepatitis",
  "Typhoid",
  "Dengue",
  "Tuberculosis",
];

const Profile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  // For adding a disease from the dropdown
  const [selectedDisease, setSelectedDisease] = useState("");
  // Local state for pregnancy fields (only used if not already set in DB)
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [pregnancyDate, setPregnancyDate] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserInfo(data);
            // Initialize local pregnancy state from DB (if set)
            setPregnancyStatus(data.pregnancyStatus || "");
            setPregnancyDate(data.pregnancyDate || "");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  if (!userInfo) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Update Firestore when user adds a disease from the dropdown.
  // Also update the corresponding count in the user's area document.
  const addDisease = async () => {
    if (!selectedDisease.trim()) return;
    const updatedDiseases = [
      ...(userInfo.diseases || []),
      { name: selectedDisease, cured: false },
    ];

    try {
      // Update the user's diseases field.
      await updateDoc(doc(db, "users", user.uid), {
        diseases: updatedDiseases,
      });
      // Update the disease count in the area document.
      // Assumes userInfo.area holds the area document ID (e.g., "Borivali", "Vashi")
      const areaRef = doc(db, "areas", `${userInfo.area}`);
      await updateDoc(areaRef, {
        [`diseases.${selectedDisease}`]: increment(1),
      });
      setUserInfo({ ...userInfo, diseases: updatedDiseases });
      setSelectedDisease("");
    } catch (error) {
      console.error("Error updating diseases:", error);
    }
  };

  // Mark disease as cured and decrement the count in the area document.
  const markAsCured = async (index) => {
    const updatedDiseases = [...userInfo.diseases];
    const diseaseName = updatedDiseases[index].name;
    updatedDiseases[index].cured = true;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        diseases: updatedDiseases,
      });
      const areaRef = doc(db, "areas", `${userInfo.area}`);
      await updateDoc(areaRef, {
        [`diseases.${diseaseName}`]: increment(-1),
      });
      setUserInfo({ ...userInfo, diseases: updatedDiseases });
    } catch (error) {
      console.error("Error marking disease as cured:", error);
    }
  };

  // Updated pregnancy status function with error handling and logging.
  const updatePregnancyStatus = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        pregnancyStatus: pregnancyStatus,
        pregnancyDate: pregnancyDate,
      });
      setUserInfo({ ...userInfo, pregnancyStatus, pregnancyDate });
      console.log("Pregnancy status updated:", pregnancyStatus, pregnancyDate);
    } catch (error) {
      console.error("Error updating pregnancy status:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-500 px-6 py-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-500" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">
                    {userInfo.name}
                  </h1>
                  <span className="inline-block text-black px-3 py-1 bg-white bg-opacity-30 rounded-full text-sm capitalize mt-2">
                    {userInfo.userType}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="divide-y divide-gray-100">
              <InfoRow
                icon={Calendar}
                label="Date of Birth"
                value={userInfo.dob}
              />
              <InfoRow
                icon={UserCheck}
                label="Gender"
                value={userInfo.gender}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={userInfo.phone}
              />
              <InfoRow icon={MapPin} label="Area" value={userInfo.area} />
              <InfoRow
                icon={Droplet}
                label="Blood Type"
                value={userInfo.bloodType}
              />
              <InfoRow
                icon={CreditCard}
                label="Aadhaar Number"
                value={userInfo.aadhaar}
              />
            </div>

            {/* Diagnosed Diseases Section */}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Diagnosed Diseases</h2>
              {userInfo.diseases?.length > 0 ? (
                userInfo.diseases.map((disease, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
                  >
                    <span>{disease.name}</span>
                    {!disease.cured ? (
                      <button
                        onClick={() => markAsCured(index)}
                        className="text-green-600 flex items-center"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" /> Mark as Cured
                      </button>
                    ) : (
                      <span className="text-gray-500">Cured</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No diseases recorded.</p>
              )}
              {/* Add Disease Dropdown */}
              <div className="flex mt-4">
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="border p-2 flex-1 rounded-l-lg"
                >
                  <option value="">Select Disease</option>
                  {diseaseOptions.map((disease, index) => (
                    <option key={index} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addDisease}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pregnancy Section (For Female Users) */}
            {userInfo.gender === "Female" && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Pregnancy Status</h2>
                {userInfo.pregnancyStatus ? (
                  // Read-only if pregnancy details are already set
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Status: {userInfo.pregnancyStatus}
                    </p>
                    {userInfo.pregnancyStatus === "Pregnant" && (
                      <p className="text-sm font-medium text-gray-700">
                        Pregnancy Date: {userInfo.pregnancyDate}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      Pregnancy details cannot be changed once set.
                    </p>
                  </div>
                ) : (
                  // Otherwise, allow the user to update the details
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        value={pregnancyStatus}
                        onChange={(e) => setPregnancyStatus(e.target.value)}
                        className="border p-2 w-full rounded-lg"
                      >
                        <option value="">Select Status</option>
                        <option value="Pregnant">Pregnant</option>
                        <option value="Not Pregnant">Not Pregnant</option>
                      </select>
                    </div>
                    {pregnancyStatus === "Pregnant" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pregnancy Date
                        </label>
                        <input
                          type="date"
                          value={pregnancyDate}
                          onChange={(e) => setPregnancyDate(e.target.value)}
                          className="border p-2 w-full rounded-lg"
                        />
                      </div>
                    )}
                    <button
                      onClick={updatePregnancyStatus}
                      className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg w-full"
                    >
                      Update Status
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center p-4 border-b border-gray-100">
    <Icon className="w-5 h-5 text-gray-500 mr-3" />
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default Profile;
