import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/common/Navbar";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you have this import

// Fix for Leaflet marker icons
// We need to redefine the default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Add this component for map centering
const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setPosition(userLocation);
          map.flyTo([latitude, longitude], 13);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Mumbai center if location access denied
          const mumbaiCenter = { lat: 19.0760, lng: 72.8777 };
          setPosition(mumbaiCenter);
          map.flyTo([mumbaiCenter.lat, mumbaiCenter.lng], 11);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={[position.lat, position.lng]} 
      icon={new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        <div className="font-sans">
          <strong>Your Location</strong>
          <p className="text-sm text-gray-600 mt-1">You are currently here</p>
        </div>
      </Popup>
    </Marker>
  );
}

const Home = () => {
  // Add red marker icon at the top of the component
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Add Mumbai area coordinates mapping
  const MUMBAI_AREAS = {
    "Airoli": { lat: 19.1590, lng: 72.9986 },
    "Andheri": { lat: 19.1136, lng: 72.8697 },
    "Bandra": { lat: 19.0596, lng: 72.8295 },
    "Borivali": { lat: 19.2307, lng: 72.8567 },
    "Chembur": { lat: 19.0522, lng: 72.9005 },
    "Colaba": { lat: 18.9067, lng: 72.8147 },
    "Dadar": { lat: 19.0178, lng: 72.8478 },
    "Dharavi": { lat: 19.0380, lng: 72.8538 },
    "Thane": { lat: 19.2183, lng: 72.9781 },
    "Vashi": { lat: 19.0745, lng: 72.9978 },
    // Add more areas as needed
  };

  // State for controlling the slider position
  const [sliderPosition, setSliderPosition] = useState("closed");
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sliderRef = useRef(null);

  const [locations, setLocations] = useState([]);

  const getDangerColor = (level) => {
    const colors = {
      high: "#FF0000B0", // Red with high opacity
      medium: "#FFA500B0", // Orange with high opacity
      low: "#FFFF00B0", // Yellow with high opacity
    };
    return colors[level] || colors.low;
  };

  // Generate radius based on danger level
  const getDangerRadius = (level) => {
    const radiusMap = {
      high: Math.floor(Math.random() * (2000 - 1500) + 1500), // 1500-2000m
      medium: Math.floor(Math.random() * (1500 - 1000) + 1000), // 1000-1500m
      low: Math.floor(Math.random() * (1000 - 500) + 500), // 500-1000m
    };
    return radiusMap[level] || radiusMap.low;
  };

  // Modified getCoordinates function with fallback
  const getCoordinates = async (areaName) => {
    try {
      // First check our predefined coordinates
      if (MUMBAI_AREAS[areaName]) {
        return MUMBAI_AREAS[areaName];
      }

      // If not in our mapping, try geocoding with delay
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      const searchQuery = `${areaName}, Mumbai, India`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }

      // Fallback to Mumbai center coordinates with slight offset
      const baseCoords = { lat: 19.0760, lng: 72.8777 };
      return {
        lat: baseCoords.lat + (Math.random() - 0.5) * 0.02,
        lng: baseCoords.lng + (Math.random - 0.5) * 0.02,
      };

    } catch (error) {
      console.error("Geocoding error for area:", areaName, error);
      // Fallback to Mumbai center coordinates with slight offset
      const baseCoords = { lat: 19.0760, lng: 72.8777 };
      return {
        lat: baseCoords.lat + (Math.random() - 0.5) * 0.02,
        lng: baseCoords.lng + (Math.random() - 0.5) * 0.02
      };
    }
  };

  // Transform Firebase data to location format
  const transformAreaToLocation = async (area, id) => {
    // Get all diseases with patient count > 0
    const activeDiseases = Object.entries(area.diseases)
      .filter(([_, count]) => count > 0)
      .map(([disease, count]) => ({
        name: disease,
        count: count
      }));

    if (activeDiseases.length === 0) return null;

    const coordinates = await getCoordinates(id);
    
    if (!coordinates) {
      console.error(`Could not get coordinates for ${id}`);
      return null;
    }

    // Calculate total patients
    const totalPatients = activeDiseases.reduce((sum, disease) => sum + disease.count, 0);

    // Determine danger level based on total patients
    const getDangerLevelFromCount = (count) => {
      if (count >= 20) return "high";
      if (count >= 10) return "medium";
      return "low";
    };

    const dangerLevel = getDangerLevelFromCount(totalPatients);

    return {
      id,
      name: id,
      description: `${totalPatients} total cases detected in ${id}`,
      lat: coordinates.lat,
      lng: coordinates.lng,
      dangerLevel,
      diseases: activeDiseases,
      totalPatients,
      events: activeDiseases.map(d => `${d.name}: ${d.count} patient(s)`),
      radius: getDangerRadius(dangerLevel),
      color: getDangerColor(dangerLevel)
    };
  };

  // Replace the mock fetchLocations with Firebase fetch
  const fetchLocations = async () => {
    try {
      const areasCollection = collection(db, 'areas');
      const areasSnapshot = await getDocs(areasCollection);
      
      // Use Promise.all to handle multiple async transformations
      const locationPromises = areasSnapshot.docs.map(doc => 
        transformAreaToLocation(doc.data(), doc.id)
      );

      const locationData = (await Promise.all(locationPromises))
        .filter(location => location !== null);

      setLocations(locationData);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]); // Set empty array on error
    }
  };

  // Currently selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Add this new function to get all events
  const getAllEvents = () => {
    return locations.reduce((acc, location) => {
      return acc.concat(
        location.events.map((event) => ({
          event,
          location: location.name,
        }))
      );
    }, []);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    setCurrentY(e.touches[0].clientY);
    const diff = startY - currentY;

    if (diff > 50 && sliderPosition === "closed") {
      setSliderPosition("peek");
    } else if (diff > 150 && sliderPosition === "peek") {
      setSliderPosition("open");
    } else if (diff < -50 && sliderPosition === "open") {
      setSliderPosition("peek");
    } else if (diff < -100 && sliderPosition === "peek") {
      setSliderPosition("closed");
    }
  };

  // Handle marker click
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setSliderPosition("peek");
  };

  // Calculate slider height based on position
  const getSliderHeight = () => {
    switch (sliderPosition) {
      case "closed":
        return "30px";
      case "peek":
        return "200px";
      case "open":
        return "70vh";
      default:
        return "30px";
    }
  };

  useEffect(() => {
    // Fetch locations when component mounts
    fetchLocations();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative w-screen h-screen overflow-hidden mt-16">
        <MapContainer
          center={[19.0760, 72.8777]} // Mumbai coordinates
          zoom={11} // Adjusted zoom level
          className="h-screen w-screen z-[997]"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          {locations.map((location) => (
            <React.Fragment key={location.id}>
              <Circle
                center={[location.lat, location.lng]}
                radius={location.radius}
                pathOptions={{
                  fillColor: location.color,
                  fillOpacity: 0.5,
                  color: location.color,
                  weight: 1,
                }}
              />
              <Marker
                position={[location.lat, location.lng]}
                icon={redIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup>
                  <div className="font-sans">
                    <strong className="text-lg">{location.name}</strong>
                    <div
                      className={`text-sm mt-1 font-bold ${
                        location.dangerLevel === "high"
                          ? "text-red-600"
                          : location.dangerLevel === "medium"
                          ? "text-orange-500"
                          : "text-yellow-500"
                      }`}
                    >
                      Total Cases: {location.totalPatients}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Active Diseases:</p>
                      <ul className="list-disc pl-4 mt-1">
                        {location.diseases.map((disease, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {disease.name}: {disease.count} patient(s)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          <div className="absolute top-5 right-5 bg-white p-4 rounded-lg shadow-md z-[1000]">
            <h3 className="font-bold mb-2">Danger Levels</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-70 mr-2"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-orange-500 opacity-70 mr-2"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-70 mr-2"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>
        </MapContainer>

        <div
          ref={sliderRef}
          className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-[1000] overflow-hidden transition-[height] duration-300 ease-out"
          style={{ height: getSliderHeight() }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="flex justify-center items-center h-[30px] cursor-grab">
            <div className="w-10 h-[5px] bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-5 pb-5 overflow-y-auto max-h-[calc(100%-30px)]">
            {selectedLocation ? (
              <>
                <h2 className="mt-0 mb-2.5 text-2xl font-semibold md:text-xl">
                  {selectedLocation.name}
                </h2>
                <p className="mt-0 text-gray-600">
                  {selectedLocation.description}
                </p>

                {sliderPosition === "open" && (
                  <div className="mt-5">
                    <h3 className="mb-2.5 text-lg font-semibold md:text-base">
                      Events
                    </h3>
                    <ul className="pl-5 mb-5">
                      {selectedLocation.events.map((event, index) => (
                        <li key={index} className="mb-1.5">
                          {event}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                      <p>Latitude: {selectedLocation.lat}</p>
                      <p>Longitude: {selectedLocation.lng}</p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded mt-2.5 cursor-pointer">
                        Get Directions
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-4">
                <h2 className="text-2xl font-semibold mb-4">All Events</h2>
                <div className="space-y-4">
                  {getAllEvents().map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-medium text-lg text-gray-900">
                        {item.event}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        at {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
