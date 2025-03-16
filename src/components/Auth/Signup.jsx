import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Droplet,
  CreditCard,
  Lock,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import vaccinesData from "../../Data/vaccines.json";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    area: "",
    bloodType: "",
    aadhaar: "",
    password: "",
    // Additional fields:
    isAnyDisease: "no", // default status for disease (will be updated later in Profile)
    pregnancyStatus: "", // created in DB but not collected from UI
    pregnancyDate: "", // created in DB but not collected from UI
  });

  const navigate = useNavigate();

  // Fetch areas from Firestore
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasCol = collection(db, "areas");
        const snapshot = await getDocs(areasCol);
        const areasList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, name: data.areaName || doc.id };
        });
        setAreas(areasList);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Calculate age in years
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Determine user type based on age
  const determineUserType = (age) => {
    if (age <= 12) return "children";
    if (age > 12 && age <= 55) return "adult";
    return "senior citizen";
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dob);
    const userType = determineUserType(age);
    const email = `${formData.phone}@sahayak.com`;

    // For children, compute upcoming vaccine details from the JSON schedule
    let vaccinationStatus = null;
    if (userType === "children") {
      const childDob = new Date(formData.dob);
      const currentDate = new Date();
      vaccinationStatus = [];
      vaccinesData.vaccinationSchedule.forEach((schedule) => {
        Object.entries(schedule.vaccines).forEach(([vaccine, data]) => {
          data.doses.forEach((dose) => {
            const dueDate = new Date(childDob);
            dueDate.setMonth(dueDate.getMonth() + dose.dueAt);
            if (dueDate > currentDate) {
              vaccinationStatus.push({
                vaccine,
                doseNumber: dose.doseNumber,
                dueDate: dueDate.toISOString(),
                completed: false,
                scheduleAge: schedule.ageRange,
              });
            }
          });
        });
      });
    }

    const userData = {
      ...formData,
      userType,
      vaccinationStatus,
      age,
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        formData.password
      );
      const userId = userCredential.user.uid;
      await setDoc(doc(db, "users", userId), userData);
      toast.success("Account created successfully!");
      navigate("/"); // Redirect to login after signup
    } catch (err) {
      toast.error("Signup failed. Try again.");
      console.error(err);
    }
  };

  // Compute today's date in YYYY-MM-DD format for the max attribute in dob field
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 p-4 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {step === 4 ? "Set Password" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <InputField
                label="Full Name"
                icon={User}
                type="text"
                field="name"
                formData={formData}
                setFormData={setFormData}
              />
              <InputField
                label="Date of Birth"
                icon={Calendar}
                type="date"
                field="dob"
                formData={formData}
                setFormData={setFormData}
                max={todayString}
              />
              <GenderSelection formData={formData} setFormData={setFormData} />
            </>
          )}

          {step === 2 && (
            <>
              <InputField
                label="Phone Number"
                icon={Phone}
                type="tel"
                pattern="[0-9]{10}"
                field="phone"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
                minLength={10}
              />
              <InputField
                label="Aadhaar Number"
                icon={CreditCard}
                type="text"
                pattern="[0-9]{12}"
                field="aadhaar"
                formData={formData}
                setFormData={setFormData}
                maxLength={12}
                minLength={12}
              />
            </>
          )}

          {step === 3 && (
            <>
              <DropdownField
                label="Area"
                icon={MapPin}
                // Use areas fetched from Firestore
                options={areas.map((area) => area.name)}
                field="area"
                formData={formData}
                setFormData={setFormData}
              />
              <DropdownField
                label="Blood Type"
                icon={Droplet}
                options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                field="bloodType"
                formData={formData}
                setFormData={setFormData}
              />
              {/* Pregnancy fields removed from UI */}
            </>
          )}

          {step === 4 && (
            <>
              <InputField
                label="Password"
                icon={Lock}
                type="password"
                field="password"
                formData={formData}
                setFormData={setFormData}
              />
            </>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Sign Up
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  icon: Icon,
  type,
  field,
  formData,
  setFormData,
  pattern,
  max,
  maxLength,
  minLength,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type={type}
        pattern={pattern}
        required
        max={max}
        maxLength={maxLength}
        minLength={minLength}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      />
    </div>
  </div>
);

const DropdownField = ({
  label,
  icon: Icon,
  options,
  field,
  formData,
  setFormData,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <select
        required
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const GenderSelection = ({ formData, setFormData }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Gender</label>
    <div className="grid grid-cols-3 gap-3">
      {["Male", "Female", "Transgender"].map((gender) => (
        <label
          key={gender}
          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
            formData.gender === gender
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="gender"
            value={gender}
            className="sr-only"
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          />
          {gender}
        </label>
      ))}
    </div>
  </div>
);

export default Signup;
