import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { FaArrowRight, FaCheckCircle, FaSyringe } from "react-icons/fa";
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.png";
import img3 from "../assets/images/img3.png";
const Landing = () => {
  const navigate = useNavigate();

  const recommendedPrograms = [
    {
      title: "Free Health Checkups",
      organization: "Wellness for All",
      date: "April 10, 2024",
      description:
        "Free medical checkups and consultations for the underprivileged.",
      imageUrl: img1, // Replace with actual image URL
    },
    {
      title: "Blood Donation Camp",
      organization: "Red Cross Society",
      date: "April 18, 2024",
      description: "Encouraging voluntary blood donation to save lives.",
      imageUrl: img2, // Replace with actual image URL
    },
    {
      title: "Mental Health Awareness",
      organization: "MindCare Foundation",
      date: "April 22, 2024",
      description: "Workshops on mental well-being and stress management.",
      imageUrl: img3, // Replace with actual image URL
    },
  ];

  const vaccinations = [
    {
      date: new Date(2025, 1, 15),
      vaccine: "COVID-19",
      type: "Booster Shot",
      location: "City Hospital",
      time: "10:00 AM",
      notes: "Bring vaccination card",
    },
    {
      date: new Date(2025, 1, 28),
      vaccine: "MMR",
      type: "First Dose",
      location: "Family Clinic",
      time: "9:30 AM",
      notes: "Pediatric vaccination",
    },
    {
      date: new Date(2025, 2, 10),
      vaccine: "Flu Shot",
      type: "Annual Vaccination",
      location: "Community Clinic",
      time: "2:30 PM",
      notes: "No appointment needed",
    },
    {
      date: new Date(2025, 2, 22),
      vaccine: "Tdap",
      type: "Booster",
      location: "Health Center",
      time: "3:45 PM",
      notes: "Every 10 years",
    },
    {
      date: new Date(2025, 3, 5),
      vaccine: "Hepatitis B",
      type: "Second Dose",
      location: "Medical Center",
      time: "11:15 AM",
      notes: "Fasting required",
    },
    {
      date: new Date(2025, 3, 18), // Past vaccination
      vaccine: "HPV",
      type: "Third Dose",
      location: "Women's Clinic",
      time: "1:00 PM",
      notes: "Final dose of series",
    },
    {
      date: new Date(2025, 4, 7),
      vaccine: "Pneumonia",
      type: "Single Dose",
      location: "Senior Care Center",
      time: "10:45 AM",
      notes: "Recommended for 65+",
    },
    {
      date: new Date(2025, 4, 25),
      vaccine: "Shingles",
      type: "First Dose",
      location: "Wellness Center",
      time: "4:00 PM",
      notes: "For adults 50+",
    },
  ];

  const today = new Date();

  return (
    <div className="bg-blue-100 min-h-screen p-4 flex flex-col items-center">
      {/* Navbar */}
      <Navbar />

      {/* Title Section */}
      <h1 className="text-2xl font-bold mt-20 text-gray-800 text-center">
        Welcome to Sahayak
      </h1>
      <button
        className="flex items-center gap-2 mt-2 text-blue-600 font-semibold"
        onClick={() => navigate("/map")}
      >
        Explore <FaArrowRight />
      </button>

      {/* Recommended Section */}
      <div className="w-full mt-6">
        <div className="flex justify-between px-2">
          <h2 className="text-lg font-bold">Recommended</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto p-2">
          {recommendedPrograms.map((program, index) => (
            <div
              key={index}
              className="w-48 bg-white rounded-lg shadow-md p-3 flex-shrink-0"
            >
              <img
                src={program.imageUrl}
                alt={program.title}
                className="h-24 w-full rounded-lg object-cover"
              />
              <h3 className="mt-2 font-semibold">{program.title}</h3>
              <p className="text-sm text-gray-500">{program.organization}</p>
              <p className="text-sm text-gray-500">{program.date}</p>
              <p className="text-sm text-gray-500">{program.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Section - Vaccination Timeline */}
      
    </div>
  );
};

export default Landing;
