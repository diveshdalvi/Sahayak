import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Droplet,
  CreditCard,
  UserCheck,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Vaccination from "./Vaccination";
import { useAuth } from "../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

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

  if (!userInfo) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-4 border-b border-gray-100">
      <Icon className="w-5 h-5 text-gray-500 mr-3" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-500" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">
                    {userInfo.name}
                  </h1>
                  <span className="inline-block px-3 py-1 bg-blue-400 bg-opacity-50 rounded-full text-sm text-white capitalize mt-2">
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
              {userInfo.vaccinationStatus && (
                <Vaccination vaccinationStatus={userInfo.vaccinationStatus} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

// import React from "react";
// import {
//   User,
//   Calendar,
//   Phone,
//   MapPin,
//   Droplet,
//   CreditCard,
//   UserCheck,
// } from "lucide-react";
// import Navbar from "../components/common/Navbar";
// import Vaccination from "./Vaccination";

// // Static user data
// const userProfile = {
//   name: "John Doe",
//   dob: "1990-01-01",
//   gender: "Male",
//   phone: "9876543210",
//   area: "Andheri West",
//   bloodType: "O+",
//   aadhaar: "123456789012",
//   userType: "adult",
//   vaccinationStatus: {
//     covid19: "Fully Vaccinated",
//     polio: "Completed",
//     hepatitisB: "Completed",
//   },
// };

// const Profile = () => {
//   // eslint-disable-next-line no-unused-vars
//   const InfoRow = ({ icon: Icon, label, value }) => (
//     <div className="flex items-center p-4 border-b border-gray-100">
//       <Icon className="w-5 h-5 text-gray-500 mr-3" />
//       <div className="flex-1">
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-base font-medium text-gray-900">{value}</p>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-50 pt-20 pb-20">
//         <div className="max-w-3xl mx-auto px-4">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
//               <div className="flex items-center">
//                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
//                   <User className="w-10 h-10 text-blue-500" />
//                 </div>
//                 <div className="ml-6">
//                   <h1 className="text-2xl font-bold text-white">
//                     {userProfile.name}
//                   </h1>
//                   <span className="inline-block px-3 py-1 bg-blue-400 bg-opacity-50 rounded-full text-sm text-white capitalize mt-2">
//                     {userProfile.userType}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Profile Information */}
//             <div className="divide-y divide-gray-100">
//               <InfoRow
//                 icon={Calendar}
//                 label="Date of Birth"
//                 value={userProfile.dob}
//               />
//               <InfoRow
//                 icon={UserCheck}
//                 label="Gender"
//                 value={userProfile.gender}
//               />
//               <InfoRow
//                 icon={Phone}
//                 label="Phone Number"
//                 value={userProfile.phone}
//               />
//               <InfoRow icon={MapPin} label="Area" value={userProfile.area} />
//               <InfoRow
//                 icon={Droplet}
//                 label="Blood Type"
//                 value={userProfile.bloodType}
//               />
//               <InfoRow
//                 icon={CreditCard}
//                 label="Aadhaar Number"
//                 value={userProfile.aadhaar}
//               />
//               <Vaccination vaccinationStatus={userProfile.vaccinationStatus} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;
