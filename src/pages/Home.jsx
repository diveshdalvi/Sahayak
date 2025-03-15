import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';  // Add Circle import
import L from 'leaflet';
import Navbar from '../components/common/Navbar';

// Fix for Leaflet marker icons
// We need to redefine the default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
  // State for controlling the slider position
  const [sliderPosition, setSliderPosition] = useState('closed');
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sliderRef = useRef(null);
  
  // // Generate random radius between 200-1000 meters
  // const getRandomRadius = () => Math.floor(Math.random() * (1000 - 200 + 1) + 200);
  
  // // Generate random color with moderate opacity
  // const getRandomColor = () => {
  //   const colors = ['#FF000080', '#00FF0080', '#0000FF80', '#FFA50080', '#80008080'];
  //   return colors[Math.floor(Math.random() * colors.length)];
  // };

  const getDangerColor = (level) => {
    const colors = {
      high: '#FF0000B0',    // Red with high opacity
      medium: '#FFA500B0',  // Orange with high opacity
      low: '#FFFF00B0'      // Yellow with high opacity
    };
    return colors[level] || colors.low;
  };

  // Generate radius based on danger level
  const getDangerRadius = (level) => {
    const radiusMap = {
      high: Math.floor(Math.random() * (1000 - 800) + 800),    // 800-1000m
      medium: Math.floor(Math.random() * (800 - 500) + 500),   // 500-800m
      low: Math.floor(Math.random() * (500 - 200) + 200)       // 200-500m
    };
    return radiusMap[level] || radiusMap.low;
  };

  // Mock data for pinpoints - replace with API fetch later
  const [locations] = useState([
    { 
      id: 1, 
      name: "Chemical Spill Zone", 
      description: "Hazardous chemical spill reported in this area", 
      lat: 40.7812, 
      lng: -73.9665, 
      dangerLevel: "high",
      events: ["Chemical Cleanup Operation", "Area Evacuation in Progress"],
      radius: getDangerRadius("high"),
      color: getDangerColor("high")
    },
    { 
      id: 2, 
      name: "Flood Risk Area", 
      description: "Moderate flooding risk due to heavy rainfall", 
      lat: 40.7484, 
      lng: -73.9857, 
      dangerLevel: "medium",
      events: ["Flood Warning Active", "Sandbag Distribution"],
      radius: getDangerRadius("medium"),
      color: getDangerColor("medium")
    },
    { 
      id: 3, 
      name: "Construction Hazard", 
      description: "Ongoing construction with falling debris risk", 
      lat: 40.7580, 
      lng: -73.9855, 
      dangerLevel: "low",
      events: ["Construction Work", "Use Alternative Route"],
      radius: getDangerRadius("low"),
      color: getDangerColor("low")
    },
    { 
      id: 4, 
      name: "Gas Leak Zone", 
      description: "Gas leak reported - Area under monitoring", 
      lat: 40.7061, 
      lng: -73.9969, 
      dangerLevel: "high",
      events: ["Gas Line Repair", "Emergency Response Active"],
      radius: getDangerRadius("high"),
      color: getDangerColor("high")
    },
    { 
      id: 5, 
      name: "Power Outage Area", 
      description: "Electrical hazard due to fallen power lines", 
      lat: 40.6892, 
      lng: -74.0445, 
      dangerLevel: "medium",
      events: ["Power Line Repairs", "Emergency Services Present"],
      radius: getDangerRadius("medium"),
      color: getDangerColor("medium")
    },
  ]);
  
  // Currently selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Add this new function to get all events
  const getAllEvents = () => {
    return locations.reduce((acc, location) => {
      return acc.concat(
        location.events.map(event => ({
          event,
          location: location.name
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
    
    if (diff > 50 && sliderPosition === 'closed') {
      setSliderPosition('peek');
    } else if (diff > 150 && sliderPosition === 'peek') {
      setSliderPosition('open');
    } else if (diff < -50 && sliderPosition === 'open') {
      setSliderPosition('peek');
    } else if (diff < -100 && sliderPosition === 'peek') {
      setSliderPosition('closed');
    }
  };

  // Handle marker click
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setSliderPosition('peek');
  };

  // Calculate slider height based on position
  const getSliderHeight = () => {
    switch (sliderPosition) {
      case 'closed':
        return '30px';
      case 'peek':
        return '200px';
      case 'open':
        return '70vh';
      default:
        return '30px';
    }
  };

  // Mock function to fetch data from API
  const fetchLocations = async () => {
    // Replace this with actual API call
    // Example: const response = await fetch('/api/locations');
    // const data = await response.json();
    // setLocations(data);
    
    // For now, we're using the mock data already set
    console.log('In the future, this will fetch data from an API');
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
        center={[40.7128, -74.0060]} 
        zoom={12} 
        className="h-screen w-screen z-[997]"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map(location => (
          <React.Fragment key={location.id}>
            <Circle
              center={[location.lat, location.lng]}
              radius={location.radius}
              pathOptions={{
                fillColor: location.color,
                fillOpacity: 0.5,
                color: location.color,
                weight: 1
              }}
            />
            <Marker 
              position={[location.lat, location.lng]}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <div className="font-sans">
                  <strong className="text-lg">{location.name}</strong>
                  <div className={`text-sm mt-1 font-bold ${
                    location.dangerLevel === 'high' ? 'text-red-600' :
                    location.dangerLevel === 'medium' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`}>
                    Danger Level: {location.dangerLevel.toUpperCase()}
                  </div>
                  <p className="mt-1 text-gray-600">{location.description}</p>
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
              
              {sliderPosition === 'open' && (
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
                    <h3 className="font-medium text-lg text-gray-900">{item.event}</h3>
                    <p className="text-gray-600 text-sm">at {item.location}</p>
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