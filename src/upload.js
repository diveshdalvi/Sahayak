import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase.js"; // Ensure correct import of db

const uploadDataToFirestore = async () => {
  const areasData = [
    {
      areaName: "Colaba",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Cuffe Parade",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Marine Lines",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Fort",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Nariman Point",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Malabar Hill",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Churchgate",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Andheri",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Bandra",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Juhu",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Santacruz",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Khar",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Goregaon",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Malad",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Kandivali",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Borivali",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Dahisar",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Chembur",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Ghatkopar",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Kurla",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Vikhroli",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Mulund",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Nahur",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Vashi",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Nerul",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Belapur",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Kharghar",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Panvel",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Thane",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Virar",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Vasai",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Nallasopara",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
    {
      areaName: "Mira Road",
      diseases: {
        Hypertension: 0,
        Diabetes: 0,
        Asthma: 0,
        Anemia: 0,
        Hypothyroidism: 0,
        "Pre-eclampsia": 0,
        Malaria: 0,
        Cholera: 0,
        Hepatitis: 0,
        Typhoid: 0,
        Dengue: 0,
        Tuberculosis: 0,
      },
    },
  ];

  try {
    for (const area of areasData) {
      // Use areaName as the document ID and store only the diseases field
      const areaRef = doc(db, "areas", area.areaName);
      await setDoc(areaRef, { diseases: area.diseases });
      console.log(`Uploaded ${area.areaName} successfully.`);
    }
    console.log("All data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

// Call the function once to upload data
uploadDataToFirestore();
