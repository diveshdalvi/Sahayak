import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  CreditCard,
  Lock,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    area: "",
    bloodType: "",
    aadhaar: "",
    password: "",
  });

  const navigate = useNavigate();

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const determineUserType = (age) => {
    if (age <= 12) return "children";
    if (age > 12 && age <= 55) return "adult";
    return "senior citizen";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dob);
    const userType = determineUserType(age);
    const email = `${formData.phone}@sahayak.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        formData.password
      );
      const userId = userCredential.user.uid;

      const userData = {
        ...formData,
        userType,
        vaccinationStatus: userType === "children" ? {} : null,
        age,
      };

      await setDoc(doc(db, "users", userId), userData);
      toast.success("Account created successfully!");
      navigate("/login"); // Redirect to login after signup
    } catch (err) {
      toast.error("Signup failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 p-4 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          />
          <GenderSelection formData={formData} setFormData={setFormData} />
          <InputField
            label="Phone Number"
            icon={Phone}
            type="tel"
            pattern="[0-9]{10}"
            field="phone"
            formData={formData}
            setFormData={setFormData}
          />
          <InputField
            label="Aadhaar Number"
            icon={CreditCard}
            type="text"
            pattern="[0-9]{12}"
            field="aadhaar"
            formData={formData}
            setFormData={setFormData}
          />
          <DropdownField
            label="Area"
            icon={MapPin}
            options={mumbaiAreas}
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
          <InputField
            label="Password"
            icon={Lock}
            type="password"
            field="password"
            formData={formData}
            setFormData={setFormData}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        {/* Already have an account? Login */}
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
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type={type}
        pattern={pattern}
        required
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <label className="text-sm font-medium text-gray-700 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <select
        required
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <label className="text-sm font-medium text-gray-700 block">Gender</label>
    <div className="grid grid-cols-3 gap-3">
      {["Male", "Female", "Trans"].map((gender) => (
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

const mumbaiAreas = [
  "Andheri",
  "Bandra",
  "Borivali",
  "Dadar",
  "Powai",
  "Worli",
];

export default Signup;
